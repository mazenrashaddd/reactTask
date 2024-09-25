import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(BASE_URL);
  console.log(response.data);
  return response.data;
});

export const addPost = createAsyncThunk("posts/addPost", async (post) => {
  const response = await axios.post(BASE_URL, post);
  return response.data;
});

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, updatedData }) => {
    const response = await axios.patch(`${BASE_URL}/${id}`, updatedData);
    return response.data;
  }
);
// deletePost API function
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id) => {
    
  console.log("In delete");
  console.log(id);
  
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return id;  // Returning the deleted post's ID to update the state
  }
);

// Function to fetch both post details and comments in parallel
export const fetchPostAndComments = createAsyncThunk(
  "posts/fetchPostAndComments",
  async (postId, thunkAPI) => {
    try {
      // Fetch post details and comments concurrently
      const [postResponse, commentsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/${postId}`),
        axios.get(`${BASE_URL}/${postId}/comments`),
      ]);
      // Return both the post and comments
      console.log(commentsResponse);
      
      return {
        post: postResponse.data,
        comments: commentsResponse.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching post or comments");
    }
  }
);