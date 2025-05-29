import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { getAuthToken } from "../utils/cookieUtils";

const API_URL = process.env.REACT_APP_API_URL;

export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (userId, { rejectWithValue }) => {
    try {
      // const token = getAuthToken();

      const res = await axios.get(`${API_URL}/messages/user/${userId}`, {
        withCredentials: true, // <-- important!
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
      // const token = getAuthToken();
      const res = await axios.post(
        `${API_URL}/messages/${id}`,
        { message },
        {
          withCredentials: true, // <-- important!
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// const setLoading = (state) => {
//   state.status = "loading";
//   state.error = null;
// };

// const setError = (state, action) => {
//   state.status = "failed";
//   state.error = action.error.message;
// };

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    data: {},
    fetchStatus: "idle",
    sendStatus: "idle",
    fetchError: null,
    sendError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getMessages.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.data = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.error.message;
      })

      // POST
      .addCase(sendMessage.pending, (state) => {
        state.sendStatus = "loading";
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";
        state.data = action.payload.conversation;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.sendError = action.error.message;
      });
  },
});

// export const {} = messagesSlice.actions;
export default messagesSlice.reducer;
