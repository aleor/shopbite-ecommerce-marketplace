module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },

  images: {
    domains: ['storage.googleapis.com', 'firebasestorage.googleapis.com'],
  },
};
