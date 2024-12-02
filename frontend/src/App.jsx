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
import { useTranslation } from 'react-i18next';
import { logOut } from './store/slices/authSlice';

import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import { ROUTES } from './routes';

const codeOfStarSymbol = 42;

const PrivateRoute = ({ children }) => {
  const { username } = useSelector((state) => state.auth);
  return (
    username ? children : <Navigate to={ROUTES.login} />
  );
};

const AuthButton = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { username } = useSelector((state) => state.auth);
  return (
    username ? <Button onClick={() => dispatch(logOut())}>{t('buttons.logout')}</Button> : null
  );
};

const App = () => {
  const { t } = useTranslation();
  return (
    <Router>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <div className="container">
          <Navbar.Brand as={Link} to={ROUTES.home}>{t('headers.chatName')}</Navbar.Brand>
          <AuthButton />
        </div>
      </Navbar>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.signup} element={<SignupPage />} />
        <Route path={String.fromCharCode(codeOfStarSymbol)} element={<NotFoundPage />} />
        <Route
          path={ROUTES.home}
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
