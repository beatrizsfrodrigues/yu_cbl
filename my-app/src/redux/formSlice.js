import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//* adiciona e vai buscar ao localstorage o array de objetos
export const fetchForm = createAsyncThunk("form/fetchForm", async () => {
  const response = await fetch("/initialForm.json");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to parse JSON");
  }
});

const formSlice = createSlice({
  name: "form",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    //* este espaço é para adicionar as funções
    //* se criarem as funções dps têm de as exportar no fim. vejam como tenho nos outros ficheiros
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default formSlice.reducer;
