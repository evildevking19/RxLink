// types
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// initial state
const initialState = {
  status: '',
  patients: 0,
  prescriptions: 0,
  verifys: 0,
  credits: 0,
  chart: {}
};

// APIs
export const getStatistic = createAsyncThunk('@dashboard/getStatistic', async () => {
  const response = await axios.get('/api/dashboard/getStatistic');
  return response.data;
});

// ==============================|| SLICE - MENU ||============================== //

const dashboard = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatistic.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getStatistic.fulfilled, (state, action) => {
        state.patients = action.payload.patients;
        state.prescriptions = action.payload.prescriptions;
        state.verifys = action.payload.verifys;
        state.credits = action.payload.credits;
        state.chart = action.payload.chart;
        state.status = 'success';
      })
      .addCase(getStatistic.rejected, (state) => {
        state.status = 'rejected';
      });
  }
});
export default dashboard.reducer;
