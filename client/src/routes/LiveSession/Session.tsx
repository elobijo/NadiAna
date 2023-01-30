import React, {useCallback, useContext, useEffect} from 'react';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';

import {SPACINGS} from '../../lib/constants/spacings';
import {COLORS} from '../../../../shared/src/constants/colors';

import {DailyUserData} from '../../../../shared/src/types/Session';
import {LiveSessionStackProps} from '../../lib/navigation/constants/routes';
import {DailyContext} from '../../lib/daily/DailyProvider';

import useSessionState from '../../lib/session/state/state';
import useSessionParticipants from '../../lib/session/hooks/useSessionParticipants';
import useSessionSlideState from '../../lib/session/hooks/useSessionSlideState';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import useLeaveSession from '../../lib/session/hooks/useLeaveSession';
import useIsSessionHost from '../../lib/session/hooks/useIsSessionHost';
import useLocalParticipant from '../../lib/daily/hooks/useLocalParticipant';
import useUser from '../../lib/user/hooks/useUser';
import useSubscribeToSessionIfFocused from '../../lib/session/hooks/useSusbscribeToSessionIfFocused';
import useExerciseTheme from '../../lib/session/hooks/useExerciseTheme';
import useSessionExercise from '../../lib/session/hooks/useSessionExercise';
import useUpdateSessionState from '../../lib/session/hooks/useUpdateSessionState';
import useLogInSessionMetricEvents from '../../lib/session/hooks/useLogInSessionMetricEvents';
import useCheckPermissions from '../../lib/session/hooks/useCheckPermissions';
import useUserState from '../../lib/user/state/state';

import {
  BottomSafeArea,
  Spacer12,
  Spacer16,
  Spacer32,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';

import ExerciseSlides from '../../lib/session/components/ExerciseSlides/ExerciseSlides';
import Participants from '../../lib/session/components/Participants/Participants';
import ProgressBar from '../../lib/session/components/ProgressBar/ProgressBar';
import ContentControls from '../../lib/session/components/ContentControls/ContentControls';
import IconButton from '../../lib/components/Buttons/IconButton/IconButton';
import {
  FilmCameraIcon,
  FilmCameraOffIcon,
  HangUpIcon,
  MicrophoneIcon,
  MicrophoneOffIcon,
} from '../../lib/components/Icons';
import Button from '../../lib/components/Buttons/Button';
import HostNotes from '../../lib/session/components/HostNotes/HostNotes';
import Screen from '../../lib/components/Screen/Screen';

const Spotlight = styled.View({
  aspectRatio: '0.9375',
});

const ExerciseControl = styled(ContentControls)({
  position: 'absolute',
  bottom: SPACINGS.SIXTEEN,
  left: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
  zIndex: 1000,
});

const SessionControls = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const Progress = styled(ProgressBar)({
  position: 'absolute',
  left: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
  top: SPACINGS.EIGHT,
});

const SpotlightContent = styled.View({
  flex: 1,
});

const Top = styled.View({
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  zIndex: 1,
});

const StyledButton = styled(Button)({
  alignSelf: 'flex-end',
  marginRight: SPACINGS.SIXTEEN,
});

const StyledHangUpIcon = () => <HangUpIcon fill={COLORS.ACTIVE} />;

const Session: React.FC = () => {
  const {
    setUserData,
    toggleAudio,
    toggleVideo,
    setSubscribeToAllTracks,
    leaveMeeting,
  } = useContext(DailyContext);
  const {
    params: {session},
  } = useRoute<RouteProp<LiveSessionStackProps, 'Session'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<LiveSessionStackProps>>();
  const {t} = useTranslation('Screen.Session');
  useSubscribeToSessionIfFocused(session, {exitOnEnded: false});

  const participants = useSessionParticipants();
  const {endSession} = useUpdateSessionState(session.id);
  const me = useLocalParticipant();
  const isHost = useIsSessionHost();
  const sessionState = useSessionState(state => state.sessionState);
  const sessionSlideState = useSessionSlideState();
  const exercise = useSessionExercise();
  const theme = useExerciseTheme();
  const {logLiveSessionMetricEvent} = useLogInSessionMetricEvents();
  const {leaveSessionWithConfirm} = useLeaveSession(session.type);
  const {checkCameraPermissions, checkMicrophonePermissions} =
    useCheckPermissions();
  const user = useUser();
  const {addCompletedSession} = useUserState();

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  usePreventGoingBack(leaveSessionWithConfirm);

  useEffect(() => {
    if (sessionState?.id) {
      logLiveSessionMetricEvent('Enter Sharing Session');
    }
  }, [logLiveSessionMetricEvent, sessionState?.id]);

  useEffect(() => {
    if (sessionState?.completed) {
      addCompletedSession({
        id: sessionState?.id,
        completedAt: dayjs.utc().toDate(),
      });
      logLiveSessionMetricEvent('Complete Sharing Session');
    }
  }, [
    sessionState?.completed,
    sessionState?.id,
    logLiveSessionMetricEvent,
    addCompletedSession,
  ]);

  useEffect(() => {
    if (sessionState?.ended) {
      leaveMeeting().then(() => navigate('OutroPortal'));
    }
  }, [sessionState?.ended, navigate, leaveMeeting]);

  useEffect(() => {
    setUserData({
      inPortal: false,
      photoURL: user?.photoURL,
    } as DailyUserData);
    setSubscribeToAllTracks();
  }, [setUserData, setSubscribeToAllTracks, user?.photoURL]);

  const toggleAudioPress = useCallback(() => {
    checkMicrophonePermissions(() => {
      toggleAudio(!hasAudio);
    });
  }, [checkMicrophonePermissions, toggleAudio, hasAudio]);

  const toggleVideoPress = useCallback(() => {
    checkCameraPermissions(() => {
      toggleVideo(!hasVideo);
    });
  }, [checkCameraPermissions, toggleVideo, hasVideo]);

  return (
    <Screen backgroundColor={theme?.backgroundColor}>
      {isHost && (
        <Top>
          <HostNotes exercise={exercise} />
          {!sessionSlideState?.next && (
            <>
              <Spacer16 />
              <StyledButton small active onPress={endSession}>
                {t('endButton')}
              </StyledButton>
            </>
          )}
        </Top>
      )}
      <TopSafeArea />
      <Spotlight>
        {sessionSlideState && (
          <SpotlightContent>
            {isHost && <Spacer32 />}
            <ExerciseSlides
              index={sessionSlideState.index}
              current={sessionSlideState.current}
              previous={sessionSlideState.previous}
              next={sessionSlideState.next}
            />
            {!isHost && (
              <Progress
                index={sessionSlideState.index}
                length={exercise?.slides.length}
              />
            )}
          </SpotlightContent>
        )}
        <ExerciseControl sessionId={session.id} />
      </Spotlight>
      <Participants participants={participants} />
      <Spacer16 />
      <SessionControls>
        <IconButton
          onPress={toggleAudioPress}
          active={!hasAudio}
          variant="secondary"
          Icon={hasAudio ? MicrophoneIcon : MicrophoneOffIcon}
        />
        <Spacer12 />
        <IconButton
          onPress={toggleVideoPress}
          active={!hasVideo}
          variant="secondary"
          Icon={hasVideo ? FilmCameraIcon : FilmCameraOffIcon}
        />
        <Spacer12 />
        <IconButton
          variant="secondary"
          Icon={StyledHangUpIcon}
          fill={COLORS.ACTIVE}
          onPress={leaveSessionWithConfirm}
        />
      </SessionControls>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default Session;
