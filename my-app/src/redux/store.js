import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice.js";
import messagesReducer from "./messagesSlice.js";
import presetMessagesReducer from "./presetMessagesSlice.js";

const store = configureStore({
  reducer: {
    users: usersReducer,
    messages: messagesReducer,
    presetMessages: presetMessagesReducer,
  },
});

export default store;
