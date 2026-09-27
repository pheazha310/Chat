/** Envelope every REST endpoint wraps its payload in. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}