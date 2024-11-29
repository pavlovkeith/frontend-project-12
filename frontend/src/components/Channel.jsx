import { useSelector, useDispatch } from 'react-redux';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../store/slices/channelsSlice';
import { actions as modalActions } from '../store/slices/modalSlice';

const Channel = ({ channel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentChannel } = useSelector((state) => state.channels);

  const ButtonComponent = (
    <Button
      variant={currentChannel.id === channel.id ? 'secondary' : null}
      className="w-100 rounded-0 text-start text-truncate"
      onClick={() => dispatch(channelsActions.setCurrentChannel(channel))}
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
          variant={currentChannel.id === channel.id ? 'secondary' : null}
        >
          <span className="visually-hidden">{t('buttons.channelControl')}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu variant="secondary">
          <Dropdown.Item
            onClick={() => dispatch(modalActions
              .showModal({ type: 'removing', show: true, channel }))}
            as="button"
          >
            {t('buttons.delete')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => dispatch(modalActions
              .showModal({ type: 'renaming', show: true, channel }))}
            as="button"
          >
            {t('buttons.rename')}
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
