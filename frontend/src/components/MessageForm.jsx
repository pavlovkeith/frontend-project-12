import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import { Form, InputGroup } from 'react-bootstrap';
// import * as yup from 'yup';
// import {
//   addChannel,
//   selectors as channelsSelectors,
//   actions as channelsActions,
// } from '../../store/slices/channelsSlice';
import sendButtonImg from '../assets/images/sendButton.svg';
import { addMessage } from '../store/slices/messagesSlice';

const MessageForm = () => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { authHeader, username } = useSelector((state) => state.auth);
  const { currentChannelId } = useSelector((state) => state.channels);
  const { loadingStatus } = useSelector((state) => state.messages);
  const { type } = useSelector((state) => state.modal);

  useEffect(() => {
    if (!type) {
      inputRef.current.focus();
    }
  }, [type, currentChannelId]);

  const formik = useFormik({
    initialValues: { body: '' },
    onSubmit: (value, { resetForm }) => {
      // console.log(value);
      const newMessage = {
        body: value.body.trim(),
        channelId: currentChannelId,
        username,
      };
      dispatch(addMessage({ newMessage, authHeader }));
      // .then((data) => {
      // console.log(data);
      // if (!data.error) {
      resetForm();
      inputRef.current.focus();
      // }
      // });
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form onSubmit={formik.handleSubmit} noValidate className="py-1 border rounded-2">
        <InputGroup hasValidation>
          <Form.Control
            name="body"
            aria-label="Новое сообщение"
            placeholder="Введите сообщение..."
            className="border-0 p-0 ps-2"
            ref={inputRef}
            onChange={formik.handleChange}
            // onBlur={formik.handleBlur}
            value={formik.values.body}
          />
          <button
            type="submit"
            className="btn btn-group-vertical"
            disabled={!formik.values.body || loadingStatus === 'loading'}
          >
            <img src={sendButtonImg} alt="Отправить" />
            <span className="visually-hidden">Отправить</span>
          </button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;