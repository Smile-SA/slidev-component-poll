import { computed } from "vue";
import { configs, useNav } from "@slidev/client";

const nav = useNav();
const { isPresenter, currentRoute } = nav

const presenterPassword = computed(() => currentRoute.value.query.password);

export function hasControlAccess(): boolean {
  return !configs.remote || configs.remote === presenterPassword.value;
}

export function isPrivateRemoteEnabled(): boolean {
  return Boolean(configs.remote);
}

export const canUseControls = computed(
  () => hasControlAccess() && (isPrivateRemoteEnabled() || isPresenter.value)
);
