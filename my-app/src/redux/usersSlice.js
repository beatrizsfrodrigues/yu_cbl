import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getAuthToken,
  setAuthUser,
  clearAuthStorage,
  getAuthUser as getStoredUser,
  setAuthToken as setTokenInStorage,
} from "../utils/storageUtils";

import {
  getTasks,
  completeTask,
  verifyTask,
  removeRejectMessage,
  notifyTasks,
} from "./taskSlice";

// import { rejectTask, addTask } from "./taskSlice";
import { sendMessage } from "./messagesSlice";

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

const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/users/signup`,
        { username, email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { user, token } = res.data;

      setAuthUser(user);
      localStorage.setItem("authToken", token);

      return { user, token };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return rejectWithValue(msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ emailOrUsername, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/users/login`,
        { emailOrUsername, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const { token, user } = res.data;
      setAuthUser(user);
      localStorage.setItem("authToken", token);

      return { user, token };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return rejectWithValue(msg);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (credentialResponse, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/users/google-login`, {
        credential: credentialResponse.credential,
      });

      const { token, user } = res.data;

      if (token && user) {
        setAuthUser(user);
        setTokenInStorage(token);
        return res.data;
      } else {
        return rejectWithValue(
          "Google login succeeded, but token or user data was missing."
        );
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.error(
        "Error sending Google token to backend:",
        error.response ? error.response.data : error.message
      );
      return rejectWithValue(msg || "Erro ao fazer login com Google.");
    }
  }
);

export const fetchAuthUser = createAsyncThunk(
  "user/fetchAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }
      const res = await axios.get(`${API_URL}/users/me`, config);
      setAuthUser(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 2) Fluxo “rejeitar + nova tarefa + notificar”
export const createNewTaskAfterRejection = createAsyncThunk(
  "user/createNewTaskAfterRejection",
  async (
    { userId, partnerId, task, message, newTaskTitle, newTaskDescription },
    { dispatch, rejectWithValue }
  ) => {
    // 2.1 rejeita a task via API
    await dispatch(
      completeTask({ taskId: task.id, proofImage: null, userId })
    ).unwrap();

    // 2.2 notifica parceiro
    await dispatch(
      sendMessage({
        senderId: partnerId,
        receiverId: userId,
        text: `Tarefa <b>${task.title}</b> foi rejeitada.`,
      })
    ).unwrap();

    // 2.3 cria nova tarefa
    const newTask = await dispatch(
      getTasks(partnerId) // buscar lista atualizada
    ).unwrap();

    await dispatch(
      notifyTasks({
        userId: partnerId,
        message: `Nova tarefa: ${newTaskTitle}`,
      })
    );

    // podes devolver algo se quiseres
    return { partnerTasks: newTask };
  }
);

// 3) Tasks: procurar, completar, verificar, remover mensagem
// export const fetchTasks = createAsyncThunk(
//   "user/fetchTasks",
//    async (userId, { dispatch, rejectWithValue }) => {
//     try {
//       return await dispatch(getTasks(userId)).unwrap();
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

export const fetchPartnerUser = createAsyncThunk(
  "user/fetchPartnerUser",
  async (_, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }
      const res = await axios.get(`${API_URL}/users/partner`, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 5) Ligar parceiro
export const connectPartner = createAsyncThunk(
  "user/connectPartner",
  async ({ code }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }
      const res = await axios.put(
        `${API_URL}/users/connect-partner`,
        { code },
        config
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 6) Acessórios owned
export const fetchOwnedAccessories = createAsyncThunk(
  "user/fetchOwnedAccessories",
  async (_, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Usuário não autenticado (token em falta).");
      }
      const res = await axios.get(`${API_URL}/users/accessories`, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 7) Acessórios equipados
export const fetchEquippedAccessories = createAsyncThunk(
  "user/fetchEquippedAccessories",
  async (_, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Usuário não autenticado (token em falta).");
      }
      const res = await axios.get(
        `${API_URL}/users/accessories-equipped`,
        config
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
// 8) Atualizar utilizador
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Usuário não autenticado (token em falta).");
      }
      const res = await axios.put(
        `${API_URL}/users/${updatedUser._id}`,
        updatedUser,
        config
      );
      // Se a API devolve o user atualizado, podes regravar no localStorage:
      setAuthUser(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 9) Comprar acessório
export const buyAccessory = createAsyncThunk(
  "user/buyAccessory",
  async ({ accessoryId }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Usuário não autenticado (token em falta).");
      }
      const res = await axios.post(
        `${API_URL}/users/accessories`,
        { accessoryId },
        config
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 10) Equipar/desequipar acessório
export const equipAccessories = createAsyncThunk(
  "user/equipAccessories",
  async ({ accessoryId, type }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Usuário não autenticado (token em falta).");
      }
      const res = await axios.put(
        `${API_URL}/users/accessories/equip`,
        { accessoryId: accessoryId ?? null, type },
        config
      );
      return res.data.accessoriesEquipped;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// —————————————————————————————————————————————————————
// Slice & estado
// —————————————————————————————————————————————————————
const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: getStoredUser(),
    token: getAuthToken() || null,
    partnerUser: null,
    ownedAccessories: [],
    equippedAccessories: {
      background: null,
      shirt: null,
      color: null,
      bigode: null,
      cachecol: null,
      chapeu: null,
      ouvidos: null,
      oculos: null,
    },
    tasks: [],
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.authUser = null;
      clearAuthStorage();
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.authUser = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchAuthUser.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchAuthUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.authUser = a.payload;
      })
      .addCase(fetchAuthUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
      })

      .addCase(googleLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.authUser = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // tarefas
      .addCase(getTasks.fulfilled, (s, a) => {
        s.tasks = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        // Defensive: ensure tasks is an array *before* operations
        if (!Array.isArray(state.tasks)) {
          state.tasks = [];
        }

        const updatedTask = action.payload.task;
        if (!updatedTask) return;

        const idx = state.tasks.findIndex((t) => t._id === updatedTask._id);
        if (idx > -1) {
          state.tasks[idx] = updatedTask;
        } else {
          state.tasks.push(updatedTask);
        }
      })
      .addCase(verifyTask.fulfilled, (s, a) => {
        if (!Array.isArray(s.tasks)) {
          s.tasks = [];
          // If it wasn't an array, there's nothing to find or update, so we can return early
          return;
        }

        const idx = s.tasks.findIndex((t) => t.id === a.payload.id);
        if (idx > -1) s.tasks[idx] = a.payload;
      })
      .addCase(removeRejectMessage.fulfilled, (s, a) => {
        // --- IMPORTANT FIX HERE ---
        // Defensive: ensure s.tasks is an array before calling findIndex
        if (!Array.isArray(s.tasks)) {
          s.tasks = [];
          return;
        }

        const idx = s.tasks.findIndex((t) => t.id === a.payload.id);
        if (idx > -1) s.tasks[idx] = a.payload;
      })
      .addCase(notifyTasks.fulfilled, (s, a) => {
        // Garante que s.tasks é um array - You already had this, good!
        if (!Array.isArray(s.tasks)) s.tasks = [];

        // Usa _id para comparar, pois é o padrão do MongoDB
        const updatedTask = a.payload.task || a.payload; // depende do que retorna o backend
        const idToCompare = updatedTask._id || updatedTask.id;

        const idx = s.tasks.findIndex((t) => (t._id || t.id) === idToCompare);
        if (idx > -1) {
          s.tasks[idx] = updatedTask;
        } else {
          s.tasks.push(updatedTask);
        }
      })

      // partner
      .addCase(fetchPartnerUser.fulfilled, (s, a) => {
        s.partnerUser = a.payload;
      })
      .addCase(connectPartner.fulfilled, (s, a) => {
        s.authUser = a.payload;
      })

      // acessórios
      .addCase(fetchOwnedAccessories.fulfilled, (s, a) => {
        s.ownedAccessories = a.payload;
      })
      .addCase(fetchEquippedAccessories.fulfilled, (state, action) => {
        const equipObj = action.payload.accessoriesEquipped ?? action.payload;

        const {
          background,
          shirt,
          color,
          bigode,
          cachecol,
          chapeu,
          ouvidos,
          oculos,
        } = equipObj;

        state.equippedAccessories = {
          background: background?.id ?? background ?? null,
          shirt: shirt?.id ?? shirt ?? null,
          color: color ?? null,
          bigode: bigode?.id ?? bigode ?? null,
          cachecol: cachecol?.id ?? cachecol ?? null,
          chapeu: chapeu?.id ?? chapeu ?? null,
          ouvidos: ouvidos?.id ?? ouvidos ?? null,
          oculos: oculos?.id ?? oculos ?? null,
        };
      })

      .addCase(buyAccessory.fulfilled, (s, a) => {
        s.ownedAccessories = a.payload.owned;
        if (s.authUser) s.authUser.points = a.payload.points;
      })

      .addCase(equipAccessories.fulfilled, (state, action) => {
        const equipObj = action.payload;
        state.equippedAccessories = {
          background: equipObj.background ?? null,
          shirt: equipObj.shirt ?? null,
          color: equipObj.color ?? null,
          bigode: equipObj.bigode ?? null,
          cachecol: equipObj.cachecol ?? null,
          chapeu: equipObj.chapeu ?? null,
          ouvidos: equipObj.ouvidos ?? null,
          oculos: equipObj.oculos ?? null,
        };
      });
  },
});

export default userSlice.reducer;
