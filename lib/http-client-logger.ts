/**
 * HTTP Client Logger for debugging failed requests
 *
 * Captures:
 * - When the request is initiated
 * - Where the timeout/failure occurs
 * - Whether the failure happens before a connection is fully established
 */

export interface HttpFailureLog {
  timestamp: string;
  requestInitiatedAt: string;
  failurePhase: "before_connection" | "during_transfer" | "after_response";
  protocol: string;
  errorCode: string;
  errorMessage: string;
  url: string;
  method: string;
  durationMs?: number;
  hasRequestObject: boolean;
  hasResponseObject: boolean;
  rawError?: string;
}

function formatTimestamp(date: Date) {
  return date.toISOString();
}

/**
 * Derives protocol (http/https) from Axios config.
 * Contentstack core sets baseURL as "https://host..." or "http://host..." (when insecure).
 */
function getProtocol(config: any): string {
  const base = config?.baseURL || config?.url || "";
  if (typeof base === "string") {
    if (base.startsWith("https://")) return "https";
    if (base.startsWith("http://")) return "http";
  }
  // Axios uses httpsAgent for HTTPS; if only httpAgent, it's HTTP
  if (config?.httpsAgent !== undefined && config?.httpsAgent !== false) return "https";
  if (config?.httpAgent && !config?.httpsAgent) return "http";
  return "https"; // Contentstack CDA defaults to HTTPS
}

/**
 * Determines the failure phase based on Axios error structure:
 * - before_connection: No request was sent (DNS failure, connection refused, etc.)
 * - during_transfer: Request sent but no response received (timeout, connection reset)
 * - after_response: Got HTTP response (4xx, 5xx)
 */
function getFailurePhase(error: any): HttpFailureLog["failurePhase"] {
  if (error.response) {
    return "after_response";
  }
  if (error.request) {
    return "during_transfer";
  }
  return "before_connection";
}

/**
 * Adds request/response interceptors to an Axios client for detailed failure logging.
 * Call this on the Contentstack stack client when debugging HTTP issues.
 */
export function addHttpClientLogging(client: any): void {
  if (typeof client?.interceptors?.request?.use !== "function") {
    return;
  }

  const requestTimestamps = new Map<string, number>();

  // Log when request is initiated
  client.interceptors.request.use(
    (config: any) => {
      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      config._httpLogRequestId = requestId;
      requestTimestamps.set(requestId, Date.now());

      const fullUrl = config.baseURL ? `${config.baseURL}${config.url || ""}` : config.url;
      const logEntry = {
        event: "request_initiated",
        timestamp: formatTimestamp(new Date()),
        requestId,
        protocol: getProtocol(config),
        url: config.url || config.baseURL,
        method: (config.method || "get").toUpperCase(),
        fullUrl,
      };

      console.log("[HTTP-CLIENT] Request initiated:", JSON.stringify(logEntry, null, 2));
      return config;
    },
    (error: any) => {
      console.error("[HTTP-CLIENT] Request interceptor error:", error?.message, error);
      return Promise.reject(error);
    }
  );

  // Log failures (timeouts, connection errors, etc.)
  client.interceptors.response.use(
    (response: any) => {
      const requestId = response?.config?._httpLogRequestId;
      if (requestId) {
        const startedAt = requestTimestamps.get(requestId);
        if (startedAt) {
          const durationMs = Date.now() - startedAt;
      const protocol = getProtocol(response?.config);
      const path = response?.config?.url || response?.config?.baseURL;
      console.log(
        `[HTTP-CLIENT] Request completed: [${protocol}] ${path} - ${response?.status} (${durationMs}ms)`
      );
        }
        requestTimestamps.delete(requestId);
      }
      return response;
    },
    (error: any) => {
      const config = error?.config;
      const requestId = config?._httpLogRequestId;
      const startedAt = requestId ? requestTimestamps.get(requestId) : undefined;
      if (requestId) requestTimestamps.delete(requestId);

      const failureLog: HttpFailureLog = {
        timestamp: formatTimestamp(new Date()),
        requestInitiatedAt: startedAt ? formatTimestamp(new Date(startedAt)) : "unknown",
        failurePhase: getFailurePhase(error),
        protocol: getProtocol(config),
        errorCode: error?.code || error?.cause?.code || "UNKNOWN",
        errorMessage: error?.message || String(error),
        url: config?.url || config?.baseURL || "unknown",
        method: (config?.method || "get").toUpperCase(),
        durationMs: startedAt ? Date.now() - startedAt : undefined,
        hasRequestObject: !!error?.request,
        hasResponseObject: !!error?.response,
        rawError: error?.cause ? String(error.cause) : undefined,
      };

      console.error(
        "[HTTP-CLIENT] Request FAILED:",
        JSON.stringify(failureLog, null, 2)
      );

      // Human-readable summary for quick scanning
      const phaseDesc =
        failureLog.failurePhase === "before_connection"
          ? "BEFORE connection established (DNS/connect refused/etc)"
          : failureLog.failurePhase === "during_transfer"
            ? "DURING transfer (timeout/connection reset - request was sent)"
            : "AFTER response received (HTTP error)";
      console.error(
        `[HTTP-CLIENT] Failure phase: ${phaseDesc} | Protocol: ${failureLog.protocol} | Code: ${failureLog.errorCode} | Duration: ${failureLog.durationMs ?? "?"}ms`
      );

      return Promise.reject(error);
    }
  );
}
