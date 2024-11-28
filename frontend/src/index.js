import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import resources from './locales/index.js';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import store from './store/index';

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
        <ToastContainer />
      </Provider>
    </ErrorBoundary>
  </RollbarProvider>,
  // </React.StrictMode>
);