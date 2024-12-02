import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import filter from 'leo-profanity';
import { Form, InputGroup } from 'react-bootstrap';
import sendButtonImg from '../assets/images/sendButton.svg';
import { addMessage } from '../store/slices/messagesSlice';

filter.add(filter.getDictionary('ru'));
const getFilteredMessage = (message) => filter.clean(message);

const MessageForm = () => {
  const rollbar = useRollbar();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { authHeader, username } = useSelector((state) => state.auth);
  const { currentChannel } = useSelector((state) => state.channels);
  const { loadingStatus } = useSelector((state) => state.messages);
  const { type } = useSelector((state) => state.modal);

  useEffect(() => {
    if (!type) {
      inputRef.current.focus();
    }
  }, [type, currentChannel]);

  const formik = useFormik({
    initialValues: { body: '' },
    onSubmit: (value, { resetForm }) => {
      const filtredMessage = getFilteredMessage(value.body.trim());
      const newMessage = {
        body: filtredMessage,
        channelId: currentChannel.id,
        username,
      };
      dispatch(addMessage({ newMessage, authHeader })).then((data) => {
        if (data.error) {
          inputRef.current.select();
          toast.error(t('toasts.connectionError'));
          rollbar.error(data.error);
        } else {
          resetForm();
          inputRef.current.focus();
        }
      });
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form onSubmit={formik.handleSubmit} noValidate className="py-1 border rounded-2">
        <InputGroup hasValidation>
          <Form.Control
            name="body"
            aria-label={t('placeholders.newMessage')}
            placeholder={t('placeholders.enterMessage')}
            className="border-0 p-0 ps-2"
            ref={inputRef}
            onChange={formik.handleChange}
            value={formik.values.body}
          />
          <button
            type="submit"
            className="btn btn-group-vertical"
            disabled={!formik.values.body || loadingStatus === 'loading'}
          >
            <img src={sendButtonImg} alt={t('buttons.send')} />
            <span className="visually-hidden">{t('buttons.send')}</span>
          </button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageForm;
