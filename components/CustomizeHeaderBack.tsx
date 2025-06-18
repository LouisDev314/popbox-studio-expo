import Colors from '@/constants/colors';
import { Stack } from 'expo-router';
import React from 'react';

interface ICustomizeHeaderBackProps {
  title: string;
}

const CustomizeHeaderBack = (props: ICustomizeHeaderBackProps) => <Stack.Screen
  options={{
    headerShown: true,
    title: '',
    headerStyle: { backgroundColor: 'black' },
    headerBackTitle: props.title,
    headerTintColor: Colors.primary,
  }}
/>;

export default CustomizeHeaderBack;
