import {
  createSlice,
} from '@reduxjs/toolkit';

// const initialState = { type: null, show: false, channel: {} };

const modalSlice = createSlice({
  name: 'modal',
  initialState: { type: null, show: false, channel: {} },
  reducers: {
    showModal(state, { payload }) {
      state.type = payload.type;
      state.show = payload.show;
      state.channel = payload.channel;
      // console.log(state.type);
    },
    hideModal(state) {
    // dispatch(channelsActions.resetChannelError());
      state.show = false;
    },
    resetModal(state) {
      state.type = null;
    },
  },
});

export const { actions } = modalSlice;
// export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default modalSlice.reducer;