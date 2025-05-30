// src/redux/accessoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getAuthToken } from "../utils/cookieUtils";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchAccessories = createAsyncThunk(
  "accessories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // const token = getAuthToken();
      const res = await fetch(`${API_URL}/accessories`, {
        withCredentials: true, // <-- important!
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAccessories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAccessories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default accessoriesSlice.reducer;
