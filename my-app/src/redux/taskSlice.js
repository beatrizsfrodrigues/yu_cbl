import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/tasks?userId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      return res.data.tasks;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async ({ title, description }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/tasks`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async ({ picture, id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${API_URL}/tasks/${id}/complete`,
        { picture },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyTask = createAsyncThunk(
  "tasks/verifyTask",
  async ({ id, rejectMessage, verify }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${API_URL}/tasks/${id}/verify`,
        { rejectMessage, verify },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeRejectMessage = createAsyncThunk(
  "tasks/removeRejectMessage",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${API_URL}/tasks/${id}/remove-reject-message`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const notifyTasks = createAsyncThunk(
  "tasks/notifyTasks",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `${API_URL}/tasks/${id}/notification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const setLoading = (state) => {
  state.status = "loading";
  state.error = null;
};

const setError = (state, action) => {
  state.status = "failed";
  state.error = action.error.message;
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

      // update-related thunks
      .addCase(completeTask.pending, setLoading)
      .addCase(completeTask.fulfilled, updateTaskInState)
      .addCase(completeTask.rejected, setError)

      .addCase(verifyTask.pending, setLoading)
      .addCase(verifyTask.fulfilled, updateTaskInState)
      .addCase(verifyTask.rejected, setError)

      .addCase(removeRejectMessage.pending, setLoading)
      .addCase(removeRejectMessage.fulfilled, updateTaskInState)
      .addCase(removeRejectMessage.rejected, setError)

      .addCase(notifyTasks.pending, setLoading)
      .addCase(notifyTasks.fulfilled, updateTaskInState)
      .addCase(notifyTasks.rejected, setError);
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
