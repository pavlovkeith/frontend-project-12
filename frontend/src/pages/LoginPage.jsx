import { Button, Form, Card } from 'react-bootstrap';
import React, { useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/images/login.jpg';
import { logIn } from '../store/slices/authSlice';

const LoginPage = () => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { loadingStatus, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  console.log('login');

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values) => {
      dispatch(logIn(values)).then((data) => {
        if (!data.error) {
          navigate('/');
        } else {
          inputRef.current.select();
        }
      });
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 row">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <Card.Img
                  style={{ maxWidth: '200px' }}
                  src={loginImage}
                  className="rounded-circle"
                  alt="Войти"
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">Войти</h1>
                <Form.Floating className="mb-3">
                  <Form.Control
                    required
                    className="form-control"
                    autoComplete="username"
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Ваш ник"
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    isInvalid={error === 401}
                    // isInvalid={formik.touched.username && formik.errors.username}
                    value={formik.values.username}
                    ref={inputRef}
                  />
                  <Form.Label htmlFor="username">Ваш ник</Form.Label>
                </Form.Floating>
                <Form.Floating className="mb-4">
                  <Form.Control
                    required
                    className="form-control"
                    autoComplete="password"
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    // isInvalid={formik.touched.password && formik.errors.password}
                    // isInvalid={formik.touched.password}
                    value={formik.values.password}
                    placeholder="Пароль"
                    isInvalid={error === 401}
                  />
                  <Form.Label htmlFor="password">Пароль</Form.Label>
                  <Form.Control.Feedback
                    type="invalid"
                    tooltip
                  >
                    Неверные имя пользователя или пароль
                  </Form.Control.Feedback>
                </Form.Floating>
                <Button
                  disabled={loadingStatus === 'loading'}
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                >
                  Войти
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта? Регистрация</span>
              </div>
            </Card.Footer>
          </Card>
          {/* <ToastContainer /> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;