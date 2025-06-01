import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { getAuthToken } from "../utils/storageUtils"; // podes remover se não usares auth

const API_URL = process.env.REACT_APP_API_URL;

//* Vai buscar os dados do formulário ao backend
export const fetchForm = createAsyncThunk(
  "form/fetchForm",
  async (_, { rejectWithValue }) => {
    try {
      // const token = getAuthToken(); // só se a vossa API usar autenticação

      const response = await axios.get(`${API_URL}/forms`, {
        withCredentials: true, // <-- important!
      });

      console.log("Dados recebidos do /forms:", response.data);
      return response.data.questions; // ajusta conforme a estrutura real da resposta da API
    } catch (error) {
      const message =
        error.response?.data || error.message || "Erro ao obter formulário";
      return rejectWithValue(message);
    }
  }
);

const formSlice = createSlice({
  name: "form",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    //* espaço para funções futuras (ex: editar formulário, apagar, etc.)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForm.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default formSlice.reducer;
