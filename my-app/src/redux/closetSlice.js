import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//* adiciona e vai buscar ao localstorage o array de objetos
export const fetchCloset = createAsyncThunk("closet/fetchCloset", async () => {
  const localData = localStorage.getItem("closet");
  if (localData) {
    return JSON.parse(localData);
  }

  const response = await fetch("/closet.json");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  try {
    const data = await response.json();
    localStorage.setItem("closet", JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error("Failed to parse JSON");
  }
});

const closetSlice = createSlice({
  name: "closet",
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
      .addCase(fetchCloset.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCloset.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCloset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default closetSlice.reducer;
