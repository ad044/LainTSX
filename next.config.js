/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // Allow importing of shader files (e.g. `.glsl` -- filenames below)
    // @see: https://github.com/glslify/glslify-loader
    config.module.rules.push(
      {
        test: /\.(glsl|vs|fs|vert|frag|ps)$/,
        exclude: /node_modules/,
        use: ["raw-loader"],
      },
      {
        test: /\.(mp4|vtt)$/,
        use: "file-loader",
      }
    );

    return config;
  },

  reactStrictMode: true,
};

module.exports = nextConfig;
