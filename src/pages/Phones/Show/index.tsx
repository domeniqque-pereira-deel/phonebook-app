/* eslint-disable import/no-duplicates */
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, InteractionManager, View, NativeModules, LayoutAnimation } from 'react-native';
import { useRoute, RouteProp, useNavigation, StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { format } from 'date-fns';
import crashlytics from '@react-native-firebase/crashlytics';
import { ptBR, enUS } from 'date-fns/locale';

import { PhoneStackProps } from '../../../routes/phones.routes';
import { PhoneResult, usePhone, PhoneStatus } from '../../../hooks/phone';
import getPhoneURI from '../../../utils/getPhoneURI';
import isMobilePhone from '../../../utils/isMobilePhone';
import { useAlert } from '../../../hooks/alert';
import { useLocale } from '../../../hooks/locale';


import {
  Container,
  Header,
  HeaderAction,
  HeaderText,
  HeaderLabel,
  PhoneStatusLabel,
  ActionContainer,
  ActionButton,
  ActionButtonText,
  DeleteButton,
  LastUpdate,
} from './styles';

type ShowPhoneScreenProps = RouteProp<PhoneStackProps, 'ShowPhone'>;

const Show: React.FC = () => {
  const [phone, setPhone] = useState<PhoneResult>({} as PhoneResult);
  const [loading, setLoading] = useState(true);

  const { params } = useRoute<ShowPhoneScreenProps>();
  const { findById, setStatus, destroy } = usePhone();
  const navigation = useNavigation();
  const { alert, success } = useAlert();
  const { trans, language } = useLocale();

  const handleCallToPhone = useCallback(() => {
    if (isMobilePhone && phone) {
      const { nationalValue, countryCode, iterableValue } = phone;
      const link = getPhoneURI({ nationalValue, countryCode, iterableValue });

      Linking.openURL(link);
    }
  }, [phone]);

  const handlePhoneStatus = useCallback(
    async (status: PhoneStatus) => {
      if (!phone?.id) return;

      crashlytics().log('Alterando a situação de um número');

      setStatus(phone?.id, status);

      InteractionManager.runAfterInteractions(() => {
        if (status === PhoneStatus.Received) {
          alert({
            title: trans('phones.show.addInterested'),
            confirmText: trans('phones.show.addInterestedConfirm'),
            cancelText:  trans('phones.show.addInterestedCancel'),
            onConfirm: () => {
              navigation.dispatch(StackActions.pop(1));

              navigation.navigate('Interested', {
                initial: false,
                screen: 'CreateInterested',
                params: {
                  nationalPhone: phone.nationalValue,
                  countryCode: phone.countryCode,
                },
              });
            },
            onCancel: () => {
              navigation.navigate('Phones');
            }
          })
        } else {
          navigation.navigate('Phones');
          // success(800);
        }
      });
    },
    [phone?.id, setStatus, navigation, success, alert, trans],
  );

  const handleDeletePhone = useCallback(() => {
    if (!phone?.id) return;

    alert({
      title: trans('phones.show.deleteTitle'),
      text: phone.nationalValue,
      confirmText: trans('phones.show.deleteOk'),
      cancelText: trans('phones.show.deleteCancel'),
      onConfirm: () => {
        crashlytics().log('Deletando um número');

        destroy(phone?.id)
          .then(() => {
            navigation.dispatch(StackActions.pop(1));
            success();
          })
          .catch(error => crashlytics().recordError(error));
      },
    });
  }, [phone?.id, destroy, navigation, alert, success, trans]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <DeleteButton onPress={handleDeletePhone}>
          <Icon name="trash" size={25} color="#000" />
        </DeleteButton>
      ),
    });
  }, [navigation, handleDeletePhone]);

  useEffect(() => {
    crashlytics().log('Exibindo um número');

    async function loadPhone(): Promise<void> {
      const data = await findById(params.id);

      if (data) setPhone(data);
      setLoading(false);
    }

    InteractionManager.runAfterInteractions(loadPhone);
  }, [params.id, findById]);

  const getUpdatedAtFormated = useCallback(
    (date: Date) => {
      const dateLocale = language === 'pt_BR' ? ptBR : enUS;

      const updatedAtFormated = format(date, 'cccc, dd MMM yyyy', {
        locale: dateLocale,
      });

      return `${trans('phones.show.updatedAt')} ${updatedAtFormated}`;
    },
    [language, trans],
  );

  const resolvePhoneStatusName = useCallback(
    (status: number | undefined): string => {
      switch (status) {
        case PhoneStatus.Received:
          return trans('phoneStatus.received');
        case PhoneStatus.Missed:
          return trans('phoneStatus.missed');
        case PhoneStatus.NotExist:
          return trans('phoneStatus.notExist');
        case PhoneStatus.Removed:
          return trans('phoneStatus.removed');
        default:
          return trans('phoneStatus.new');
      }
    },
    [trans],
  );

  return (
    <Container>
      <Header>
        {loading ? (
          <Placeholder Animation={Fade}>
            <View style={{ alignItems: 'center' }}>
              <PlaceholderLine height={35} width={50} />
            </View>
          </Placeholder>
        ) : (
          <HeaderAction onPress={handleCallToPhone}>
            <HeaderText>{phone?.nationalValue}</HeaderText>
            {isMobilePhone && (
              <HeaderLabel>{trans('phones.show.clickToCall')}</HeaderLabel>
            )}
          </HeaderAction>
        )}
      </Header>

      <PhoneStatusLabel>
        {resolvePhoneStatusName(phone?.status)}
      </PhoneStatusLabel>

      <ActionContainer>
        <ActionButton onPress={() => handlePhoneStatus(PhoneStatus.Received)}>
          <Icon name="phone-incoming" size={38} />
          <ActionButtonText>{trans('phoneStatus.received')}</ActionButtonText>
        </ActionButton>

        <ActionButton onPress={() => handlePhoneStatus(PhoneStatus.NotExist)}>
          <Icon name="phone-off" size={38} />
          <ActionButtonText>{trans('phoneStatus.notExist')}</ActionButtonText>
        </ActionButton>

        <ActionButton onPress={() => handlePhoneStatus(PhoneStatus.Missed)}>
          <Icon name="phone-missed" size={38} />
          <ActionButtonText>{trans('phoneStatus.missed')}</ActionButtonText>
        </ActionButton>

        <ActionButton onPress={() => handlePhoneStatus(PhoneStatus.Removed)}>
          <Icon name="x" size={38} />
          <ActionButtonText>{trans('phoneStatus.removed')}</ActionButtonText>
        </ActionButton>
      </ActionContainer>

      {phone?.updated_at && phone.status !== PhoneStatus.New && (
        <LastUpdate>{getUpdatedAtFormated(phone?.updated_at)}</LastUpdate>
      )}
    </Container>
  );
};

export default Show;
