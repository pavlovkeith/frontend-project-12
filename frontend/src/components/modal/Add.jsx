import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { addChannel, selectors as channelsSelectors } from '../../store/slices/channelsSlice';
import { getChannelValidationShema } from '../../validation';

filter.add(filter.getDictionary('ru'));
export const getFilteredChanneName = (channelName) => filter.clean(channelName);

const Add = ({ closeModal }) => {
  const rollbar = useRollbar();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { authHeader } = useSelector((state) => state.auth);
  const { loadingStatus } = useSelector((state) => state.channels);
  const { show } = useSelector((state) => state.modal);
  const channelsNames = useSelector(channelsSelectors.selectAll).map((channel) => channel.name);
  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      inputRef.current.focus();
    }
  }, [show]);

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: getChannelValidationShema(t, channelsNames),
    onSubmit: (value) => {
      const newChannel = { name: getFilteredChanneName(value.name.trim()) };
      dispatch(addChannel({ newChannel, authHeader })).then((data) => {
        closeModal();
        if (!data.error) {
          toast.success(t('toasts.channelCreated'));
        } else {
          toast.error(t('toasts.connectionError'));
          rollbar.error(data.error);
        }
      });
    },
  });

  return (
    <Modal style={{ top: '20%' }} show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('headers.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              ref={inputRef}
              onChange={formik.handleChange}
              isInvalid={formik.touched.name && formik.errors.name}
              value={formik.values.name}
              name="name"
              id="name"
            />
            <Form.Label
              className="visually-hidden"
              htmlFor="name"
            >
              {t('placeholders.channelName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                disabled={loadingStatus === 'loading'}
                variant="secondary"
                onClick={closeModal}
                className="me-2"
              >
                {t('buttons.cancel')}
              </Button>
              <Button
                disabled={loadingStatus === 'loading'}
                variant="primary"
                type="submit"
              >
                {t('buttons.send')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
