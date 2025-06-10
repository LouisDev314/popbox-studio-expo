import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarShowLabel: false,
      tabBarStyle: {
        height: 70,
        paddingTop: 5,
        backgroundColor: '#111',
        borderTopWidth: 0.2,
      },
      tabBarIconStyle: {
        width: 32,
        height: 32,
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => <Ionicons
            name={focused ? 'home' : 'home-outline'}
            size={size}
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => <Ionicons
            name={focused ? 'search' : 'search-outline'}
            size={size}
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="kuji"
        options={{
          title: 'Kuji',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => <Ionicons
            name={focused ? 'ticket' : 'ticket-outline'}
            size={size}
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => <Ionicons
            name={focused ? 'cart' : 'cart-outline'}
            size={size}
            color={color}
          />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => <Ionicons
            name={focused ? 'person-circle' : 'person-circle-outline'}
            size={size}
            color={color}
          />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
