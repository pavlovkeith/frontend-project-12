import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import { useTranslation } from 'react-i18next';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import MessageForm from '../components/MessageForm';
import Modal from '../components/modal/Modal';
import { logOut } from '../store/slices/authSlice';
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchMessages } from '../store/slices/messagesSlice';
import { actions as modalActions } from '../store/slices/modalSlice';
import addButtonImg from '../assets/images/addButton.svg';

const HomePage = () => {
  const rollbar = useRollbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authHeader, isConnected } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchChannels(authHeader)).then((data) => {
      if (data?.error && data?.payload === 401) {
        dispatch(logOut());
        rollbar.error(data.payload);
      } else if (data?.error) {
        toast.error(t('toasts.connectionError'));
        rollbar.error(data.payload);
      }
    });
    dispatch(fetchMessages(authHeader));
  }, [authHeader, dispatch, isConnected, navigate, rollbar, t]);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('headers.channels')}</b>

            <button
              onClick={() => dispatch(modalActions
                .showModal({ type: 'adding', show: true, channel: {} }))}
              type="button"
              className="p-0 text-primary btn btn-group-vertical shadow-none"
            >
              <img src={addButtonImg} alt={t('buttons.addChannel')} />
              <span className="visually-hidden">+</span>
            </button>

          </div>
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <Messages />
            <MessageForm />
            <Modal />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
