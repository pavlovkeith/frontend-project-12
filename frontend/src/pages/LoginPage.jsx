import { Button, Form, Card } from 'react-bootstrap';
import React, { useEffect, useRef } from 'react';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import loginImage from '../assets/images/login.jpg';
import { logIn } from '../store/slices/authSlice';
import { ROUTES } from '../routes';

const LoginPage = () => {
  const rollbar = useRollbar();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { loadingStatus, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          navigate(ROUTES.home);
        } else {
          inputRef.current.select();
          if (data.payload !== 401) {
            toast.error(t('toasts.connectionError'));
          }
          rollbar.error(data.payload);
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
                  alt={t('headers.login')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('headers.login')}</h1>
                <Form.Floating className="mb-3">
                  <Form.Control
                    required
                    className="form-control"
                    autoComplete="username"
                    type="text"
                    id="username"
                    name="username"
                    placeholder={t('placeholders.nickname')}
                    onChange={formik.handleChange}
                    isInvalid={error === 401}
                    value={formik.values.username}
                    ref={inputRef}
                  />
                  <Form.Label htmlFor="username">{t('placeholders.nickname')}</Form.Label>
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
                    value={formik.values.password}
                    placeholder={t('placeholders.password')}
                    isInvalid={error === 401}
                  />
                  <Form.Label htmlFor="password">{t('placeholders.password')}</Form.Label>
                  <Form.Control.Feedback
                    type="invalid"
                    tooltip
                  >
                    {t('errors.loginError')}
                  </Form.Control.Feedback>
                </Form.Floating>
                <Button
                  disabled={loadingStatus === 'loading'}
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                >
                  {t('buttons.login')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('questions.noAccount')}</span>
                <span> </span>
                <a href={ROUTES.signup}>{t('links.registration')}</a>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
