---
theme: default
---

# Example slides

---

## Simple poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" displayResults="poll" />

---

## Simple quiz

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" correctAnswer="0" />

---

## Simple poll with HTML answers

<Poll question="What is your favorite color ?" displayResults="poll">

```js
() => 'Red';
```

```js
() => 'Green';
```

```js
() => 'Blue';
```

</Poll>

---

## Multiple poll

<Poll question="What are your favorite colors ?" :answers="['Red', 'Green', 'Blue']" :multiple="true" />

---

## Multiple quiz

<Poll question="What are your favorite colors ?" :answers="['Red', 'Green', 'Blue']" :correctAnswer="[0,2]" :multiple="true" :showScore="true" />

---

## Editable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :editable="true" />

---

## Controlled poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" />

---

## Controlled quiz

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" correctAnswer="0" />

---

## Controlled re-openable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" :reOpenable="true" />

---

## Controlled clearable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" :clearable="true" />

---

## Controlled clearable multiple poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" :multiple="true" :clearable="true" />

---

## Brier quiz

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" correctAnswer="0" displayAnswers="brier" :showScore="true" />

---

## Brier quiz with estimates

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :correctAnswer="{ 0: 0.5, 1: 0.5, 2: 1 }" displayAnswers="brier" :showScore="true" />

---

## Brier quiz with NA

<Poll
  question="What make mostly all those species so social ?"
  :answers="['They move in single file during their journey', 'They fish in hunters groups', 'They share nests between fishing parties', 'They look like us humans on some many aspects', 'They regurgitate food even for other\'s youngsters', 'They gather in cluster during winter']"
  :correctAnswer="{ 0: 1, 1: 1, 2: 0.1, 3: null, 4: 0.5, 5: 0.7 }"
  :explanations="['100% true, say they all do', '100% true, say they all do', '10% true, rarely reported & attested', 'NA, maybe but cannot be evaluated in an objective rational context', 'say 50% true not for all, depends on social status, food supply, etc...', '70% true, because say 30% lives in warmer latitudes - less relies']"
  displayAnswers="brier"
  :public="true"
  :showScore="true"
/>

---

## Brier quiz test

<Poll
  question="?"
  :answers="['1', '2', '3', '4', '5', '6']"
  :correctAnswer="{ 0: null, 1: 0.5, 2: 0.1, 3: 0.4, 4: 0.8, 5: 0.5 }"
  displayAnswers="brier"
  :public="true"
  :showScore="true"
/>
