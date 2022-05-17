import { v4 as uuidv4 } from 'uuid';
import { useStorage } from '@vueuse/core'
import { createSyncState } from '@slidev/client/state/syncState'
// @ts-expect-error vite-plugin-vue-server-ref
import pollState from 'server-reactive:poll'

import { PollState } from './types';

const { init, onPatch, patch, state } = createSyncState<PollState>(pollState, {});

export { init, onPatch, patch, state }
export const uid = useStorage('slidev-poll-device-id', uuidv4());
