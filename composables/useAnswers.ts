import {
  computed,
  inject,
  onMounted,
  RendererNode,
  useSlots,
} from "vue";

import { answersContext } from "../constants/context.ts";

export function useAnswers(answers?: string[]) {
  const context = inject(answersContext);
  const slots = useSlots();

  function getChildren(children: RendererNode[]) {
    if (!(children instanceof Array)) {
      return [];
    } else if (children instanceof Array && children.length === 1) {
      return getChildren(children[0].children);
    } else {
      return children;
    }
  }

  function getAnswers() {
    if (answers) {
      return answers;
    } else if (slots.default) {
      return getChildren(slots.default?.());
    }
    return [];
  }

  onMounted(() => {
    if (context?.answers.value.length === 0) {
      const answers = getAnswers();
      context.setAnswers(answers);
    }
  });

  return computed(() => {
    if (context?.answers) {
      return context.answers.value;
    }
    return [];
  });
}
