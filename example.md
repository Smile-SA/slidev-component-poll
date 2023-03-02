---
theme: default
pollServer: ws://localhost:8080
---

# Example slides

---

## Simple poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" />

---

## Editable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :editable="true" />

---

## Mutiple poll

<Poll question="What are your favorite colors ?" :answers="['Red', 'Green', 'Blue']" :multiple="true" />

---

## Controlled poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" />

---

## Reopenable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" :reopenable="true" />

---

## Clearable poll

<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" :controlled="true" :clearable="true" />

---

## Simple poll (components)

<PollTitle question="What is your favorite color ?"/>
<PollQuestion id="1" :answers="['Red', 'Green', 'Blue']" />
<PollResults id="1" />

---

## Editable poll (components)

<PollTitle question="What is your favorite color ?"/>
<PollQuestion id="2" :answers="['Red', 'Green', 'Blue']" :editable="true" />
<PollResults id="2" />

---

## Mutiple poll (components)

<PollTitle question="What are your favorite colors ?"/>
<PollQuestion id="3" :answers="['Red', 'Green', 'Blue']" :multiple="true" />
<PollResults id="3" />

---

## Controlled poll (components)

<PollTitle question="What is your favorite color ?"/>
<PollQuestion id="4" :answers="['Red', 'Green', 'Blue']" :controlled="true" />
<PollResults id="4" />
<PollControl id="4" />

---

## Reopenable poll (components)

<PollTitle question="What is your favorite color ?"/>
<PollQuestion id="5" :answers="['Red', 'Green', 'Blue']" :controlled="true" />
<PollResults id="5" />
<PollControl id="5" :reopenable="true" />

---

## Clearable poll (components)

<PollTitle question="What is your favorite color ?"/>
<PollQuestion id="5" :answers="['Red', 'Green', 'Blue']" :controlled="true" />
<PollResults id="5" />
<PollControl id="5" :clearable="true" />

---

## Controllled poll from presenter mode (components)

<PollTitle question="What is your favorite color ?"/>
<PollQuestion id="6" :answers="['Red', 'Green', 'Blue']" :controlled="true" />
<PollResults id="6" />
<PollControl id="6" :presenterOnly="true" />
