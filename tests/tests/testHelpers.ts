import { getData } from '../../src/dataStore';

export function getControlUserIdFromSession(sessionId: string): number {
  const data = getData();
  const session = data.sessions.find(s => s.controlUserSessionId === sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  return session.controlUserId;
}
