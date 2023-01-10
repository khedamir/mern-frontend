import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/auth";
import { commentsReducer } from "./slices/comments";
import { postsReducer } from "./slices/posts";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        comments: commentsReducer,
    }
});

export default store;