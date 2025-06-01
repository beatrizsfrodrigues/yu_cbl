import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthToken } from "../utils/storageUtils";

const API_URL = process.env.REACT_APP_API_URL;

function authorizedConfig() {
  const token = getAuthToken();
  if (!token) {
    return {};
  }
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
}

// ======================
// 1) GET para buscar as perguntas do formulário
// ======================
export const fetchFormAnswers = createAsyncThunk(
  "formAnswers/fetchFormAnswers",
  async (_, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();
      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token ausente).");
      }

      const response = await axios.get(`${API_URL}/form-answers`, config);

      console.log("Dados recebidos do /form-answers:", response.data);
      return response.data.questions;
    } catch (error) {
      const message =
        error.response?.data || error.message || "Erro ao obter formulário";
      return rejectWithValue(message);
    }
  }
);

// ======================
// 2) POST para enviar as respostas do formulário
// ======================
export const postFormAnswers = createAsyncThunk(
  "formAnswers/postFormAnswers",
  async ({ answers }, { rejectWithValue }) => {
    try {
      const config = authorizedConfig();

      if (!config.headers) {
        return rejectWithValue("Utilizador não autenticado (token ausente).");
      }

      const res = await axios.post(
        `${API_URL}/form-answers`,
        { answers },
        config
      );

      console.log("Resposta de POST /form-answers:", res.data);
      return res.data;
    } catch (error) {
      const message =
        error.response?.data || error.message || "Erro ao enviar respostas";
      return rejectWithValue(message);
    }
  }
);
const formAnswersSlice = createSlice({
  name: "formAnswers",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormAnswers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFormAnswers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFormAnswers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(postFormAnswers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(postFormAnswers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(postFormAnswers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default formAnswersSlice.reducer;
