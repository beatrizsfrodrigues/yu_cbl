import { configureStore } from "@reduxjs/toolkit";


import userReducer from "./usersSlice.js";            
import accessoriesReducer from "./accessoriesSlice.js";


import tasksReducer from "./taskSlice.js";
import messagesReducer from "./messagesSlice.js";
import presetMessagesReducer from "./presetMessagesSlice.js";
import formReducer from "./formSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,                  
    accessories: accessoriesReducer,     
    tasks: tasksReducer,
    messages: messagesReducer,
    presetMessages: presetMessagesReducer,
    form: formReducer,
  },
});

export default store;
