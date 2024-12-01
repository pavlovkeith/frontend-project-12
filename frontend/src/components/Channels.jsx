import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { selectors as channelsSelectors, actions as channelsActions } from '../store/slices/channelsSlice';
import { actions as modalActions } from '../store/slices/modalSlice';

const Channels = () => {
  const channelsRef = useRef(null);
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannel = useSelector((state) => state.channels.currentChannel);

  useEffect(() => {
    if (channelsRef.current) {
      channelsRef.current.scrollTo(0, channelsRef.current.scrollHeight);
    }
  }, [channels]);

  const handleSelectChannel = (id) => {
    dispatch(channelsActions.setCurrentChannel(id));
  };

  return (
    <ul
      id="channels-box"
      className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      ref={channelsRef}
    >
      {channels.map((channel) => (
        <li key={channel.id} className="nav-item w-100">
          <Dropdown as={ButtonGroup} className="d-flex">
            <button
              type="button"
              className={`btn flex-grow-1 text-start ${channel.id === currentChannel.id ? 'btn-secondary' : 'btn-light'}`}
              onClick={() => handleSelectChannel(channel.id)}
            >
              {`# ${channel.name}`}
            </button>
            {channel.removable && (
              <Dropdown.Toggle split variant="light" id={`dropdown-${channel.id}`} />
            )}
            {channel.removable && (
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => dispatch(modalActions.showModal({ type: 'removing', channel }))}>
                  Удалить
                </Dropdown.Item>
                <Dropdown.Item onClick={() => dispatch(modalActions.showModal({ type: 'renaming', channel }))}>
                  Переименовать
                </Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Dropdown>
        </li>
      ))}
    </ul>
  );
};

export default Channels;
