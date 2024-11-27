import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { renameChannel, selectors as channelsSelectors } from '../../store/slices/channelsSlice';
import { getChannelValidationShema } from '../../validation';

const Rename = ({ closeModal }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { authHeader } = useSelector((state) => state.auth);
  const { loadingStatus } = useSelector((state) => state.channels);
  const { show, channel } = useSelector((state) => state.modal);

  const channelNames = useSelector(channelsSelectors.selectAll).map((item) => item.name);
  const validationSchema = getChannelValidationShema(channelNames);

  useEffect(() => {
    if (show) {
      inputRef.current.select();
    }
  }, [show]);

  const formik = useFormik({
    initialValues: { name: channel.name },
    validationSchema,
    onSubmit: (value) => {
      const editedChannel = { name: value.name.trim() };
      dispatch(renameChannel({ editedChannel, id: channel.id, authHeader }))
        .then(() => closeModal());
    },
  });

  return (
    <Modal style={{ top: '20%' }} show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
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
            <Form.Label className="visually-hidden" htmlFor="name">Имя канала</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                disabled={loadingStatus === 'loading'}
                variant="secondary"
                onClick={closeModal}
                className="me-2"
              >
                Отменить
              </Button>
              <Button
                disabled={loadingStatus === 'loading'}
                variant="primary"
                type="submit"
              >
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;