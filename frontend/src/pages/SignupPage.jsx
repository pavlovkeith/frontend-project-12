import { Button, Form, Card } from 'react-bootstrap';
import { useEffect, useRef } from 'react';
import { useRollbar } from '@rollbar/react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import signupImage from '../assets/images/signup.jpg';
import { signUp } from '../store/slices/authSlice';
import { getSignupValidationShema } from '../validation';
import signupFields from '../fields';
import { ROUTES } from '../routes';

const SignupPage = () => {
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
      confirmPassword: '',
    },
    validationSchema: getSignupValidationShema(t),
    onSubmit: ({ username, password }) => {
      dispatch(signUp({ username: username.trim(), password })).then((data) => {
        if (!data.error) {
          navigate(ROUTES.home);
        } else {
          if (data.payload !== 409) {
            toast.error(t('toasts.connectionError'));
          }
          rollbar.error(data.payload);
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
            <Card.Body
              className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5"
            >
              <div>
                <Card.Img
                  style={{ maxWidth: '200px' }}
                  src={signupImage}
                  className="rounded-circle"
                  alt={t('headers.registration')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('headers.registration')}</h1>

                {signupFields.map(({
                  id, type, description, autoComplete,
                }) => (
                  <Form.Floating key={id} className={id !== 'confirmPassword' ? 'mb-3' : 'mb-4'}>
                    <Form.Control
                      required
                      className="form-control"
                      autoComplete={autoComplete}
                      type={type}
                      id={id}
                      name={id}
                      placeholder={t(description)}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={error === 409
                        || (formik.touched[id] && formik.errors[id])}
                      value={formik.values[id]}
                      ref={id === 'username' ? inputRef : null}
                    />
                    <Form.Label htmlFor={id}>{t(description)}</Form.Label>
                    <Form.Control.Feedback tooltip type="invalid">
                      {error === 409 ? (id === 'username' && t('errors.registerError'))
                        : formik.errors[id]}
                    </Form.Control.Feedback>
                  </Form.Floating>
                ))}

                <Button
                  disabled={loadingStatus === 'loading'}
                  type="submit"
                  variant="outline-primary"
                  className="w-100"
                >
                  {t('buttons.register')}
                </Button>

              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
