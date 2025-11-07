import HTTPError from 'http-errors';

function notImplemented(): never {
  throw HTTPError(501, 'Not implemented');
}

export function adminPayloadDeployedList(controlUserSessionId: string) {
  return notImplemented();
}
