import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { PhoneNumber } from '../../hooks/phone';

export const Container = styled.View`
  flex: 1;
  padding: 20px 16px;
  background: #fff;
`;

export const PhoneList = styled(FlatList as new () => FlatList<PhoneNumber>)`
  margin-top: 16px;
`;

export const PhoneListItem = styled(RectButton)`
  height: 70px;
  width: 100%;
  padding: 0 10px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PhoneListItemNumber = styled.Text`
  font-size: 21px;
`;

export const HeaderButtonAdd = styled.TouchableOpacity`
  padding: 4px 16px;
`;

export const Divisor = styled.View`
  height: 1px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.05);
`;

export const SectionHeader = styled.Text`
  font-size: 14px;
  font-weight: bold;
  background: #f6f6f6;
  padding: 4px 10px;
  margin-right: 5px;
`;
