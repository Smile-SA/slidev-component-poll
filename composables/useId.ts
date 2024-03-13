import { inject, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { injectionRoute } from "@slidev/client/constants.ts";
import { useNav } from "@slidev/client";

import { SlideContext } from "../types/SlideContext.ts";

const { isPresenter } = useNav();

const lastPageIds: Record<string, number> = {};

export function useId() {
  const elementRef = ref();
  const route = inject(injectionRoute);
  const id = ref<string>("");
  let slideContext = SlideContext.MAIN;

  onMounted(() => {
    if (isPresenter.value) {
      slideContext = SlideContext.PRESENTER_MAIN;
      if (elementRef.value.closest(".next")) {
        slideContext = SlideContext.PRESENTER_NEXT;
      } else if (elementRef.value.closest(".slides-overview")) {
        slideContext = SlideContext.PRESENTER_OVERVIEW;
      }
    } else if (elementRef.value.closest(".slides-overview")) {
      slideContext = SlideContext.OVERVIEW;
    }

    const path = route?.path;
    const pathVariant = `${slideContext}-${path}`;
    const lastPageId = (lastPageIds[pathVariant] || 0) + 1;
    lastPageIds[pathVariant] = lastPageId;
    id.value = `${path}-${lastPageId}`;
  });

  onBeforeUnmount(() => {
    const path = route?.path;
    const pathVariant = `${slideContext}-${path}`;
    if (lastPageIds[pathVariant]) {
      delete lastPageIds[pathVariant];
    }
  });

  return { elementRef, id };
}
