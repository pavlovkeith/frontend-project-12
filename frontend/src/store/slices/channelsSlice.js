/* eslint-disable no-param-reassign */
import {
  createSlice, createEntityAdapter, createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (authHeader, { rejectWithValue }) => {
    try {
      const response = await axios.get(routes.channelsPath(), { headers: authHeader });
      return response.data;
    } catch (error) {
      if (error.response?.status) {
        return rejectWithValue(error.response.status);
      }
      return rejectWithValue(520); // unknown error
    }
  },
);

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async ({ newChannel, authHeader }) => {
    const response = await axios.post(routes.channelsPath(), newChannel, { headers: authHeader });
    return response.data; // => { id: '3', name: 'new channel', removable: true }
  },
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ editedChannel, id, authHeader }) => { // { name: 'new name channel' };
    const response = await axios
      .patch(routes.channelPath(id), editedChannel, { headers: authHeader });
    return response.data; // => { id: '3', name: 'new channel name', removable: true }
  },
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async ({ id, authHeader }) => {
    const response = await axios
      .delete(routes.channelPath(id), { headers: authHeader });
    return response.data; // => { id: '3' }
  },
);

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter
  .getInitialState({ loadingStatus: 'idle', error: null, currentChannel: null });

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel(state, { payload }) {
      state.currentChannel = payload;
    },
    addChannel: channelsAdapter.addOne,
    updateChannel: (state, { payload }) => {
      channelsAdapter.updateOne(state, payload);
      if (state.currentChannel.id === payload.id) {
        state.currentChannel = payload.changes;
      }
    },
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload);
      if (state.currentChannel.id === payload) {
        const [firstChannelId] = state.ids;
        state.currentChannel = state.entities[firstChannelId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, (state, { payload }) => {
        channelsAdapter.setAll(state, payload);
        if (!state.ids.includes(state.currentChannel?.id)) {
          const [firstChannelId] = state.ids;
          state.currentChannel = state.entities[firstChannelId];
        }
      })
      .addCase(addChannel.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(addChannel.fulfilled, (state, { payload }) => {
        state.loadingStatus = 'idle';
        state.error = null;
        state.currentChannel = payload;
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      })
      .addCase(renameChannel.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, (state) => {
        state.loadingStatus = 'idle';
        state.error = null;
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      })
      .addCase(removeChannel.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(removeChannel.fulfilled, (state) => {
        state.loadingStatus = 'idle';
        state.error = null;
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      });
  },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
