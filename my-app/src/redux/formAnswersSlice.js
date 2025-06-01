import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchFormAnswers = createAsyncThunk(
  "formAnswers/fetchFormAnswers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/form-answers`, {
        withCredentials: true,
      });

      console.log("Dados recebidos do /form-answers:", response.data);
      return response.data.questions;
    } catch (error) {
      const message =
        error.response?.data || error.message || "Erro ao obter formulário";
      return rejectWithValue(message);
    }
  }
);

export const postFormAnswers = createAsyncThunk(
  "formAnswers/postFormAnswers",
  async ({ answers }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/form-answers`,
        { answers },
        {
          withCredentials: true,
        }
      );

      console.log("elo");

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
