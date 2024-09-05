// types
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toastr from 'toastr';

// initial state
const initialState = {
  status: '',
  rxid: '',
  prescription: '',
  dispensing: false
};

// APIs
export const getDetail = createAsyncThunk('@home/detail', async ({ id, dob }) => {
  const response = await axios.get('/api/home/detail', { params: { id, dob } });
  return response.data;
});
export const dispense = createAsyncThunk('@home/dispense', async ({ id, dob }) => {
  const response = await axios.get('/api/home/dispense', { params: { id, dob } });
  return response.data;
});

// ==============================|| SLICE - MENU ||============================== //

const home = createSlice({
  name: 'home',
  initialState,
  reducers: {
    reset(state) {
      state.rxid = '';
      state.prescription = '';
      state.status = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDetail.pending, (state) => {
        state.rxid = '';
        state.prescription = '';
        state.status = 'pending';
      })
      .addCase(getDetail.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          state.prescription = action.payload.detail;
        } else {
          toastr.warning(action.payload.error);
        }
        state.status = 'success';
      })
      .addCase(getDetail.rejected, (state) => {
        state.status = 'rejected';
      });

    builder
      .addCase(dispense.pending, (state) => {
        state.dispensing = true;
      })
      .addCase(dispense.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          state.prescription.dispense = true;
          toastr.success('Dispense success. This prescription cannot be dispensed again.');
        } else {
          toastr.warning(action.payload.error);
        }
        state.status = 'success';
        state.dispensing = false;
      })
      .addCase(dispense.rejected, (state) => {
        state.dispensing = false;
        toastr.error('Failed to dispense. Please try again.');
      });
  }
});
export default home.reducer;
export const { reset } = home.actions;
