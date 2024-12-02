/* eslint-disable no-param-reassign */
import {
  createSlice, createEntityAdapter, createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes';
import { actions as channelsActions } from './channelsSlice';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (authHeader) => {
    const response = await axios.get(routes.messagesPath(), { headers: authHeader });
    return response.data;
  },
);

export const addMessage = createAsyncThunk(
  'messages/addMessage',
  async ({ newMessage, authHeader }) => {
    const response = await axios.post(routes.messagesPath(), newMessage, { headers: authHeader });
    return response.data; // => { id: '1', body: 'new message', channelId: '1', username: 'admin }
  },
);

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState({ loadingStatus: 'idle', error: null }),
  reducers: {
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, messagesAdapter.setAll)
      .addCase(addMessage.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state) => {
        state.loadingStatus = 'idle';
        state.error = null;
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      })
      .addCase(channelsActions.removeChannel, (state, { payload }) => {
        const allMessages = Object.values(state.entities);
        const currentChannelMessagesIds = allMessages
          .filter((message) => message.channelId === payload).map(({ id }) => id);
        messagesAdapter.removeMany(state, currentChannelMessagesIds);
      });
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
