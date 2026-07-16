// eventSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


   const API = "https://z80x8c7mx3.execute-api.ap-south-1.amazonaws.com/api/v1";

export const addEvent = createAsyncThunk(
  "event/addEvent",
  async (formData, thunkAPI) => {
    try {
      const AccessToken = localStorage.getItem("AccessToken");

      const res = await axios.post(`${API}/event/create`, formData, {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const createAdvertisementSession = createAsyncThunk(
  "payment/session",
  async (formData, thunkAPI) => {
    try {
      const AccessToken = localStorage.getItem("AccessToken");

      const res = await axios.post(
        `${API}/payment/advertisement-session`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${AccessToken}`, 
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

// GET SINGLE EVENT

export const getSingleEvent = createAsyncThunk(
  "event/getSingleEvent",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/event/single/${id}`);
      return res.data.event;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);
// 🔥 GET ALL EVENTS
export const getAllEvents = createAsyncThunk(
  "event/getAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/event/all`);

      return res.data.events;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const deleteEvent = createAsyncThunk(
  "event/deleteEvent",
  async (id, { rejectWithValue }) => {
          const AccessToken = localStorage.getItem("AccessToken");
    try {
      await axios.delete(`${API}/event/delete/${id}`, {
         
          headers: {
            Authorization: `Bearer ${AccessToken}`, 
            "Content-Type": "multipart/form-data",
          },
        
      });
      return id;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  },
);

const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    loading: false,
    error: null,
    event: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // 🔥 ADD EVENT
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   GET SINGLE EVENT

      .addCase(getSingleEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload; // 👈 store single event here
      })
      .addCase(getSingleEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔥 GET EVENTS
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        console.log("API RESPONSE:", action.payload); // 👈 add this
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔥 DELETE EVENT
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(
          (event) => event._id !== action.payload,
        );
      });
  },
});

export default eventSlice.reducer;
