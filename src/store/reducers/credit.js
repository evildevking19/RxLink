// types
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toastr from 'toastr';

// initial state
const initialState = {
  status: '',
  credit: 0,
  price: 0,
  currency: '',
  link: ''
};

// APIs
export const getCreditInformation = createAsyncThunk('@credit/getCreditInformation', async () => {
  const response = await axios.get('/api/credit/getCreditInformation');
  return response.data;
});
export const buyCredit = createAsyncThunk('@credit/buycredit', async (amount) => {
  const response = await axios.get(`/api/credit/buycredit/${amount}`);
  return response.data;
});

// ==============================|| SLICE - MENU ||============================== //

const credit = createSlice({
  name: 'credit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCreditInformation.pending, (state) => {
        state.status = 'pending-fetch';
      })
      .addCase(getCreditInformation.fulfilled, (state, action) => {
        state.credit = action.payload.credit;
        state.price = action.payload.price;
        state.currency = action.payload.currency;
        state.status = action.payload.status;
      })
      .addCase(getCreditInformation.rejected, (state) => {
        state.status = 'rejected-fetch';
      });

    builder
      .addCase(buyCredit.pending, (state) => {
        state.status = 'pending-buy';
      })
      .addCase(buyCredit.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          state.link = action.payload.link;
        } else {
          toastr.warning(action.payload.error);
        }
        state.status = action.payload.status;
      })
      .addCase(buyCredit.rejected, (state) => {
        state.status = 'reject-buy';
      });
  }
});
export default credit.reducer;
// export const { reset } = credit.actions;
