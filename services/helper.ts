import type { Result } from "../types";

import { pollState } from "./state.ts";
import { deviceId } from "./user.ts";

export function indexMatchResult(
  index?: number,
  correctAnswer?: null | string | number | number[]
) {
  if (index === undefined || correctAnswer === undefined) {
    return false;
  }
  return correctAnswer instanceof Array
    ? correctAnswer.includes(index)
    : Number(correctAnswer) === index;
}

export function getDefaultValue(
  id: string,
  hasResult: boolean,
  multiple?: boolean
): null | Result {
  const answer = pollState[id]?.results?.[deviceId.value];
  if (hasResult) {
    if (
      (answer instanceof Array && multiple) ||
      (typeof answer === "number" && !multiple)
    ) {
      return answer;
    } else if (multiple && typeof answer === "number") {
      return [answer];
    } else if (!multiple && answer instanceof Array) {
      return answer[0];
    }
  }
  return multiple ? ([] as number[]) : null;
}

export function isEnabled(defaultValue: null | Result, index: number): boolean {
  return defaultValue instanceof Array ? defaultValue.includes(index) : defaultValue === index
}
