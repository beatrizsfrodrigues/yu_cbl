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
      const { senderId, receiverId, message } = action.payload;
      const conversation = state.data.find(
        (conv) =>
          JSON.stringify(conv.usersId) ===
            JSON.stringify([senderId, receiverId]) ||
          JSON.stringify(conv.usersId) ===
            JSON.stringify([receiverId, senderId])
      );

      function getFormattedDate() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
      }

      const newMessage = {
        id: state.data.length + 1,
        senderId: senderId,
        receiverId: receiverId,
        messages: message,
        date: getFormattedDate(),
      };

      if (conversation) {
        conversation.messages.push(newMessage);
      } else {
        state.data.push(newMessage);
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
