import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import {LiveSession} from '../../../../../shared/src/types/Session';
import {logEvent} from '../../metrics';
import useUserState from '../../user/state/state';
import useSessionState from '../state/state';
import useLiveSessionMetricEvents from './useLiveSessionMetricEvents';

jest.mock('../../../lib/metrics');

jest.mock('../../../lib/content/hooks/useExerciseById', () => () => ({
  id: 'some-exercise-id',
  slides: ['slide 1', 'slide 2', 'slide 3'],
}));

const mockedLogEvent = jest.mocked(logEvent);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useLiveSessionMetricEvents', () => {
  it('logs events with specific properties', () => {
    useUserState.setState({
      user: {
        uid: 'some-user-id',
      } as FirebaseAuthTypes.User,
    });

    useSessionState.setState({
      liveSession: {
        id: 'some-session-id',
        type: 'private',
        mode: 'live',
        hostId: 'some-host-id',
        startTime: '2022-02-02T02:02:02Z',
        exerciseId: 'some-content-id',
        language: 'en',
      } as LiveSession,
    });

    const {result} = renderHook(() => useLiveSessionMetricEvents());

    result.current('Enter Intro Portal');

    expect(mockedLogEvent).toHaveBeenCalledTimes(1);
    expect(mockedLogEvent).toHaveBeenCalledWith('Enter Intro Portal', {
      'Sharing Session ID': 'some-session-id',
      'Sharing Session Type': 'private',
      'Sharing Session Mode': 'live',
      'Sharing Session Start Time': '2022-02-02T02:02:02Z',
      'Sharing Session Duration': expect.any(Number),
      'Exercise ID': 'some-content-id',
      Language: 'en',
      Host: false,
    });
  });

  it('resolves the host event property', () => {
    useUserState.setState({
      user: {
        uid: 'some-user-id',
      } as FirebaseAuthTypes.User,
    });

    useSessionState.setState({
      liveSession: {
        id: 'some-session-id',
        hostId: 'some-user-id',
      } as LiveSession,
    });

    const {result} = renderHook(() => useLiveSessionMetricEvents());

    result.current('Enter Intro Portal');

    expect(mockedLogEvent).toHaveBeenCalledTimes(1);
    expect(mockedLogEvent).toHaveBeenCalledWith(
      'Enter Intro Portal',
      expect.objectContaining({
        Host: true,
      }),
    );
  });

  it('resolves the duration event property', () => {
    useUserState.setState({
      user: {
        uid: 'some-user-id',
      } as FirebaseAuthTypes.User,
    });

    useSessionState.setState({
      liveSession: {
        id: 'some-session-id',
        startTime: dayjs().subtract(1, 'hour').toISOString(),
      } as LiveSession,
    });

    const {result} = renderHook(() => useLiveSessionMetricEvents());

    result.current('Enter Intro Portal');

    expect(mockedLogEvent).toHaveBeenCalledTimes(1);
    expect(mockedLogEvent).toHaveBeenCalledWith(
      'Enter Intro Portal',
      expect.objectContaining({
        'Sharing Session Duration': 3600,
      }),
    );
  });
});
