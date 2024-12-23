import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("users/fetchUser", async () => {
  const response = await fetch("/users.json");
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

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
