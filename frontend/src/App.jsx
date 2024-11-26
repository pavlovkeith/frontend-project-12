import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import NotFoundPage from './components/NotFoundPage';

const App = () => (
  <Routes>
    <Route path='/' element={<div>Главная страница</div>} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);

export default App;
