// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: "/",
    src: "/dist"
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript"
  ],
  routes: [
    { match: "routes", "src": ".*", "dest": "/index.html" }
  ],
  packageOptions: {
  },
  devOptions: {
    open: "none"
  },
  buildOptions: {},
};
