/** @type {import('next').NextConfig} */
import { API_CONFIG } from './src/utils/apiConstants';

const nextConfig = {
  images: {
    domains: [`${API_CONFIG.SUBDOMAIN}.${API_CONFIG.DOMAIN}`],
  },
}

export default nextConfig 