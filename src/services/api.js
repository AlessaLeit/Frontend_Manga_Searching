import axios from "axios";

import { normalizeHttpError } from "../shared/errors/normalizeHttpError";

const apiBaseUrl = "/api";

/** Sem timeout, uma API travada deixaria a interface carregando para sempre. */
export const REQUEST_TIMEOUT_MS = 10_000_000;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
  timeout: REQUEST_TIMEOUT_MS,
});

// Qualquer falha de rede/HTTP chega às telas já como AppError traduzido.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeHttpError(error)),
);

export default api;
