import {NavigatorScreenParams} from '@react-navigation/native';

import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {UserProfile} from '../../../../../shared/src/types/User';
import {
  AsyncSession,
  LiveSession,
} from '../../../../../shared/src/types/Session';
import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';

export type TabNavigatorProps = {
  Home: undefined;
  SessionsStack: undefined;
  JourneyStack: undefined;
};

export type SessionsStackProps = {
  Sessions: undefined;
  Collection: {collectionId: string};
};

export type JourneyStackProps = {
  Journey: undefined;
  Collection: {collectionId: string};
};

export type LiveSessionStackProps = {
  ChangingRoom: {session: LiveSession};
  Session: {session: LiveSession};
  IntroPortal: {session: LiveSession};
  OutroPortal: {session: LiveSession};
};

export type AsyncSessionStackProps = {
  IntroPortal: {session: AsyncSession};
  Session: {session: AsyncSession};
  OutroPortal: {session: AsyncSession};
};

export type AppStackProps = {
  KillSwitch: undefined;
  Welcome?: {showBack: boolean};
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  LiveSessionStack: NavigatorScreenParams<LiveSessionStackProps>;
  AsyncSessionStack: NavigatorScreenParams<AsyncSessionStackProps>;
};

export type OverlayStackProps = {
  App: NavigatorScreenParams<AppStackProps>;
  AboutEditorialOverlay: undefined;
  CommunityEditorialOverlay: undefined;
  AboutOverlay: undefined;
  EarlyAccessInfoOverlay?: {showBack: boolean};
};

export type ModalStackProps = {
  OverlayStack: NavigatorScreenParams<OverlayStackProps>;
  SessionModal: {session: LiveSession};
  CompletedSessionModal: {
    completedSessionEvent: CompletedSessionEvent;
  };
  SharingModal: {exerciseId: string};
  SharingPostModal: {
    userProfile?: UserProfile;
    text: string;
  };
  SessionUnavailableModal: undefined;
  AddSessionByInviteModal?: {inviteCode?: number};
  CreateSessionModal: {exerciseId?: Exercise['id']; discover?: boolean};
  UpgradeAccountModal?: undefined;
  RequestPublicHostModal?: {code?: string; haveRequested?: boolean};
  ChangeLanguageModal: undefined;
  ProfileSettingsModal: undefined;
  SignInModal: undefined;
  DeleteUserModal: undefined;
  ContributorsModal: undefined;
  HostsModal: undefined;
  PartnersModal: undefined;
  DeveloperModal: undefined;
  ContactModal: undefined;
  SessionFeedbackModal: {
    exerciseId: Exercise['id'];
    sessionId: LiveSession['id'];
    completed: boolean;
    isHost: boolean;
  };
};

export type RootNavigationProps = ModalStackProps;
