import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import MessageForm from '../components/MessageForm';
import Modal from '../components/modal/Modal';
import { fetchChannels, actions as channelsActions } from '../store/slices/channelsSlice';
import { fetchMessages, actions as messagesActions } from '../store/slices/messagesSlice';
import { actions as modalActions } from '../store/slices/modalSlice';
import addButtonImg from '../assets/images/addButton.svg';

const HomePage = () => {
  // console.log('Home');
  const dispatch = useDispatch();
  const { authHeader } = useSelector((state) => state.auth);


  useEffect(() => {
    const socket = io();
    socket.on('newChannel', (payload) => {
      dispatch(channelsActions.addChannel(payload));
      // console.log('soc new');
      // dispatch(channelsActions.setCurrentChannelId('1'));
    });
    socket.on('newMessage', (payload) => {
      dispatch(messagesActions.addMessage(payload));
      // console.log(socket);
    });
    socket.on('renameChannel', (payload) => {
      dispatch(channelsActions.updateChannel({ id: payload.id, changes: payload }));
    });
    socket.on('connect', () => {
      dispatch(fetchChannels(authHeader));
      dispatch(fetchMessages(authHeader));
    });
  }, [authHeader, dispatch]);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>

            <button
              onClick={() => dispatch(modalActions
                .showModal({ type: 'adding', show: true, channel: {} }))}
              type="button"
              className="p-0 text-primary btn btn-group-vertical shadow-none"
            >
              <img src={addButtonImg} alt="Добавить канал" />
              <span className="visually-hidden">+</span>
            </button>

          </div>
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0"><b># general</b></p>
              <span className="text-muted">1 сообщение</span>
            </div>
            <Modal />
            <Messages />
            <MessageForm />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;