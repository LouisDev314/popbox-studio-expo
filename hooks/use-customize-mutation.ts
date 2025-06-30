import { IBaseApiResponse, responseError } from '@/interfaces/api-response';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';

interface ICustomizeMutationConfig<ApiResponse, ApiRequest> {
  mutationFn: MutationFunction<AxiosResponse<IBaseApiResponse<ApiResponse>>, ApiRequest>;
  retry?: boolean | number;
  onError?: (error: AxiosError<IBaseApiResponse>) => void;
  onSuccess?: (data: AxiosResponse<IBaseApiResponse<ApiResponse>, unknown>) => void;
}

const useCustomizeMutation = <ApiResponse, ApiRequest>({
                                                         mutationFn,
                                                         retry,
                                                         onSuccess,
                                                         onError,
                                                       }: ICustomizeMutationConfig<ApiResponse, ApiRequest>) => {
  const mutation = useMutation<AxiosResponse<IBaseApiResponse<ApiResponse>>, AxiosError, ApiRequest>({
    mutationFn,
    retry,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (err: responseError) => {
      if (err.code === 'ECONNABORTED' && err.message.includes('timeout')) {
        // TODO: Add info alert component
        // InfoAlert({ title: 'Network Error', description: 'Please check your connection' });
      } else if (err.code === HttpStatusCode.Unauthorized.toString() && err.message.includes('access token')) {
        // access token is expired

      } else {
        onError?.(err as AxiosError<IBaseApiResponse>);
      }
    },
  });

  return {
    mutation: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
};

export default useCustomizeMutation;
