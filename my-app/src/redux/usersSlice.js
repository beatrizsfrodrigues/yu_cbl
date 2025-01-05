import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("users/fetchUser", async () => {
  const localData = localStorage.getItem("users");
  if (localData) {
    return JSON.parse(localData);
  }

  const response = await fetch("/users.json");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  try {
    const data = await response.json();
    localStorage.setItem("users", JSON.stringify(data));
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
  reducers: {
    addTask: (state, action) => {
      const { task } = action.payload;
      const conversation = state.data.find(
        (conv) =>
          JSON.stringify(conv.usersId) ===
          JSON.stringify([task.senderId, task.receiverId])
      );

      if (conversation) {
        conversation.messages.push(task);
      } else {
        state.data.push({
          id: state.data.length + 1,
          title: task.title,
          description: task.description,
          completed: false,
        });
      }

      localStorage.setItem("users", JSON.stringify(state.data));
    },
  },
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
