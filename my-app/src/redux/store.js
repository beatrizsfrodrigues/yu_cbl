import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice.js";
import messagesReducer from "./messagesSlice.js";
import presetMessagesReducer from "./presetMessagesSlice.js";
import formReducer from "./formSlice.js";
import closetReducer from "./closetSlice.js";
import mascotReducer from "./mascotSlice.js";
import tasksReducer from "./taskSlice.js";

const store = configureStore({
  reducer: {
    users: usersReducer,
    messages: messagesReducer,
    presetMessages: presetMessagesReducer,
    form: formReducer,
    closet: closetReducer,
    mascot: mascotReducer,
    tasks: tasksReducer,
  },
});

export default store;
