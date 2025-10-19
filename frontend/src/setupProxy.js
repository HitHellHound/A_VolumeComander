const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (commanderApp) {
    commanderApp.use(
        '/commander',
        createProxyMiddleware({
            target: 'http://localhost:8080/commander',
            changeOrigin: true
        })
    );
};
