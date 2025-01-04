import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async () => {
    const localData = localStorage.getItem("messages");
    if (localData) {
      return JSON.parse(localData);
    }

    const response = await fetch("/messages.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    try {
      const data = await response.json();
      localStorage.setItem("messages", JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error("Failed to parse JSON");
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const { message } = action.payload;
      const conversation = state.data.find(
        (conv) =>
          JSON.stringify(conv.usersId) ===
          JSON.stringify([message.senderId, message.receiverId])
      );

      if (conversation) {
        conversation.messages.push(message);
      } else {
        state.data.push({
          id: state.data.length + 1,
          senderId: message.senderId,
          receiverId: message.receiverId,
          messages: message,
          date: new Date().toLocaleString(),
        });
      }

      localStorage.setItem("messages", JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
