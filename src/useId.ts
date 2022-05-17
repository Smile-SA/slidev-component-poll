import { inject, onMounted, ref } from 'vue';
import { injectionRoute } from '@slidev/client/constants';

import { getId } from './helper';

export function useId() {
  const elementRef = ref();
  const route = inject(injectionRoute);
  const id = ref<string>('');

  onMounted(() => {
    const prefix = elementRef.value.closest('.slides-overview') ? 'o-' : '';
    id.value = getId(`${prefix}${route?.path}`);
    // showResults.value = hasResult(id.value);
  })

  return { elementRef, id };
}

