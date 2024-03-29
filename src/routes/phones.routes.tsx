import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { Platform } from 'react-native';

import Phones from '../pages/Phones';
import CreatePhone from '../pages/Phones/Create';
import ShowPhone from '../pages/Phones/Show';

import { useLocale } from '../hooks/locale';

export type PhoneStackProps = {
  Phones: undefined;
  CreatePhone: undefined;
  ShowPhone: { id: string };
};

const Stack = createStackNavigator<PhoneStackProps>();

const PhonesRoutes: React.FC = () => {
  const { trans } = useLocale();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#000',
        headerBackTitleVisible: false,
        gestureDirection: 'horizontal',
        headerBackImage: ({ tintColor }) => (
          <Icon
            name="arrow-left"
            size={35}
            color={tintColor}
            style={{ paddingLeft: 16 }}
          />
        ),
        headerStatusBarHeight: Platform.OS === 'ios' ? undefined : 10,
        headerStyle: {
          shadowColor: 'transparent',
          elevation: 0,
          // height: 80,
        },
        headerTitleStyle: {
          textAlign: 'center',
          alignSelf: 'center',
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        name="Phones"
        component={Phones}
        options={{
          title: trans('phones.title'),
        }}
      />

      <Stack.Screen
        name="CreatePhone"
        component={CreatePhone}
        options={{
          title: trans('phones.create.title'),
        }}
      />

      <Stack.Screen
        name="ShowPhone"
        component={ShowPhone}
        options={{ title: trans('phones.show.title') }}
      />
    </Stack.Navigator>
  );
};

export default PhonesRoutes;
