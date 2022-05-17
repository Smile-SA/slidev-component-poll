import { presenterPassword } from '@slidev/client/logic/nav';
import { configs } from '@slidev/client/env';

import { state, uid } from './state';

const lastPageIds: Record<string, number> = {};

export function getId(path: string = '0'): string {
  const lastPageId = (lastPageIds[path] || 0) + 1;
  lastPageIds[path] = lastPageId;
  return `${path}-${lastPageId}`;
}

export function hasResult(id: string): boolean  {
  return state[id]?.results[uid.value] !== undefined
}

export function hasControlAccess(): boolean  {
  return !configs.remote || configs.remote === presenterPassword.value;
}

export function isPrivateRemoteEnabled(): boolean {
  return Boolean(configs.remote);
}
