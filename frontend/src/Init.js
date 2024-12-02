import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import resources from './locales/index.js';
import { actions as channelsActions } from './store/slices/channelsSlice';
import { actions as messagesActions } from './store/slices/messagesSlice';
import { setConnectionStatus } from './store/slices/authSlice';

const Init = ({ children }) => {
  const dispatch = useDispatch();

  const i18n = i18next.createInstance();

  const options = {
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  };

  i18n
    .use(initReactI18next)
    .init(options);

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_TOKEN,
    environment: 'production',
  };

  const socket = io();
  socket.on('newChannel', (payload) => {
    dispatch(channelsActions.addChannel(payload));
  });
  socket.on('newMessage', (payload) => {
    dispatch(messagesActions.addMessage(payload));
  });
  socket.on('renameChannel', (payload) => {
    dispatch(channelsActions.updateChannel({ id: payload.id, changes: payload }));
  });
  socket.on('removeChannel', (payload) => {
    dispatch(channelsActions.removeChannel(payload.id));
  });
  socket.on('connect', () => {
    dispatch(setConnectionStatus(true));
  });
  socket.on('disconnect', () => {
    dispatch(setConnectionStatus(false));
  });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <ToastContainer />
        {children}
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default Init;
