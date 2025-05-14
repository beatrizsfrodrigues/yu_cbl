// src/redux/accessoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthToken } from "../utils/cookieUtils";

export const fetchAccessories = createAsyncThunk(
  "accessories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:3000/accessories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Falha a buscar acessórios");
      const { accessories } = await res.json();
      return accessories;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const accessoriesSlice = createSlice({
  name: "accessories",
  initialState: { data: [], status: "idle", error: null },
  extraReducers: builder => {
    builder
      .addCase(fetchAccessories.pending, state => { state.status = "loading"; })
      .addCase(fetchAccessories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAccessories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export default accessoriesSlice.reducer;
