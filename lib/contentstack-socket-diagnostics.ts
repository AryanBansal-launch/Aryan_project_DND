/**
 * Socket connection diagnostics for Contentstack SDK (Axios/http/https).
 * Logs IPv4 vs IPv6 when connections are established - similar to undici socket diagnostics.
 * Contentstack uses Axios which uses Node's http/https, not undici.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("http");
const https = require("https");
const tls = require("tls");
const net = require("net");
/* eslint-enable @typescript-eslint/no-require-imports */

function logConnection(source: string, socket: any) {
  console.log(
    JSON.stringify({
      event: "connection_created",
      source,
      remoteAddress: socket.remoteAddress,
      remotePort: socket.remotePort,
      ipFamily: socket.remoteFamily, // 'IPv4' or 'IPv6'
      localAddress: socket.localAddress,
    })
  );
}

/**
 * Creates http and https agents that log socket connection details (including IPv4/IPv6).
 */
export function createLoggingAgents(): { httpAgent: any; httpsAgent: any } {
  const httpsAgent = new https.Agent({
    createConnection: (options: any, callback: any) => {
      const socket = tls.connect(options, () => {
        logConnection("contentstack_https", socket);
        if (callback) callback();
      });
      return socket;
    },
  });

  const httpAgent = new http.Agent({
    createConnection: (options: any, callback: any) => {
      const socket = net.connect(options, () => {
        logConnection("contentstack_http", socket);
        if (callback) callback();
      });
      return socket;
    },
  });

  return { httpAgent, httpsAgent };
}
