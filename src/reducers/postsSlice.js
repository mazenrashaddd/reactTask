import { createSlice } from "@reduxjs/toolkit";
import { fetchPosts, addPost, updatePost, deletePost, fetchPostAndComments } from "../APIs/postsApis";

export const postsSlice = createSlice({
  name: "postsData",

  initialState: {
    posts: [],
    post: null, // To store the current post details
    comments: [], // To store the comments of the current post
    setLoading: false,
    setError: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    // Fetch all posts
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });

    // Add a new post
    builder.addCase(addPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });

    // Update a post
    builder.addCase(updatePost.fulfilled, (state, action) => {
      const postIndex = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    });

    // Delete a post
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    });

    // Fetch post details and comments
    builder.addCase(fetchPostAndComments.pending, (state) => {
      state.setLoading = true;  // Set loading when fetching starts
      state.setError = false;   // Reset any previous errors
    });

    builder.addCase(fetchPostAndComments.fulfilled, (state, action) => {
      state.post = action.payload.post;      // Store the post details
      state.comments = action.payload.comments; // Store the post's comments
      state.setLoading = false; // Set loading to false when fetching completes
    });

    builder.addCase(fetchPostAndComments.rejected, (state) => {
      state.setLoading = false;  // Set loading to false when fetching fails
      state.setError = true;     // Set error flag to true
    });
  },
});

export default postsSlice.reducer;
