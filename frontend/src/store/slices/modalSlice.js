/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: { type: null, show: false, channel: {} },
  reducers: {
    showModal(state, { payload: { type, show, channel } }) {
      state.type = type;
      state.show = show;
      state.channel = channel;
    },
    hideModal(state) {
      state.show = false;
    },
    resetModal(state) {
      state.type = null;
    },
  },
});

export const { actions } = modalSlice;
export default modalSlice.reducer;
