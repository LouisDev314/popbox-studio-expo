import { IBaseApiResponse } from '@/interfaces/api-response';
import { MutationFunction, useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

interface ICustomizeMutationConfig<ApiResponse, ApiRequest> {
  mutationFn: MutationFunction<AxiosResponse<IBaseApiResponse<ApiResponse>>, ApiRequest>;
  retry?: boolean | number;
  onError?: (err: AxiosError<IBaseApiResponse>) => void;
  onSuccess?: (data: AxiosResponse<IBaseApiResponse<ApiResponse>, unknown>) => void;
}

const useCustomizeMutation = <ApiResponse, ApiRequest>(config: ICustomizeMutationConfig<ApiResponse, ApiRequest>) => {
  const { onSuccess, onError, ...mutationConfig } = config;
  const mutation = useMutation<AxiosResponse<IBaseApiResponse<ApiResponse>>, AxiosError, ApiRequest>({
    mutationFn: mutationConfig.mutationFn,
    retry: mutationConfig.retry,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (err) => {
      if (err.code === 'ECONNABORTED' && err.message.includes('timeout')) {
        // TODO: Add info alert component
        // InfoAlert({ title: 'Network Error', description: 'Please check your connection' });
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
