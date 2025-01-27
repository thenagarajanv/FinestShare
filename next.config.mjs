// // /** @type {import('next').NextConfig} */
// // const nextConfig = {};

// // export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 's3.amazonaws.com',
//         port: '',
//         search: '',
//       },
//     ],
//   },
//     reactStrictMode: true,
//   };
  
//   export default nextConfig;
  // next.config.js
export default {
  images: {
    domains: ['lh3.googleusercontent.com', 's3.amazonaws.com'],
  },
  reactStrictMode: true,
};
