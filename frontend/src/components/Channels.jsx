import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectors as channelsSelectors } from '../store/slices/channelsSlice';
import Channel from './Channel';

const Channels = () => {
  const channelsRef = useRef(null);
  const channels = useSelector(channelsSelectors.selectAll);

  useEffect(() => {
    if (channelsRef.current) {
      channelsRef.current.scrollTo(0, channelsRef.current.scrollHeight);
    }
  }, [channels]);

  return (
    <ul
      id="channels-box"
      className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      ref={channelsRef}
    >
      {channels.map((channel) => (
        <Channel key={channel.id} channel={channel} />
      ))}
    </ul>
  );
};

export default Channels;
