// import { ErrorScreen } from '@enums/screen.enum';
// import { StorageItem } from '@enums/storage.enum';
// import { IBaseApiResponse } from '@/app/interfaces/api-response';
// import { deleteFromStorage } from '@utils/secure-store';
// import { router } from 'expo-router';
//
// export const serverErrorHandler = (error: IBaseApiResponse) => {
//   console.error('Server error:', {
//     data: {
//       msg: error.message,
//       code: error.code,
//     },
//   });
//   // TODO: add error handler effect -> popup etc.
//   router.navigate(ErrorScreen.InternalServerError);
// };
//
// // export const networkErrorHandler = (error: AxiosError) => {
// //   if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
// //     Alert.alert('Network Error', 'Please check your connection', [
// //       {
// //         text: 'OK',
// //       },
// //     ]);
// //     return true;
// //   }
// //   return false;
// // };
//
// export const badRequestHandler = (error: IBaseApiResponse) => {
//   console.error('Bad request:', {
//     data: {
//       msg: error.message,
//       code: error.code,
//     },
//   });
//   // TODO: add error handler effect -> popup etc.
//   router.navigate({ pathname: ErrorScreen.BadRequest, params: { message: error.message } });
// };
//
// export const forbiddenHandler = async () => {
//   await deleteFromStorage(StorageItem.Token);
//   await deleteFromStorage(StorageItem.RefreshToken);
//   router.navigate(ErrorScreen.Forbidden);
// };
//
// export const timeoutHandler = () => {
//   console.error('Timeout error');
//   // TODO: add error handler effect -> popup etc.
//   router.navigate(ErrorScreen.TimeoutError);
// };
