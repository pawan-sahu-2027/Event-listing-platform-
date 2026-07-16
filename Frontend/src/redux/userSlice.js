import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 API
const API = "https://z80x8c7mx3.execute-api.ap-south-1.amazonaws.com/api/v1/user/"; 

// ✅ GET USER
export const getUser = createAsyncThunk("user/getUser", async () => {
  const res = await axios.get(`${API}getUser`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
    },
  });
  console.log(`user: ${res}`)
  return res.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    // ✅ manually save user (after login/signup)
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // ✅ logout
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("AccessToken");
        localStorage.clear(); // TEMP DEBUG (remove later if needed)
    },
  },
  
  

  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload.user; // adjust based on API
    });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;