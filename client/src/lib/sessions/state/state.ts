import {LiveSession} from '../../../../../shared/src/types/Session';
import {create} from 'zustand';

type State = {
  isLoading: boolean;
  sessions: LiveSession[] | null;
};

type Actions = {
  setIsLoading: (isLoading: State['isLoading']) => void;
  setSessions: (sessions: State['sessions']) => void;
  reset: () => void;
};

const initialState: State = {
  isLoading: false,
  sessions: null,
};

const useSessionsState = create<State & Actions>()(set => ({
  ...initialState,
  setIsLoading: isLoading => set({isLoading}),
  setSessions: sessions => set({sessions}),
  reset: () => set(initialState),
}));

export default useSessionsState;
