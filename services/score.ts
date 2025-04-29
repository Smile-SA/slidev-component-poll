import { CorrectAnswer } from "../types";

export function getBrierMaxPoints(correctAnswers?: CorrectAnswer) {
  if (correctAnswers instanceof Array) {
    return correctAnswers.length * 100;
  }
  if (correctAnswers instanceof Object) {
    return Math.round(
      Object.values(correctAnswers)
        .filter((value) => value != null)
        .reduce((a, b) => a + b, 0) * 100
    );
  }
  return 100;
}

export function mcqScore(
  correctAnswers: CorrectAnswer,
  results: number[],
  totalQuestions: number
) {
  let answers: number[] = [];
  if (
    typeof correctAnswers === "string" ||
    typeof correctAnswers === "number"
  ) {
    answers = [Number(correctAnswers)];
  } else if (correctAnswers instanceof Array) {
    answers = correctAnswers;
  } else {
    answers = Object.keys(correctAnswers).map(Number);
  }

  let error = 0;
  for (let i = 0; i < totalQuestions; i++) {
    error += Math.pow(answers.includes(i) && results.includes(i) ? 0 : 1, 2);
  }
  // const error = renderAnswers.value.reduce(
  //     (acc, _answer, index) =>
  //       acc +
  //       Math.pow(
  //         correctAnswer.includes(index) && results.includes(index) ? 0 : 1,
  //         2
  //       ),
  //     0
  //   );
  return Math.round((1 - error / totalQuestions) * 100);
}

export function brierError(
  correctAnswers: CorrectAnswer,
  results: Record<number, number>
) {
  return Object.entries(correctAnswers)
    .filter(([, answer]) => answer !== null)
    .map(([key, answer]) => (results[key] ?? 0) / 100 - answer)
    .reduce((a, b) => a + Math.pow(b, 2), 0);
}

export function brierScore(
  correctAnswers: CorrectAnswer,
  results: Record<number, number>,
  totalQuestions: number
) {
  let answers: Record<number, number | null> = {};
  if (
    typeof correctAnswers === "string" ||
    typeof correctAnswers === "number"
  ) {
    answers[Number(correctAnswers)] = 1;
  } else if (correctAnswers instanceof Array) {
    answers = Object.fromEntries(correctAnswers.map((answer) => [answer, 1]));
  } else {
    answers = correctAnswers;
  }

  let remainingPoints = getBrierMaxPoints(correctAnswers);
  const minScoreResponses = {};
  const sortedAnswers = Object.entries(answers).sort(
    ([, a], [, b]) => (a ?? 0.4999) - (b ?? 0.4999)
  );

  let i = 0;
  while (remainingPoints > 0) {
    const score = Math.min(remainingPoints, 100);
    const index = sortedAnswers[i][0]
    minScoreResponses[index] = score;
    remainingPoints -= score;
    i++;
  }

  /*
  let naIndexes: number[] = [];
  let remIndexes: number[] = [];
  const minScoreResponses = {};
  for (let i = 0; i < totalQuestions; i++) {
    const answer = answers[i];
    if (answer === null) {
      naIndexes.push(i);
    } else if (answer > 0.5) {
      minScoreResponses[i] = 0;
    } else if (answer < 0.5 || answer === undefined) {
      const score = Math.min(remainingPoints, 100);
      minScoreResponses[i] = score;
      remainingPoints -= score;
    } else if (answer === 0.5) {
      remIndexes.push(i);
    }
  }
  for (const i of remIndexes) {
    if (remainingPoints >= 100) {
      minScoreResponses[i] = 100;
      remainingPoints -= 100;
    }
  }
  for (const i of naIndexes) {
    const score = Math.min(remainingPoints, 100);
    minScoreResponses[i] = score;
    remainingPoints -= score;
  }

  if (remainingPoints > 0) {
    // TODO
  }
  */

  console.log("correctAnswers", correctAnswers);
  console.log("points", getBrierMaxPoints(correctAnswers));
  console.log(
    "min score, max brierError",
    minScoreResponses,
    brierError(correctAnswers, minScoreResponses)
  );
  console.log(
    "custom brierError",
    { 0: 30, 1: 0, 2: 100, 3: 100 },
    brierError(correctAnswers, { 0: 30, 1: 0, 2: 100, 3: 100 })
  );
  console.log(
    "custom brierError",
    { 0: 30, 1: 0, 2: 100, 3: 100 },
    brierError(correctAnswers, { 0: 30, 1: 0, 2: 100, 3: 100 })
  );

  return 100;
}
