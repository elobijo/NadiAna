import {useCallback} from 'react';
import useAsyncPostMetricEvents from '../../session/hooks/useAsyncPostMetricEvents';

import useSessionState from '../../session/state/state';
import useUserEvents from '../../user/hooks/useUserEvents';
import useUserState from '../../user/state/state';
import {addPost, fetchPosts} from '../api/posts';

const useSharingPosts = (exerciseId?: string) => {
  const addEvent = useUserState(state => state.addUserEvent);
  const {postEvents} = useUserEvents();
  const session = useSessionState(state => state.asyncSession);
  const logAsyncPostMetricEvent = useAsyncPostMetricEvents();

  const getSharingPosts = useCallback(
    async (sharingId: string) => {
      if (exerciseId) {
        return fetchPosts(exerciseId, sharingId);
      }
      return [];
    },
    [exerciseId],
  );

  const addSharingPost = useCallback(
    async (
      sharingId: string,
      text: string,
      isPublic: boolean,
      isAnonymous: boolean,
    ) => {
      if (exerciseId && session?.id) {
        if (isPublic) {
          await addPost(exerciseId, sharingId, text, isAnonymous);
        }
        addEvent('post', {
          exerciseId,
          sessionId: session.id,
          sharingId,
          isPublic,
          isAnonymous,
          text,
        });
        logAsyncPostMetricEvent('Create Async Post', isPublic, isAnonymous);
      }
    },
    [exerciseId, session?.id, addEvent, logAsyncPostMetricEvent],
  );

  const getSharingPostForSession = useCallback(
    (sessionId: string, sharingId: string) => {
      return postEvents.find(
        event =>
          event.payload.exerciseId === exerciseId &&
          event.payload.sessionId === sessionId &&
          event.payload.sharingId === sharingId,
      );
    },
    [postEvents, exerciseId],
  );

  const getSharingPostsForExercise = useCallback(
    (sharingId: string) => {
      return postEvents
        .filter(
          event =>
            event.payload.exerciseId === exerciseId &&
            event.payload.sharingId === sharingId,
        )
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
    },
    [postEvents, exerciseId],
  );

  return {
    getSharingPosts,
    getSharingPostForSession,
    getSharingPostsForExercise,
    addSharingPost,
  };
};

export default useSharingPosts;
