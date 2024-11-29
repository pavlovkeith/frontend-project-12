import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import Init from './Init';
import store from './store/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Init>
      <App />
    </Init>
  </Provider>,
);
