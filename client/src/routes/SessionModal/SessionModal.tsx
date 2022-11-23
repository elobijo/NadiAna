import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Platform, Share, View} from 'react-native';
import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {BellIcon, ShareIcon} from '../../common/components/Icons';
import Image from '../../common/components/Image/Image';
import SheetModal from '../../common/components/Modals/SheetModal';
import {Spacer16, Spacer8} from '../../common/components/Spacers/Spacer';
import {Display24} from '../../common/components/Typography/Display/Display';
import {COLORS} from '../../../../shared/src/constants/colors';
import {
  ModalStackProps,
  AppStackProps,
} from '../../lib/navigation/constants/routes';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import useAddToCalendar from '../Sessions/hooks/useAddToCalendar';
import useSessionNotificationReminder from '../Sessions/hooks/useSessionNotificationReminder';
import {Body14} from '../../common/components/Typography/Body/Body';
import Byline from '../../common/components/Bylines/Byline';
import {formatInviteCode} from '../../common/utils/string';
import * as metrics from '../../lib/metrics';
import CalendarIcon from '../../common/components/Icons/Calendar/Calendar';

const Content = styled(Gutters)({
  flexDirection: 'row',
  justifyContent: 'space-between',
});
const BottomContent = styled(Gutters)({
  alignItems: 'center',
  flexDirection: 'row',
});

const ImageContainer = styled.View({
  flex: 1,
  height: 80,
});

const SessionModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<ModalStackProps, 'SessionModal'>>();
  const {t} = useTranslation('Modal.Session');

  const navigation = useNavigation<NativeStackNavigationProp<AppStackProps>>();

  const addToCalendar = useAddToCalendar();
  const exercise = useExerciseById(session?.contentId);
  const {reminderEnabled, toggleReminder} =
    useSessionNotificationReminder(session);

  const startTime = dayjs(session.startTime);
  const startingNow = dayjs().isAfter(startTime.subtract(10, 'minutes'));

  if (!session || !exercise) {
    return null;
  }

  const onJoin = () => {
    navigation.popToTop();
    navigation.navigate('SessionStack', {
      screen: 'ChangingRoom',
      params: {
        sessionId: session.id,
      },
    });
    metrics.logEvent('Join Session', {
      'Session Exercise ID': session.contentId,
      'Session Language': session.language,
      'Session Type': session.type,
      'Session Start Time': session.startTime,
    });
  };

  const onAddToCalendar = () => {
    addToCalendar(
      exercise.name,
      session.link,
      startTime,
      startTime.add(30, 'minutes'),
    );
    metrics.logEvent('Add Session To Calendar', {
      'Session Exercise ID': session.contentId,
      'Session Language': session.language,
      'Session Type': session.type,
      'Session Start Time': session.startTime,
    });
  };

  const onToggleReminder = () => {
    toggleReminder(!reminderEnabled);
    if (!reminderEnabled) {
      metrics.logEvent('Add Session Reminder', {
        'Session Exercise ID': session.contentId,
        'Session Language': session.language,
        'Session Type': session.type,
        'Session Start Time': session.startTime,
      });
    }
  };

  const onShare = () => {
    if (session.link) {
      Share.share({
        url: session.link,
        message: t('shareMessage', {
          link: Platform.select({android: session.link, default: undefined}),
          code: formatInviteCode(session.inviteCode),
          interpolation: {escapeValue: false},
        }),
      });
    }
  };

  return (
    <SheetModal>
      <Spacer16 />
      <Content>
        <View>
          <Display24>{exercise?.name}</Display24>
          <Byline
            pictureURL={session.hostProfile?.photoURL}
            name={session.hostProfile?.displayName}
          />
        </View>
        <ImageContainer>
          <Image
            resizeMode="contain"
            source={{uri: exercise?.card?.image?.source}}
          />
        </ImageContainer>
      </Content>
      <Spacer16 />
      <BottomContent>
        {startingNow ? (
          <>
            <Button small variant="primary" onPress={onJoin}>
              {t('join')}
            </Button>
          </>
        ) : (
          <>
            <IconButton
              Icon={CalendarIcon}
              variant={'secondary'}
              onPress={onAddToCalendar}
            />
            <Spacer8 />
            <IconButton
              Icon={BellIcon}
              variant="secondary"
              active={reminderEnabled}
              onPress={onToggleReminder}
            />
          </>
        )}

        <Spacer8 />
        {session.link && (
          <>
            <Button variant="secondary" onPress={onShare} LeftIcon={ShareIcon}>
              {formatInviteCode(session.inviteCode)}
            </Button>
          </>
        )}
      </BottomContent>
    </SheetModal>
  );
};

export default SessionModal;
