import logger from "./logger";

interface ApiCallerOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data: T;
}

export const callApi = async <T = unknown>(
  options: ApiCallerOptions
): Promise<ApiResponse<T>> => {
  const { url, body, method = 'GET' , headers = {}, timeout = 30000 } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    const startTime = Date.now();
    const response = await fetch(url, fetchOptions);
    const duration = Date.now() - startTime;

    const data = (await response.json()) as T;

    logger.info(
      `${method} ${url} -> ${response.status} (${duration}ms)`
    );

    return { success: response.ok, status: response.status, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`${method} ${url} failed: ${message}`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

// Shorthand helpers
export const getApi = <T = unknown>(url: string, headers?: Record<string, string>) =>
  callApi<T>({ url, method: "GET", headers });

export const postApi = <T = unknown>(url: string, body: unknown, headers?: Record<string, string>) =>
  callApi<T>({ url, method: "POST", body, headers });

export const putApi = <T = unknown>(url: string, body: unknown, headers?: Record<string, string>) =>
  callApi<T>({ url, method: "PUT", body, headers });

export const patchApi = <T = unknown>(url: string, body: unknown, headers?: Record<string, string>) =>
  callApi<T>({ url, method: "PATCH", body, headers });

export const deleteApi = <T = unknown>(url: string, headers?: Record<string, string>) =>
  callApi<T>({ url, method: "DELETE", headers });
