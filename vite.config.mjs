export default {
  server: {
    proxy: {
      '/api/deezer': {
        target: 'https://api.deezer.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/deezer/, ''),
      },
    },
  },
};
