import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectors as messagesSelectors } from '../store/slices/messagesSlice';

const Messages = () => {
  const messagesRef = useRef(null);
  const { t } = useTranslation();
  const { currentChannel } = useSelector((state) => state.channels);

  const messages = useSelector(messagesSelectors.selectAll)
    .filter((message) => message.channelId === currentChannel?.id);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
    }
  }, [messages]);

  const MessagesHead = (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>
          #&nbsp;
          {currentChannel?.name && currentChannel.name}
        </b>
      </p>
      <span className="text-muted">{t('messagesCount', { count: messages.length })}</span>
    </div>
  );

  const MessagesBody = (
    <div id="messages-box" ref={messagesRef} className="chat-messages overflow-auto px-5 ">
      {messages.map(({ id, username, body }) => (
        <div key={id} className="text-break mb-2">
          <b>{username}</b>
          {`: ${body}`}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {MessagesHead}
      {MessagesBody}
    </>
  );
};

export default Messages;
