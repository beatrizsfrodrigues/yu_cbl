import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//* Busca acessórios da API por categoria
export const fetchCloset = createAsyncThunk(
  "closet/fetchCloset",
  async (category = null) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/accessories`,
        {
          params: category ? { type: category } : {},
        }
      );
      return response.data.accessories;
    } catch (error) {
      throw new Error(
        error.response?.data?.msg || "Erro ao buscar acessórios da API"
      );
    }
  }
);

const closetSlice = createSlice({
  name: "closet",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
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
