import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useSlideContext } from "@slidev/client";

import { SlideContext } from "../types";

const lastPageIds: Record<string, number> = {};

// Generate an id for a poll
export function useId() {
  const { $route, $renderContext } = useSlideContext();

  const id = ref<string>("");
  let slideContext = SlideContext.MAIN;

  const path = computed(() => $route?.no!);

  onMounted(() => {
    if ($renderContext.value === "presenter")
      slideContext = SlideContext.PRESENTER_MAIN;
    if ($renderContext.value === "overview")
      slideContext = SlideContext.PRESENTER_OVERVIEW;
    if ($renderContext.value === "previewNext")
      slideContext = SlideContext.PRESENTER_NEXT;

    const pathVariant = `${slideContext}-${path.value}`;
    const lastPageId = (lastPageIds[pathVariant] || 0) + 1;
    lastPageIds[pathVariant] = lastPageId;
    id.value = `${path.value}-${lastPageId}`;
  });

  onBeforeUnmount(() => {
    const pathVariant = `${slideContext}-${path.value}`;
    if (lastPageIds[pathVariant]) {
      delete lastPageIds[pathVariant];
    }
  });

  return id;
}
