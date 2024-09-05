// types
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toastr from 'toastr';

// initial state
const initialState = {
  loading: false,
  editMode: false,
  editData: {},
  autoPatients: [],
  autoPharmacys: [],
  saveStatus: '',
  deleteStatus: '',
  list: [],
  total: 0
};

// APIs
export const getList = createAsyncThunk('@prescription/list', async (data) => {
  const response = await axios.get('/api/prescription/list', { params: data });
  return response.data;
});
export const savePrescription = createAsyncThunk('@prescription/save', async (data) => {
  const response = await axios.post('/api/prescription/save', data);
  return response.data;
});
export const deletePrescription = createAsyncThunk('@prescription/delete', async (id) => {
  const response = await axios.post('/api/prescription/delete', { id });
  return response.data;
});
export const sendPrescription = createAsyncThunk('@prescription/send', async (id) => {
  const response = await axios.post('/api/prescription/send', { id });
  return response.data;
});
export const autoPatientComplete = createAsyncThunk('@prescription/autopatient', async (search) => {
  const response = await axios.get('/api/prescription/autopatient?search=' + search);
  return response.data;
});
export const autoPharmacyComplete = createAsyncThunk('@prescription/autopharmacy', async (search) => {
  const response = await axios.get('/api/prescription/autopharmacy?search=' + search);
  return response.data;
});

// ==============================|| SLICE - MENU ||============================== //

const prescription = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    setEditMode(state, action) {
      state.editMode = action.payload;
    },
    editPrescription(state, action) {
      state.editData = action.payload ?? {};
      state.editMode = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getList.fulfilled, (state, action) => {
        state.list = action.payload.list;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(getList.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(savePrescription.pending, (state) => {
        state.loading = true;
        state.saveStatus = 'pending';
      })
      .addCase(savePrescription.fulfilled, (state) => {
        state.saveStatus = 'success';
        toastr.success('Prescription is saved successfully');
        state.loading = false;
      })
      .addCase(savePrescription.rejected, (state) => {
        state.saveStatus = 'rejected';
        state.loading = false;
      });

    builder
      .addCase(deletePrescription.pending, (state) => {
        state.deleteStatus = 'pending';
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          toastr.success('Prescription data has been deleted successfully!');
        } else {
          toastr.warning(action.payload.error);
        }
        state.deleteStatus = action.payload.status;
      })
      .addCase(deletePrescription.rejected, (state) => {
        state.deleteStatus = 'reject';
      });

    builder
      .addCase(sendPrescription.pending, (state, action) => {
        state.list = state.list.map((item) => (item._id === action.meta.arg ? { ...item, sending: true } : item));
        state.sendStatus = 'pending';
      })
      .addCase(sendPrescription.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          state.list = state.list.map((item) => (item._id === action.meta.arg ? { ...item, status: true, sending: false } : item));
          toastr.success('Prescription data has been sent successfully!');
        } else {
          toastr.warning(action.payload.error);
          state.sendStatus = 'failed';
          state.list = state.list.map((item) => (item._id === action.meta.arg ? { ...item, sending: false } : item));
        }
        state.sendStatus = action.payload.status;
      })
      .addCase(sendPrescription.rejected, (state, action) => {
        toastr.error('Prescription sending failed');
        state.list = state.list.map((item) => (item._id === action.meta.arg ? { ...item, sending: false } : item));
        state.sendStatus = 'reject';
      });
    builder.addCase(autoPatientComplete.fulfilled, (state, action) => {
      state.autoPatients = action.payload;
    });
    builder.addCase(autoPharmacyComplete.fulfilled, (state, action) => {
      state.autoPharmacys = action.payload;
    });
  }
});
export default prescription.reducer;
export const { editPrescription, setEditMode } = prescription.actions;
