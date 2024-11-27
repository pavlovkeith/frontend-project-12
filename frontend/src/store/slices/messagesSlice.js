import {
  createSlice, createEntityAdapter, createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import routes from '../../routes';

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
// const initialState = messagesAdapter.getInitialState();
// console.log(initialState);

const initialState = messagesAdapter.getInitialState({ loadingStatus: 'idle', error: null });
// }
// };

const messagesSlice = createSlice({
  name: 'messages',
  // initialState: messagesAdapter.getInitialState({ loadingStatus: 'idle', error: null }),
  initialState,
  reducers: {
    resetState: () => initialState,
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
        // console.log(state.entities);
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
        toast.error('Ошибка соединения');
      });
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;