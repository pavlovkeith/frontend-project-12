import { useSelector } from 'react-redux';
import { selectors as channelsSelectors } from '../store/slices/channelsSlice';
import Channel from './Channel';

const Channels = ({ showModal }) => {
  const channels = useSelector(channelsSelectors.selectAll);
  console.log('channels');

  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels.map((channel) => (
        <Channel key={channel.id} channel={channel} showModal={showModal} />
      ))}
    </ul>
  );
};

export default Channels;