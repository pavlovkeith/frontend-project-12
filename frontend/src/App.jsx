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
import { logOut } from './store/slices/authSlice';

import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';

const PrivateRoute = ({ children }) => {
  const { username } = useSelector((state) => state.auth);
  // console.log(username);
  return (
    username ? children : <Navigate to="/login" />
  );
};

const AuthButton = () => {
  const dispatch = useDispatch();
  const { username } = useSelector((state) => state.auth);
  // console.log(username);
  return (
    username ? <Button onClick={() => dispatch(logOut())}>Выйти</Button> : null
  );
};

const App = () => {
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
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/"
          element={(
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          )}
        />
      </Routes>
    </Router>
  );
};

export default App;