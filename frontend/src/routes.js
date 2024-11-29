const apiPath = '/api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  channelPath: (id) => [apiPath, 'channels', id].join('/'),
};

export const ROUTES = {
  login: '/login',
  signup: '/signup',
  home: '/',
};
