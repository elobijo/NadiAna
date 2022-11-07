import React from 'react';
import {renderHook} from '@testing-library/react-hooks';

import useSessionState from '../state/state';
import {
  ExerciseStateInput,
  SessionData,
} from '../../../../../shared/src/types/Session';

afterEach(() => {
  jest.clearAllMocks();
});

const mockToggleAudio = jest.fn();

jest.mock('../../../lib/daily/DailyProvider');
jest.mock('./useSessionExercise', () => jest.fn());

import {
  DailyContext,
  DailyProviderTypes,
} from '../../../lib/daily/DailyProvider';
import useMuteAudioListener from './useMuteAudioListener';
import useSessionExercise from './useSessionExercise';

const mockUseSessionExercise = useSessionExercise as jest.Mock;

describe('useMuteAudioListener', () => {
  it('should toggle audio when state is playing and current slide is not sharing', async () => {
    useSessionState.setState({
      session: {
        exerciseState: {playing: true} as ExerciseStateInput,
      } as SessionData,
    });

    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <DailyContext.Provider
        value={{toggleAudio: mockToggleAudio} as unknown as DailyProviderTypes}>
        {children}
      </DailyContext.Provider>
    );

    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'reflection'}},
    });

    renderHook(() => useMuteAudioListener(), {
      wrapper,
    });

    expect(mockToggleAudio).toHaveBeenCalledTimes(1);
  });

  it('should not toggle audio when state is not playing', async () => {
    useSessionState.setState({
      session: {
        exerciseState: {playing: false} as ExerciseStateInput,
      } as SessionData,
    });

    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <DailyContext.Provider
        value={{toggleAudio: mockToggleAudio} as unknown as DailyProviderTypes}>
        {children}
      </DailyContext.Provider>
    );

    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'reflection'}},
    });

    renderHook(() => useMuteAudioListener(), {
      wrapper,
    });

    expect(mockToggleAudio).toHaveBeenCalledTimes(0);
  });

  it('should not toggle audio when current slide is sharing', async () => {
    useSessionState.setState({
      session: {
        exerciseState: {playing: true} as ExerciseStateInput,
      } as SessionData,
    });

    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <DailyContext.Provider
        value={{toggleAudio: mockToggleAudio} as unknown as DailyProviderTypes}>
        {children}
      </DailyContext.Provider>
    );

    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'sharing'}},
    });

    renderHook(() => useMuteAudioListener(), {
      wrapper,
    });

    expect(mockToggleAudio).toHaveBeenCalledTimes(0);
  });
});
