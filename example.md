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

## Poll with HTML answers

<Poll question="What is your favorite color ?">

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

## Simple poll (components)

<PollProvider>
  <PollTitle question="What is your favorite color ?"/>
  <PollQuestion :answers="['Red', 'Green', 'Blue']" />
  <PollResults/>
</PollProvider>

---

## Editable poll (components)

<PollProvider>
  <PollTitle question="What is your favorite color ?"/>
  <PollQuestion :answers="['Red', 'Green', 'Blue']" :editable="true" />
  <PollResults/>
</PollProvider>

---

## Mutiple poll (components)

<PollProvider>
  <PollTitle question="What are your favorite colors ?"/>
  <PollQuestion :answers="['Red', 'Green', 'Blue']" :multiple="true" />
  <PollResults/>
</PollProvider>

---

## Controlled poll (components)

<PollProvider>
  <PollTitle question="What is your favorite color ?"/>
  <PollQuestion :answers="['Red', 'Green', 'Blue']" :controlled="true" />
  <PollResults/>
  <PollControl/>
</PollProvider>

---

## Reopenable poll (components)

<PollProvider>
  <PollTitle question="What is your favorite color ?"/>
  <PollQuestion :answers="['Red', 'Green', 'Blue']" :controlled="true" />
  <PollResults/>
  <PollControl :reopenable="true" />
</PollProvider>

---

## Clearable poll (components)

<PollProvider>
  <PollTitle question="What is your favorite color ?"/>
  <PollQuestion :answers="['Red', 'Green', 'Blue']" :controlled="true" />
  <PollResults/>
  <PollControl :clearable="true" />
</PollProvider>

---

## Controllled poll from presenter mode (components)

<PollProvider>
  <PollTitle question="What is your favorite color ?"/>
  <PollQuestion :answers="['Red', 'Green', 'Blue']" :controlled="true" />
  <PollResults/>
  <PollControl :presenterOnly="true" />
</PollProvider>

---

## Poll with HTML answers (components)

<PollProvider>
  <PollTitle question="What is your favorite color ?"/>
  <PollQuestion>

```js
() => 'Red';
```

```js
() => 'Green';
```

```js
() => 'Blue';
```

  </PollQuestion>
  <PollResults/>
</PollProvider>
