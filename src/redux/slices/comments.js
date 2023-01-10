import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios"

export const fetchComments = createAsyncThunk('posts/fetchComments', async () => {
    const {data} = await axios.get('/comments');
    return data;
});

export const fetchPostComments = createAsyncThunk('comments/fetchComments', async (id) => {
    const {data} = await axios.get(`/comments/${id}`);
    return data;
});


const initialState = {
    comments: {
        items: [],
        status: 'loading',
    },
    activePostComments: {
        items: [],
        status: 'loading',
    }
}

const commentsSlice = createSlice({
    name: 'comments',
    initialState,

    reducers: {
        addComment (state, action) {
            state.activePostComments.items.push(action.payload);
        }
    },
    extraReducers: {
        [fetchComments.pending]: (state, action) => {
            state.comments.items = [];
            state.comments.status = 'loading'
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.comments.items = action.payload;
            state.comments.status = 'loaded'
        },
        [fetchComments.rejected]: (state, action) => {
            state.comments.items = [];
            state.comments.status = 'error'
        },
        [fetchPostComments.pending]: (state, action) => {
            state.activePostComments.items = [];
            state.activePostComments.status = 'loading'
        },
        [fetchPostComments.fulfilled]: (state, action) => {
            state.activePostComments.items = action.payload;
            state.activePostComments.status = 'loaded'
        },
        [fetchPostComments.rejected]: (state, action) => {
            state.activePostComments.items = [];
            state.activePostComments.status = 'error'
        },
    },
})

export const {addComment} = commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;