import { AxiosError, AxiosResponse } from 'axios';

import { ErrorModel } from './../models/error.model';

export const generateUniqueString = (str: string = '') =>
  `${str}_${new Date().getTime()}`;

export const toURLSearchParams = (params: any) => {
  let str = '';

  const keys = Object.keys(params);
  str = keys
    .map(function (key) {
      const value = params[key];
      if (value === undefined || value === null) {
        return '';
      }

      const encodedValue = encodeURIComponent(value);
      return `${key}=${encodedValue}`;
    })
    .filter((param) => !!param)
    .join('&');

  return `?${str}`;
};

export const formatDate = (date: string) => {
  let parsedDate;
  if (!date) {
    return '';
  }
  parsedDate = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return parsedDate.toLocaleDateString('en-US', options);
};

/**
 * A utility function to handle errors after sending HTTP requests using Axios
 * @param error the caught error to be handled
 * @param onResponseError handles error when the request was made and
 * the server responded with a status code that falls out of the range of 2xx
 * @param onRequestError handle error when the request was made
 * but no response was received. `error.request` is an instance of XMLHttpRequest
 * in the browser and an instance of http.ClientRequest in node.js
 * @param onUnexpectedError handle error when something happened
 * in setting up the request that triggered an Error
 */
export const handleAxiosError = (
  error: any,
  onResponseError?: (response: AxiosResponse<ErrorModel>) => void,
  onRequestError?: (request: any) => void,
  onUnexpectedError?: (error: any) => void
) => {
  const axiosError = error as AxiosError<ErrorModel>;

  if (axiosError.response && onResponseError) {
    onResponseError(axiosError.response);
  } else if (axiosError.request && onRequestError) {
    onRequestError(axiosError.request);
  } else if (onUnexpectedError) {
    onUnexpectedError(error);
  }
};
