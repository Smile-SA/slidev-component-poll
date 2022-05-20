import { presenterPassword } from '@slidev/client/logic/nav';
import { configs } from '@slidev/client/env';

import { SlideContext } from '../enums/SlideContext';

import { state, uid } from './state';

export function hasResult(id: string): boolean  {
  return state[id]?.results[uid.value] !== undefined
}

export function hasControlAccess(): boolean  {
  return !configs.remote || configs.remote === presenterPassword.value;
}

export function isPrivateRemoteEnabled(): boolean {
  return Boolean(configs.remote);
}
