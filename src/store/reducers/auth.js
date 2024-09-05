// types
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';
import toastr from 'toastr';

// initial state
const initialState = {
  updateStatus: '',
  changePasswordStatus: '',
  signinStatus: '',
  verify: false,
  logined: false,
  user: null,
  verifyCode: ''
};

// APIs
export const register = createAsyncThunk('@auth/register', async (data) => {
  const response = await axios.post('/api/auth/register', data);
  return response.data;
});
export const signin = createAsyncThunk('@auth/signin', async (data) => {
  const response = await axios.post('/api/auth/signin', data);
  return response.data;
});
export const forgotPassword = createAsyncThunk('@auth/forgotpassword', async (data) => {
  const response = await axios.post('/api/auth/forgotPassword', data);
  return response.data;
});
export const signinByToken = createAsyncThunk('@auth/signinbytoken', async (token) => {
  const response = await axios.get(`/api/auth/signinbytoken?token=${token}`);
  return response.data;
});
export const verifyAccount = createAsyncThunk('@auth/verifyAccount', async (token) => {
  const response = await axios.get(`/api/auth/verifyAccount?token=${token}`);
  return response.data;
});
export const changeProfile = createAsyncThunk('@auth/changeProfile', async (data) => {
  const response = await axios.post('/api/auth/changeProfile', data);
  return response.data;
});
export const resetPassword = createAsyncThunk('@auth/resetPassword', async (data) => {
  const response = await axios.post('/api/auth/resetPassword', data);
  return response.data;
});
export const savePassword = createAsyncThunk('@auth/changePassword', async (data) => {
  const response = await axios.post('/api/auth/changePassword', data);
  return response.data;
});
export const codeVerify = createAsyncThunk('@auth/codeVerify', async (data) => {
  const response = await axios.post('/api/auth/codeVerify', data);
  return response.data;
});
export const codeVerifyToForgot = createAsyncThunk('@auth/codeVerifyToForgot', async (data) => {
  const response = await axios.post('/api/auth/codeVerifyToForgot', data);
  return response.data;
});
export const setUserGroup = createAsyncThunk('@auth/getPracticeList', async () => {
  const response = await axios.get('/api/auth/getPracticeList');
  return response.data;
});
// ==============================|| SLICE - MENU ||============================== //

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { user, token } = action.payload;
      state.logined = true;
      state.user = user;
      if (Cookies.get('required-cookies')) {
        Cookies.set('rxlink-token', token);
      }
      axios.defaults.headers.common = {
        Authorization: `Bearer ${token}`
      };
    },
    logout(state) {
      state.signinStatus = '';
      state.logined = false;
      state.user = null;
      Cookies.remove('rxlink-token');
    },
    backToSignin(state) {
      state.signinStatus = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(verifyAccount.fulfilled, (state, action) => {
      if (action.payload.status === 'success') {
        auth.caseReducers.login(state, action);
        state.verify = true;
      }
    });
    builder
      .addCase(signinByToken.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          auth.caseReducers.login(state, action);
          state.verify = true;
        } else {
          state.signinStatus = 'invalid-token';
          state.logined = false;
          state.user = null;
          Cookies.remove('rxlink-token');
        }
      })
      .addCase(signinByToken.rejected, (state) => {
        state.signinStatus = 'invalid-token';
        state.logined = false;
        state.user = null;
        Cookies.remove('rxlink-token');
      });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      if (action.payload.status === 'success') {
        state.signinStatus = 'codeverify';
        state.verifyCode = action.payload.verifyCode;
        state.user = action.payload.user;
      } else {
        toastr.warning(action.payload.error);
      }
    });
    builder.addCase(signin.fulfilled, (state, action) => {
      if (action.payload.status === 'success') {
        state.signinStatus = 'codeverify';
        state.verifyCode = action.payload.verifyCode;
        state.user = action.payload.user;
      } else {
        toastr.warning(action.payload.error);
      }
    });
    builder.addCase(codeVerifyToForgot.fulfilled, (state, action) => {
      if (action.payload.status === 'success') {
        state.signinStatus = 'savenewpassword';
        state.user = action.payload.user;
        auth.caseReducers.login(state, action);
      } else {
        toastr.warning(action.payload.error);
      }
    });
    builder.addCase(codeVerify.fulfilled, (state, action) => {
      if (action.payload.status === 'success') {
        state.signinStatus = 'success';
        auth.caseReducers.login(state, action);
      } else {
        toastr.warning(action.payload.error);
      }
    });
    builder
      .addCase(changeProfile.pending, (state) => {
        state.updateStatus = 'pending';
      })
      .addCase(changeProfile.fulfilled, (state) => {
        toastr.success('Profile is changed successfully');
        state.updateStatus = 'success';
      })
      .addCase(changeProfile.rejected, (state) => {
        state.updateStatus = 'rejected';
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.changePasswordStatus = 'pending';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          toastr.success('Password is changed successfully');
          state.resetPasswordStatus = 'success';
        } else {
          toastr.warning(action.payload.error);
        }
      })
      .addCase(resetPassword.rejected, (state) => {
        state.changePasswordStatus = 'rejected';
      });
    builder
      .addCase(savePassword.pending, (state) => {
        state.changePasswordStatus = 'pending';
      })
      .addCase(savePassword.fulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          toastr.success('Password is changed successfully');
          state.changePasswordStatus = 'success';
        } else {
          toastr.warning(action.payload.error);
        }
      })
      .addCase(savePassword.rejected, (state) => {
        state.changePasswordStatus = 'rejected';
      });
    builder.addCase(setUserGroup.fulfilled, (state, action) => {
      if (action.payload.status === 'success') {
        state.userGroup = action.payload.list;
      } else {
        toastr.warning(action.payload.error);
      }
    });
  }
});
export const { logout, backToSignin } = auth.actions;
export default auth.reducer;
