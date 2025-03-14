import {LiveSession} from '../../../../../shared/src/types/Session';
import apiClient from '../../apiClient/apiClient';

const SESSIONS_ENDPOINT = '/sessions';

export const fetchSessions = async (
  exerciseId?: string,
): Promise<LiveSession[]> => {
  try {
    const response = await apiClient(
      `${SESSIONS_ENDPOINT}${exerciseId ? `?exerciseId=${exerciseId}` : ''}`,
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not fetch sessions', {cause});
  }
};
