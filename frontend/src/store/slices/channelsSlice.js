import {
  createSlice, createEntityAdapter, createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import routes from '../../routes';

// import defaultChannelId from '../../constants/constants.js';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (authHeader) => {
    const response = await axios.get(routes.channelsPath(), { headers: authHeader });
    return response.data;
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

const channelsAdapter = createEntityAdapter();
// const initialState = channelsAdapter.getInitialState();
// console.log(initialState);

const initialState = channelsAdapter
  .getInitialState({ loadingStatus: 'idle', error: null, currentChannelId: null });

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    // resetChannelError(state) {
    //   state.error = null;
    // },
    setCurrentChannelId(state, { payload }) { // ////////////
      state.currentChannelId = payload;
    },
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, (state, { payload }) => {
        channelsAdapter.setAll(state, payload);
        if (!state.ids.includes(state.currentChannelId)) {
          const [firstChannelId] = state.ids;
          state.currentChannelId = firstChannelId;
        }
      })
    // .addCase(sendTask.fulfilled, tasksAdapter.addOne)
    // .addCase(removeTask.fulfilled, tasksAdapter.removeOne);
      .addCase(addChannel.pending, (state) => {
        // console.log('pen');
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(addChannel.fulfilled, (state, { payload }) => {
        state.loadingStatus = 'idle';
        state.error = null;
        // console.log(payload);
        state.currentChannelId = payload.id;
        toast.success('Канал создан');
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
        toast.error('Ошибка соединения');
      })
      .addCase(renameChannel.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, (state) => {
        state.loadingStatus = 'idle';
        state.error = null;
        // state.currentChannelId = payload.id;
        toast.success('Канал переименован');
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
        toast.error('Ошибка соединения');
      });
  },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;