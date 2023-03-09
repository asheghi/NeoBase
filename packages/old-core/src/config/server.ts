export default {
  // log_access: true,
  // simulate_slow_network: false,
  /**
   * server is listening on all interfaces by default
   * you can change it to 127.0.0.1 to listen only to localhost and expose api via a reverse proxy
   */
  listen_host: "0.0.0.0",
  listen_port: 8080,
  trust_proxy: false,
  // domain:'',
  ssl: false,
};
