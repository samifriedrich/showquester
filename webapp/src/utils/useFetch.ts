import { useCallback, useState } from 'react';

const REDIRECT_STATUS = 303;
const ERROR_STATUS_CUTOFF = 400;

export enum HTTPVerbs {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

interface PostResponse {
  request: (
    url: string, method?: HTTPVerbs, data?: any, options?: Partial<RequestInit>
  ) => Promise<Response>;
  error?: APIErrorResponse;
  loading: boolean;
  complete: boolean;
  success: boolean;
}

export interface APIErrorResponse {
  text: string;
  code: number;
}

const useFetch = (): PostResponse => {
  const [error, setError] = useState<APIErrorResponse>();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [success, setSuccess] = useState(false);

  const request = useCallback(
    async (
      url: string,
      method: HTTPVerbs = HTTPVerbs.GET,
      data?: any,
      options?: Partial<RequestInit>,
    ): Promise<Response> => {
      setLoading(true);

      const postOptions = {
        ...options,
        body: JSON.stringify(data),
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const res = await fetch(url, postOptions);
      const json = await res.json();
      setSuccess(res.ok);

      if (res.status === REDIRECT_STATUS) {
        const redirectUrl = json.url;
        window.location.href = redirectUrl;
      }

      if (res.status >= ERROR_STATUS_CUTOFF) {
        setError({
          text: res.statusText,
          code: res.status,
        });
        setLoading(false);
        setComplete(true);
        return res;
      }

      setLoading(false);
      setComplete(true);
      return json;
    },
    [],
  );

  return {
    request,
    error,
    loading,
    complete,
    success,
  };
};

export default useFetch;
