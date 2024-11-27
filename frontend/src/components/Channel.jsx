
import { useSelector, useDispatch } from 'react-redux';
import {
  // Container,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
// import { selectors } from '../store/slices/channelsSlice';
import { actions as channelsActions } from '../store/slices/channelsSlice';
import { actions as modalActions } from '../store/slices/modalSlice';

const Channel = ({ channel, showModal }) => {
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.channels);
  // console.log('channel');

  // const Handler = () => {
  //   console.log(currentChannelId);
  //   console.log('Нажато');
  // };

  const ButtonComponent = (
    <Button
      variant={currentChannelId === channel.id ? 'secondary' : null}
      className="w-100 rounded-0 text-start text-truncate shadow-none"
      onClick={() => dispatch(channelsActions.setCurrentChannelId(channel.id))}
    >
      <span className="me-1">#</span>
      {channel.name}
    </Button>
  );

  const renderChannelCopmonent = () => {
    if (!channel.removable) {
      return ButtonComponent;
    }

    return (
      <ButtonGroup as={Dropdown} className="d-flex">
        {ButtonComponent}
        <Dropdown.Toggle
          className="shadow-none"
          split
          variant={currentChannelId === channel.id ? 'secondary' : null}
          // id="dropdown-split-basic"
        >
          <span className="visually-hidden">Управление каналом</span>
        </Dropdown.Toggle>

        <Dropdown.Menu variant="secondary">
          <Dropdown.Item
            onClick={() => showModal('removing', true)}
            as="button"
          >
            Удалить
          </Dropdown.Item>
          <Dropdown.Item
            // onClick={() => showModal('renaming', true, channel.name)}
            onClick={() => dispatch(modalActions
              .showModal({ type: 'renaming', show: true, channel }))}
            as="button"
          >
            Переименовать
          </Dropdown.Item>
        </Dropdown.Menu>
      </ButtonGroup>
    );
  };

  return (
    <li className="nav-item w-100">
      {renderChannelCopmonent()}
    </li>
  );
};

export default Channel;