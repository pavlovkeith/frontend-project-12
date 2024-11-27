const apiPath = '/api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  channelPath: (id) => [apiPath, 'channels', id].join('/'),
};