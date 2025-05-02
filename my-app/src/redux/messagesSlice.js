import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthToken } from "../utils/cookieUtils";

const API_URL = process.env.REACT_APP_API_URL;

export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();

      const res = await axios.get(`${API_URL}/messages/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.chat;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ message, id }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const res = await axios.post(
        `${API_URL}/messages/${id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const setLoading = (state) => {
  state.status = "loading";
  state.error = null;
};

const setError = (state, action) => {
  state.status = "failed";
  state.error = action.error.message;
};

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // getMessages
      .addCase(getMessages.pending, setLoading)
      .addCase(getMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getMessages.rejected, setError)

      // sendMessage
      .addCase(sendMessage.pending, setLoading)
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.conversation;
      })
      .addCase(sendMessage.rejected, setError);
  },
});

export const {} = messagesSlice.actions;
export default messagesSlice.reducer;
