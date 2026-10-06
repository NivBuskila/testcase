const previewOrigin = process.env.BASE44_PUBLIC_HOST_SUFFIX ? `3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}` : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow the Base44 preview origin to load dev assets / HMR.
  allowedDevOrigins: previewOrigin ? [previewOrigin] : [],
  experimental: {
    serverActions: {
      // The preview is served through a reverse proxy, so the Origin header
      // the browser sends (the public preview host) differs from the Host
      // header the server receives (the rotating sandbox host) — allow it
      // to bypass the Server Actions CSRF check.
      allowedOrigins: previewOrigin ? [previewOrigin] : [],
    },
  },
};

export default nextConfig;
