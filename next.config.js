/**
 *  @type {import('next').NextConfig} 
 * */
const nextConfig = {
  output: 'standalone',
  env: {
    // SERVER_ENDPOINT: 'http://localhost:8000',
    SERVER_ENDPOINT: 'https://seeadback.onrender.com',
  },
};

module.exports = nextConfig