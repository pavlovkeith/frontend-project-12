import { useSelector } from 'react-redux';
import { selectors as messagesSelectors } from '../store/slices/messagesSlice';

const Messages = () => {
  const { currentChannelId } = useSelector((state) => state.channels);
  // console.log('messages');

  const messages = useSelector(messagesSelectors.selectAll)
    .filter((message) => message.channelId === currentChannelId);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      {messages.map(({ id, username, body }) => (
        <div key={id} className="text-break mb-2">
          <b>{username}</b>
          {`: ${body}`}
        </div>
      ))}
    </div>
  );
};

export default Messages;