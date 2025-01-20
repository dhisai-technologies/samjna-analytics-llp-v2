const apps = [
  {
    path: "/core-service",
    port: 5001,
  },
  {
    path: "/analytics-service",
    port: 5002,
  },
];

const config = {
  PROXY_PORT: 80,
};

module.exports = {
  apps,
  config,
};
