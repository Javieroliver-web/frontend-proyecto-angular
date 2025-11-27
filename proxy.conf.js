const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
];

export default PROXY_CONFIG;