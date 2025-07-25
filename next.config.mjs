/** @type {import('next').NextConfig} */

const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:"res.cloudinary.com"
            }
        ]
    },
    experimental: {
        serverActions: {
          allowedOrigins: ['http://localhost:8080'],
        },
      },
   
};

export default nextConfig;
