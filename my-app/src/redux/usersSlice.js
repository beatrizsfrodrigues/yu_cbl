import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//* Fetch users from local storage or JSON
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
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
      const { title, description, partnerId } = action.payload;

      const user = state.data.find((u) => u.id === partnerId);

      const newTask = {
        id: state.data.length + 1,
        title: title,
        description: description,
        picture: "",
        completed: false,
        verified: false,
        completedDate: 0,
        rejectMessage: "",
      };

      if (user) {
        user.tasks.push(newTask);
      } else {
        state.data.push(newTask);
      }

      localStorage.setItem("users", JSON.stringify(state.data));
    },
    validateTask: (state, action) => {
      const { userId, task } = action.payload;
      const user = state.data.find((u) => u.id === userId);
      if (user) {
        const taskValidate = user.tasks.find((t) => t.id === task.id);
        if (taskValidate) {
          taskValidate.verified = true;
          user.points += 10;
        }
      }

      localStorage.setItem("users", JSON.stringify(state.data));
    },
    completeTask: (state, action) => {
      const { taskId, proofImage, userId } = action.payload;

      const user = state.data.find((u) => u.id === userId);

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

      if (user) {
        const task = user.tasks.find((t) => t.id === taskId);
        if (task) {
          task.picture = proofImage;
          task.completedDate = getFormattedDate();
          task.completed = true;
        }
      }

      localStorage.setItem("users", JSON.stringify(state.data));
    },
    rejectTask: (state, action) => {
      const { userId, task, message } = action.payload;
      const user = state.data.find((u) => u.id === userId);
      if (user) {
        const taskReject = user.tasks.find((t) => t.id === task.id);
        if (taskReject) {
          taskReject.verified = false;
          taskReject.completed = false;
          taskReject.completedDate = 0;
          taskReject.rejectMessage = message;
        }
      }

      localStorage.setItem("users", JSON.stringify(state.data));
    },
    clearRejectMessage: (state, action) => {
      const { userId, taskId } = action.payload;
      const user = state.data.find((u) => u.id === userId);
      if (user) {
        const taskReject = user.tasks.find((t) => t.id === taskId);
        if (taskReject) {
          taskReject.rejectMessage = "";
        }
      }

      localStorage.setItem("users", JSON.stringify(state.data));
    },
    buyAcc: (state, action) => {
      const { price, userId } = action.payload;
      const user = state.data.find((u) => u.id === userId);
      console.log("User points before:", user.points);
      console.log("Price:", price, "Converted to number:", Number(price));
      if (user) {
        user.points = (user.points || 0) - Number(price);
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

export const {
  addTask,
  updateUser,
  completeTask,
  validateTask,
  rejectTask,
  clearRejectMessage,
  buyAcc,
} = usersSlice.actions;
export default usersSlice.reducer;
