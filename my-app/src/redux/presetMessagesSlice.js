 

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; //função que o redux tem para criar tarefas
const API_URL = process.env.REACT_APP_API_URL;

//createSlice é uma forma simplificada de criar um slice de estado no Redux
// 1) Chama o endpoint real
export const fetchPresetMessages = createAsyncThunk(
  "presetMessages/fetchPresetMessages", //identificador (string) para o Redux.
  async () => {
    const response = await fetch(`${API_URL}/preset-messages`); //Pede ao navegador que vá procurar o recurso neste endereço.
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // 2) Verifica se o API considera o call um sucesso
    if (!data.success) {
      throw new Error("API reported failure");
    }
    // 3) Só devolve o array de messages
    return data.messages;
  }
);

const presetMessagesSlice = createSlice({
  name: "presetMessages",
  initialState: {
    data: [], // melhor iniciar como array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresetMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPresetMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // action.payload já é o array
      })
      .addCase(fetchPresetMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default presetMessagesSlice.reducer;
