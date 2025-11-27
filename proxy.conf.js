const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
      // TRUCO: Sobrescribimos el origen para que el Backend crea que
      // la petición viene de un lugar permitido (ej: él mismo o el puerto 4000)
      proxyReq.setHeader('Origin', 'http://localhost:8080');
    }
  }
];

module.exports = PROXY_CONFIG;