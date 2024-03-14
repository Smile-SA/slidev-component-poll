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

<Poll question="What are your favorite colors ?" :answers="['Red', 'Green', 'Blue']" displayResults="poll" :multiple="true" />

---

## Multiple quiz

<Poll question="What are your favorite colors ?" :answers="['Red', 'Green', 'Blue']" :correctAnswer="[0,2]" :multiple="true" />

---

## Editable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" displayResults="poll" :editable="true" />

---

## Controlled poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" displayResults="poll" />

---

## Controlled quiz

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" correctAnswer="0" />

---

## Controlled re-openable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" displayResults="poll" :reOpenable="true" />

---

## Controlled clearable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" :clearable="true" displayResults="poll" />

---

## Controlled clearable multiple poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" :multiple="true" :clearable="true" displayResults="poll" />
