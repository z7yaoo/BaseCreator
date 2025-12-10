/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    turbopack: {}, // Add empty turbopack config to acknowledge we're using turbopack
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals.push('pino-pretty', 'encoding');
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'generativelanguage.googleapis.com',
            },
        ],
    },
}

module.exports = nextConfig
