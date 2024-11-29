/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes';

export const logIn = createAsyncThunk(
  'auth/logIn',
  async (authData, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.loginPath(), authData);
      return response.data;
    } catch (error) {
      if (error.response?.status) {
        return rejectWithValue(error.response.status);
      }
      return rejectWithValue(520); // unknown error
    }
  },
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (authData, { rejectWithValue }) => {
    try {
      const response = await axios.post(routes.signupPath(), authData);
      return response.data;
    } catch (error) {
      if (error.response?.status) {
        return rejectWithValue(error.response.status);
      }
      return rejectWithValue(520);
    }
  },
);

const getInitialState = () => {
  const userToken = JSON.parse(localStorage.getItem('userToken'));
  if (userToken && userToken.token && userToken.username) {
    return {
      username: userToken.username,
      authHeader: { Authorization: `Bearer ${userToken.token}` },
      error: null,
    };
  }
  return {
    username: null,
    authHeader: {},
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logOut(state) {
      state.username = null;
      state.loadingStatus = 'idle';
      state.error = null;
      localStorage.removeItem('userToken');
    },
    setConnectionStatus(state, { payload }) {
      state.isConnected = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, { payload: { token, username } }) => {
        state.loadingStatus = 'idle';
        localStorage.setItem('userToken', JSON.stringify({ token, username }));
        state.error = null;
        state.username = username;
        state.authHeader = { Authorization: `Bearer ${token}` };
      })
      .addCase(logIn.rejected, (state, { payload }) => {
        state.loadingStatus = 'failed';
        state.error = payload;
        state.username = null;
        state.authHeader = {};
        localStorage.removeItem('userToken');
      })
      .addCase(signUp.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, { payload: { token, username } }) => {
        state.loadingStatus = 'idle';
        localStorage.setItem('userToken', JSON.stringify({ token, username }));
        state.error = null;
        state.username = username;
        state.authHeader = { Authorization: `Bearer ${token}` };
      })
      .addCase(signUp.rejected, (state, { payload }) => {
        state.loadingStatus = 'failed';
        state.error = payload;
        state.username = null;
        state.authHeader = {};
        localStorage.removeItem('userToken');
      });
  },
});

export const { logOut, setConnectionStatus } = authSlice.actions;
export default authSlice.reducer;
