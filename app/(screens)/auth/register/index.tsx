// import React from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Button, Input, Text, YStack } from 'tamagui'; // Assuming Tamagui for UI components
// import { useAuth } from '../../context/AuthContext';
// import { UserSchema } from '@/app/models/user';
//
// interface ILoginForm {
//   username: string;
//   password: string;
// }
//
// const RegisterInit = () => {
//   const { control, handleSubmit, formState: { errors } } = useForm<ILoginForm>({
//     resolver: zodResolver(UserSchema),
//   });
//   const { login } = useAuth();
//
//   const onSubmit = (data: ILoginForm) => {
//     const loginForm =
//       data.username.includes('@')
//         ? { email: data.username, password: data.password }
//         : { username: data.username, password: data.password };
//     login(loginForm);
//   };
//
//   return (
//     <YStack flex={1} justifyContent="center" padding="$4">
//       <Controller
//         control={control}
//         name="username"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <Input
//             placeholder="Username or email"
//             onBlur={onBlur}
//             onChangeText={onChange}
//             value={value}
//             autoCapitalize="none"
//           />
//         )}
//       />
//       {errors.username && <Text color="red">{errors.username.message}</Text>}
//
//       <Controller
//         control={control}
//         name="password"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <Input
//             placeholder="Password"
//             secureTextEntry
//             onBlur={onBlur}
//             onChangeText={onChange}
//             value={value}
//           />
//         )}
//       />
//       {errors.password && <Text color="red">{errors.password.message}</Text>}
//
//       <Button onPress={handleSubmit(onSubmit)}>Index</Button>
//     </YStack>
//   );
// };
//
// export default RegisterInit;
