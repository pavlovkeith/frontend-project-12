import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import axios from 'axios';

import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
// import Add from './components/modal/Add';

import { logOut } from './store/slices/authSlice';

// import { actions } from './store/slices/channelsSlice';

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useSelector((state) => state.auth);
  return (
    loggedIn ? children : <Navigate to="/login" />
  );
};

const AuthButton = () => {
  const dispatch = useDispatch();
  const { loggedIn } = useSelector((state) => state.auth);
  return (
    loggedIn ? <Button onClick={() => dispatch(logOut())}>Выйти</Button> : null
  );
};

// const getSuccessToast = (toastMessage = null) => {
//   if (toastMessage) {
//     toast.success(toastMessage);
//   }
// };

const App = () => {
  // const getSuccessToast = (toastMessage = null) => {
  //   // console.log('fff');
  //   // console.log(toastMessage);
  //   if (toastMessage) {
  //     console.log(toastMessage);
  //     toast.success(toastMessage);
  //   }
  // };

  console.log('App');

  return (
    <Router>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <div className="container">
          <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
          <AuthButton />
        </div>
      </Navbar>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/"
          element={(
            <PrivateRoute>
              <HomePage />
              {/* <ToastContainer /> */}
            </PrivateRoute>
          )}
        />
      </Routes>
    </Router>
  );
};

export default App;