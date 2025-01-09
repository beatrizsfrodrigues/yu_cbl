import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//* fetch users from local storage
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
    //* adds a new task to partner user
    addTask: (state, action) => {
      const { title, description, partnerId } = action.payload;

      //* finds the partner
      const user = state.data.find((u) => u.id === partnerId);

      const newTask = {
        id: state.data.length + 1,
        title: title,
        description: description,
        picture: "",
        completed: false,
        verified: false,
        completedDate: 0,
      };

      //* if it find the partner, it adds a new task
      if (user) {
        user.tasks.push(newTask);
      }
      //* this is to update the state
      else {
        state.data.push(newTask);
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
          console.log("ok");
          task.picture = proofImage;
          task.completedDate = getFormattedDate();
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
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addTask, completeTask } = usersSlice.actions;
export default usersSlice.reducer;
