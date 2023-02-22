/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: false,
  env: {
    ALCHEMY_MUMBAI_API_KEY_URL: process.env.ALCHEMY_MUMBAI_API_KEY_URL,
    ALCHEMY_MUMBAI_API_KEY_WSS: process.env.ALCHEMY_MUMBAI_API_KEY_WSS,
    ALCHEMY_POLYGON_API_KEY_WSS: process.env.ALCHEMY_POLYGON_API_KEY_WSS,
  },
}

module.exports = nextConfig
