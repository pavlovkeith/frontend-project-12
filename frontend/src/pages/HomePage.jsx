import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import MessageForm from '../components/MessageForm';
import Modal from '../components/modal/Modal';
import { fetchChannels, actions as channelsActions } from '../store/slices/channelsSlice';
import { fetchMessages, actions as messagesActions } from '../store/slices/messagesSlice';
import { actions as modalActions } from '../store/slices/modalSlice';
import addButtonImg from '../assets/images/addButton.svg';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authHeader } = useSelector((state) => state.auth);

  // const s = useSelector((state) => state.messages);
  // console.log(s.ids.length);

  // const x = useSelector((state) => state.channels);
  // console.log(x);

  useEffect(() => {
    const socket = io();
    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
    });
    socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
    });
    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.updateChannel({ id: payload.id, changes: payload }));
    });
    socket.on('removeChannel', (payload) => {
      dispatch(channelsActions.removeChannel(payload.id));
    });
    socket.on('connect', () => {
      dispatch(fetchChannels(authHeader)).then((data) => {
        if (data?.error && data?.payload === 401) {
          localStorage.removeItem('userToken');
          navigate('/login');
        }
      });
      dispatch(fetchMessages(authHeader));
    });
  }, [authHeader, dispatch, navigate]);

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