/*
  This hook is heavily inspired by
  https://github.com/PostHog/posthog-js-lite/blob/master/posthog-react-native/src/hooks/useNavigationTracker.ts
*/
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {logNavigation} from '../';

const useNavigationTracker = () => {
  const routes = useNavigationState(state => state?.routes);
  const navigation = useNavigation();

  const trackRoute = useCallback(() => {
    // NOTE: This method is not typed correctly but is available and takes care of parsing the router state correctly
    const currentRoute = (navigation as any).getCurrentRoute();
    if (!currentRoute) {
      return;
    }

    const {state} = currentRoute;
    let {name} = currentRoute;

    if (state?.routes?.length) {
      const route = state.routes[state.routes.length - 1];
      name = route.name;
    }

    logNavigation(
      name || 'Unknown',
      currentRoute?.params?.origin && {
        Origin: currentRoute.params.origin,
      },
    );
  }, [navigation]);

  useEffect(() => {
    // NOTE: The navigation stacks may not be fully rendered initially. This means the first route can be missed (it doesn't update useNavigationState)
    // If missing we simply wait a tick and call it again.
    if (!routes) {
      setTimeout(trackRoute, 1);
      return;
    }
    trackRoute();
  }, [routes, trackRoute]);
};

export default useNavigationTracker;
