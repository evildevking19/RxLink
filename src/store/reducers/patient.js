// types
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toastr from 'toastr';

// initial state
const initialState = {
  editMode: false,
  editData: {},
  loading: false,
  saveStatus: '',
  deleteStatus: '',
  list: [],
  total: 0
};

// APIs
export const getList = createAsyncThunk('@patient/list', async (data) => {
  const response = await axios.get('/api/patient/list', { params: data });
  return response.data;
});
export const getDetail = createAsyncThunk('@patient/detail', async (id) => {
  const response = await axios.get('/api/patient/detail?id=' + id);
  return response.data;
});
export const savePatient = createAsyncThunk('@patient/save', async (data) => {
  const response = await axios.post('/api/patient/save', data);
  return response.data;
});
export const deletePatient = createAsyncThunk('@patient/delete', async (id) => {
  const response = await axios.post('/api/patient/delete', { id });
  return response.data;
});

// ==============================|| SLICE - PATIENT ||============================== //

const patient = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setEditMode(state, action) {
      state.editMode = action.payload;
    },
    editPatient(state, action) {
      state.saveStatus = 'pending';
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
      .addCase(savePatient.pending, (state) => {
        state.saveStatus = 'pending';
      })
      .addCase(savePatient.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          toastr.success('Patient information has been saved successfully!');
        } else {
          toastr.warning(action.payload.error);
        }
        state.saveStatus = action.payload.status;
      })
      .addCase(savePatient.rejected, (state) => {
        state.saveStatus = 'reject';
      });
    builder
      .addCase(deletePatient.pending, (state) => {
        state.deleteStatus = 'pending';
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          toastr.success('Patient data has been delete successfully!');
        } else {
          toastr.warning(action.payload.error);
        }
        state.deleteStatus = action.payload.status;
      })
      .addCase(deletePatient.rejected, (state) => {
        state.deleteStatus = 'reject';
      });

    builder.addCase(getDetail.fulfilled, (state, action) => {
      if (action.payload.status === 'success') {
        state.editData = action.payload.detail;
      } else {
        toastr.warning(action.payload.error);
      }
    });
  }
});
export default patient.reducer;
export const { editPatient, setEditMode } = patient.actions;
