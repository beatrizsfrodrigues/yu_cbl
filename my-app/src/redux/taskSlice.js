import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthToken } from "../utils/storageUtils";

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Retorna um objeto { headers: { Authorization: "Bearer <token>" } }
 * ou {} se não houver token.
 */
function authorizedConfig() {
  const token = getAuthToken();
  if (!token) return {};
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
}

// ======================
// 1) Obter todas as tasks
// ======================
export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }

      const queryParams = new URLSearchParams({
        userId,
        page,
        limit,
      });

      const res = await axios.get(
        `${API_URL}/tasks?${queryParams.toString()}`,
        config
      );

      return res.data; // retorna tudo (tasks, page, total, etc.)
    } catch (error) {
      const apiError = error.response?.data;
      if (apiError && typeof apiError === "object" && apiError.msg) {
        return rejectWithValue(apiError.msg);
      }
      return rejectWithValue(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.message
      );
    }
  }
);

// ======================
// 2) Adicionar nova task
// ======================
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async ({ title, description }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }

      const res = await axios.post(
        `${API_URL}/tasks`,
        { title, description },
        config
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================
// 3) Completar task
// ======================
export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async ({ picture, id }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }

      const res = await axios.patch(
        `${API_URL}/tasks/${id}/complete`,
        { picture },
        config
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================
// 4) Verificar task
// ======================
export const verifyTask = createAsyncThunk(
  "tasks/verifyTask",
  async ({ id, rejectMessage, verify }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }

      const res = await axios.patch(
        `${API_URL}/tasks/${id}/verify`,
        { rejectMessage, verify },
        config
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================
// 5) Remover mensagem de rejeição
// ======================
export const removeRejectMessage = createAsyncThunk(
  "tasks/removeRejectMessage",
  async (id, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }

      const res = await axios.patch(
        `${API_URL}/tasks/${id}/remove-reject-message`,
        {},
        config
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================
// 6) Notificar task
// ======================
export const notifyTasks = createAsyncThunk(
  "tasks/notifyTasks",
  async (id, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }

      const res = await axios.patch(
        `${API_URL}/tasks/${id}/notification`,
        {},
        config
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Funções auxiliares de estado
const setLoading = (state) => {
  state.status = "loading";
  state.error = null;
};

const setError = (state, action) => {
  state.status = "failed";
  state.error = action.payload || action.error.message;
};

const updateTaskInState = (state, action) => {
  state.status = "succeeded";
  const index = state.data.findIndex((task) => task.id === action.payload.id);
  if (index !== -1) {
    state.data[index] = action.payload;
  }
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getTasks
      .addCase(getTasks.pending, setLoading)
      .addCase(getTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getTasks.rejected, setError)

      // addTask
      .addCase(addTask.pending, setLoading)
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(addTask.rejected, setError)

      // completeTask
      .addCase(completeTask.pending, setLoading)
      .addCase(completeTask.fulfilled, updateTaskInState)
      .addCase(completeTask.rejected, setError)

      // verifyTask
      .addCase(verifyTask.pending, setLoading)
      .addCase(verifyTask.fulfilled, updateTaskInState)
      .addCase(verifyTask.rejected, setError)

      // removeRejectMessage
      .addCase(removeRejectMessage.pending, setLoading)
      .addCase(removeRejectMessage.fulfilled, updateTaskInState)
      .addCase(removeRejectMessage.rejected, setError)

      // notifyTasks
      .addCase(notifyTasks.pending, setLoading)
      .addCase(notifyTasks.fulfilled, updateTaskInState)
      .addCase(notifyTasks.rejected, setError);
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
