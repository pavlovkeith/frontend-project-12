import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { renameChannel, selectors as channelsSelectors } from '../../store/slices/channelsSlice';
import { getFilteredMessage } from '../../store/slices/messagesSlice';
import { getChannelValidationShema } from '../../validation';

const Rename = ({ closeModal }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { authHeader } = useSelector((state) => state.auth);
  const { loadingStatus } = useSelector((state) => state.channels);
  const { show, channel } = useSelector((state) => state.modal);
  const channelsNames = useSelector(channelsSelectors.selectAll).map((item) => item.name);

  useEffect(() => {
    if (show) {
      inputRef.current.select();
    }
  }, [show]);

  const formik = useFormik({
    initialValues: { name: channel.name },
    validationSchema: getChannelValidationShema(channelsNames),
    onSubmit: (value) => {
      const editedChannel = { name: getFilteredMessage(value.name.trim()) };
      dispatch(renameChannel({ editedChannel, id: channel.id, authHeader }))
        .then(() => closeModal());
    },
  });

  return (
    <Modal style={{ top: '20%' }} show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('headers.renameChannel')}</Modal.Title>
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

export default Rename;