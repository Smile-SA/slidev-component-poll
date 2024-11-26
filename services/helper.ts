import type { CorrectAnswer, DisplayAnswersProp, Result } from "../types";

import { pollState } from "./state.ts";
import { deviceId } from "./user.ts";

export function indexMatchResult(
  index?: number,
  correctAnswer?: null | CorrectAnswer,
) {
  if (
    index === undefined ||
    correctAnswer === undefined ||
    (correctAnswer instanceof Object && !(correctAnswer instanceof Array))
  ) {
    return false;
  }
  // if (correctAnswer instanceof Object && !(correctAnswer instanceof Array)) {
  //   console.log(correctAnswer)
  //   return Object.entries(correctAnswer)
  //     .filter(([key, value]) => value === 1 && Number(key) === index)
  //     .length === 1;
  // }
  return correctAnswer instanceof Array
    ? correctAnswer.includes(index)
    : Number(correctAnswer) === index;
}

export function getDefaultValue(
  id: string,
  hasResult: boolean,
  multiple?: boolean,
  displayAnswers?: DisplayAnswersProp,
): null | Result {
  const answer = pollState[id]?.results?.[deviceId.value];
  if (hasResult) {
    if (
      (answer instanceof Object && displayAnswers == "brier") ||
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
  if (displayAnswers === "brier") {
    return {};
  }
  return multiple ? ([] as number[]) : null;
}

export function entriesIsValid(index: number) {
  return (
    entries: [string, Result],
  ): entries is [string, Record<number, number>] => {
    const [, result] = entries;
    return (
      result instanceof Object &&
      !(result instanceof Array) &&
      result[index] != null
    );
  };
}
