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
// 1) Obter mensagens de um utilizador
// ======================
export const getMessages = createAsyncThunk(
  "messages/getMessages",
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
        `${API_URL}/messages/user/${userId}?page=${page}&limit=${limit}`,
        config
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ======================
// 2) Enviar mensagem para um utilizador
// ======================
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ message, id }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token em falta).");
      }

      const res = await axios.post(
        `${API_URL}/messages/${id}`,
        { message },
        config
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    data: {},
    fetchStatus: "idle",
    hasUnreadMessages: false,
    sendStatus: "idle",
    fetchError: null,
    sendError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET: getMessages
      .addCase(getMessages.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.data = action.payload;
        state.hasUnreadMessages = Array.isArray(action.payload)
          ? action.payload.some((msg) => msg.seen === false)
          : false;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload || action.error.message;
      })

      // POST: sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.sendStatus = "loading";
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";
        state.data = action.payload.conversation;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.sendError = action.payload || action.error.message;
      });
  },
});

export default messagesSlice.reducer;
