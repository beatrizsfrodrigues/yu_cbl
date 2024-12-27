import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice.js";
import messagesReducer from "./messagesSlice.js";

const store = configureStore({
  reducer: {
    users: usersReducer,
    messages: messagesReducer,
  },
});

export default store;
