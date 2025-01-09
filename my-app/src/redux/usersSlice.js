import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//* Fetch users from local storage or JSON
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const localData = localStorage.getItem("users");

  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (error) {
      console.error("Failed to parse localStorage data:", error);
    }
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
      const { title, description, partnerId } = action.payload;

      //* finds the partner
      const user = state.data.find((u) => u.id === partnerId);

      const newTask = {
        id: user?.tasks.length + 1 || 1,
        title,
        description,
        completed: false,
        completedDate: null,
      };

      if (user) {
        user.tasks.push(newTask);
      }
      localStorage.setItem("users", JSON.stringify(state.data));
    },

    updateUser: (state, action) => {
      const updatedUser = action.payload;
      const index = state.data.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...updatedUser,
        };
        localStorage.setItem("users", JSON.stringify(state.data));
      }
    },

    completeTask: (state, action) => {
      const { taskId, proofImage, userId } = action.payload;

      const user = state.data.find((u) => u.id === userId);

      if (user) {
        const task = user.tasks.find((t) => t.id === taskId);
        if (task) {
          console.log("ok");
          task.picture = proofImage;
          task.completedDate = new Date().toISOString();
          task.completed = true;
   
          
        }
      }

      localStorage.setItem("users", JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        localStorage.setItem("users", JSON.stringify(action.payload));
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addTask, updateUser, completeTask } = usersSlice.actions;
export default usersSlice.reducer;
