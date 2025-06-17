import Colors from '@/constants/colors';
import { Stack } from 'expo-router';
import React from 'react';

interface ICustomizedHeaderBack {
  title: string;
}

const CustomizedHeaderBack = (props: ICustomizedHeaderBack) => <Stack.Screen
  options={{
    headerShown: true,
    title: '',
    headerStyle: { backgroundColor: 'black' },
    headerBackTitle: props.title,
    headerTintColor: Colors.primary,
  }}
/>;

export default CustomizedHeaderBack;
