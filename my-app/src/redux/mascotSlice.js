import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//* adiciona e vai buscar ao localstorage o array de objetos
export const fetchMascot = createAsyncThunk("mascot/fetchMascot", async () => {
  const localData = localStorage.getItem("mascot");
  if (localData) {
    return JSON.parse(localData);
  }

  const response = await fetch("/mascot.json");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  try {
    const data = await response.json();
    localStorage.setItem("mascot", JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error("Failed to parse JSON");
  }
});

const mascotSlice = createSlice({
  name: "mascot",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    buyItem: (state, action) => {
      const { itemId, userId } = action.payload;
      const mascot = state.data.find((m) => m.userId === userId);
      if (mascot) {
        if (!mascot.accessoriesOwned.includes(itemId)) {
          mascot.accessoriesOwned.push(itemId);
        }
      }
      localStorage.setItem("mascot", JSON.stringify(state.data));
    },
    saveFit: (state, action) => {
      const { hat, shirt, color, background, id } = action.payload;
      const mascot = state.data.find((m) => m.id === id);
      if (mascot) {
        mascot.accessoriesEquipped.hat = hat;
        mascot.accessoriesEquipped.shirt = shirt;
        mascot.accessoriesEquipped.color = color;
        mascot.accessoriesEquipped.background = background;
      }
      localStorage.setItem("mascot", JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMascot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMascot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMascot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { buyItem, saveFit } = mascotSlice.actions;
export default mascotSlice.reducer;
