import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPresetMessages = createAsyncThunk(
  "messages/fetchPresetMessages",
  async () => {
    const response = await fetch("/presetMessages.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to parse JSON");
    }
  }
);

const presetMessagesSlice = createSlice({
  name: "presetMessages",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresetMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPresetMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchPresetMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default presetMessagesSlice.reducer;
