import { AxiosError } from 'axios';

type ErrorResponse = {
  message: string;
  status?: number;
};

const getDefaultMessageForStatus = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid credentials. Please try again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This action conflicts with the current state.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
};

export const handleApiError = (error: unknown): ErrorResponse => {
  if (error instanceof AxiosError) {
    if (error.response) {
      return {
        message: error.response.data?.message || getDefaultMessageForStatus(error.response.status),
        status: error.response.status,
      };
    }
    return {
      message: 'Network error. Please check your connection.',
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
};
