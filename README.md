# slidev-component-poll

[![NPM version](https://img.shields.io/npm/v/slidev-component-poll?color=3AB9D4&label=)](https://www.npmjs.com/package/slidev-component-poll)

Poll component for `Slidev`.

![Question](./assets/question.png)

![Results](./assets/results.png)

## Installation

```bash
npm i slidev-component-poll
```

## Configuration

Define this package into your slidev addons.

In your slides metadata (using frontmatter):
```
---
addons:
  - slidev-component-poll
---
```

Or in your `package.json`:
```json
{
  "slidev": {
    "addons": [
      "slidev-component-poll"
    ]
  }
}
```

### Using serverRef

`slidev-component-poll` can use built-in slidev capabilities to allow communication with multiple clients.

By using serverRef, the communication with multiple clients is **only possible in dev mode**!

This won't work if you build and deploy to a static host.

To use serverRef you will need to define the default value in your own project.

For that you need to create a `vite.config.ts` file with (see [here](https://sli.dev/custom/config-vite.html) for more information):
```js
import { defineConfig } from 'vite';

export default defineConfig({
  slidev: {
    serverRef: {
      state: {
        poll: {}
      }
    }
  }
});
```

### Using a server

You can use a Server Sent Events server or a WebSocket server to allow communication with multiple clients.

Take at look at this custom implementation: https://github.com/Smile-SA/slidev-poll-server

In that case you only need to use the `pollServer` config in your markdown file frontmatter (Update the value of `pollServer` using your own installation).

For HTTP Server Sent Events server:
```yaml
---
pollServer: http://localhost:8080
---
```

Or for WebSocket server:
```yaml
---
pollServer: ws://localhost:8080
---
```

Then, in the presentation, click on the connect icon.

![Connect control icon](./assets/control-icon.png)

Type in a hash that you can share with other peoples and press <key>enter</key>. (you can use the proposed hash: everybody that are on the same presentation will have the same)

![Connect control hash](./assets/control-hash.png)

You are connected!

![Connected](./assets/connected.png)

## Components

You can create a poll by using the [`Poll` component](#poll).

But if this component does not suit your needs, you can use individual [sub-components](#sub-components).

### Poll

All in one component for poll:
```html
<Poll question="What is your favorite color ?" :answers="['Red', 'Green', 'Blue']" />
```

Or with markdown answers:
```html
<Poll question="What is your favorite color ?">

**Red**

**Green**

**Blue**

</Poll>
```

Parameters:

* `question` (`string`, required): The question displayed as title.
* `answers` (`string[]`): The available answers to the question (can also be provided using the default slot).
* `editable` (`boolean`, default: `false`): Can someone's answer be edited by this same person ?
* `multiple` (`boolean`, default: `false`): Can someone select multiple answers (displays checkbox instead of radio buttons).
* `controlled` (`boolean`, default: `false`): If `true` the poll will not be opened at the start, use controls to open and close the poll ([see below for more information](#controlled-forms)).
* `reopenable` (`boolean`, default: `false`): Can the poll be reopened after being closed ? (old results are kept).
* `clearable` (`boolean`, default: `false`): Can the poll be cleared after being closed ? (results will be cleared and poll can be reopened again).
* `id` (`'string'`): Unique identifier for poll (if not provided, the system will generate an id based on the page number).
* `results` (`'free' | 'auto' | 'none'`, default `'auto'`):
  * `'free'`: User can see results before submitting
  * `'auto'`: Results are only shown after user submission
  * `'none'`: Results are only accessible for user that have access to controls

## Sub-components

### PollProvider

Sub-component used by the [`Poll` component](#poll).

The `PollProvider` component is required.

It is used to group other sub-components together.
```html
<PollProvider>
  [Other Poll components here]
</PollProvider>
```

Parameters:

* `id` (`'string'`): Unique identifier for poll (if not provided, the system will generate an id based on the page number).

### PollQuestion

Sub-component used by the [`Poll` component](#poll).

The `PollQuestion` component is required.

This component displays the form with the choices of the answers:
```html
<PollQuestion :answers="['Red', 'Green', 'Blue']" />
```

Or with markdown answers:
```html
<PollQuestion>

**Red**

**Green**

**Blue**

</PollQuestion>
```

Parameters:
* `answers` (`string[]`): The available answers to the question (can also be provided using the default slot).
* `editable` (`boolean`, default: `false`): Can someone's answer be edited by this same person ?
* `multiple` (`boolean`, default: `false`): Can someone select multiple answers (displays checkbox instead of radio buttons).
* `controlled` (`boolean`, default: `false`): If `true` the poll will not be opened at the start, use controls to open and close the poll ([see below for more information](#controlled-forms)).

### PollResults

Sub-component used by the [`Poll` component](#poll).

This component displays the results of the poll:
```html
<PollResults/>
```

### PollTitle

Sub-component used by the [`Poll` component](#poll).

This component displays the question of the poll:
```html
<PollTitle question="What is your favorite color ?" />
```

Parameters:
* `question` (`string`, required): Question text associated to the poll.

### PollControl

Sub-component used by the [`Poll` component](#poll).

This component displays the controls of the poll (should be used with `controlled=true` on the `PollQuestion` component):
```html
<PollControl question="What is your favorite color ?" />
```

Parameters:
* `reopenable` (`boolean`, default: `false`): Can the poll be reopened after being closed ? (old results are kept)
* `clearable` (`boolean`, default: `false`): Can the poll be cleared after being closed ? (results will be cleared and poll can be reopened again)
* `presenterOnly` (`boolean`, default: `false`): Only display the component on the presenter page.

### Usage

When using sub-components you have to group them using the `PollProvider` component.

Example:
```html
<PollProvider>
  <PollTitle question="What is your favorite color ?"/>
  <PollQuestion :answers="['Red', 'Green', 'Blue']" />
  <PollResults />
</Provider>
```

[See examples](./example.md).

## Controlled forms

When using `controlled=true` the poll can be controlled meaning that its state can be changed.

The poll can have three state:
* `CLEARED`: Starting state, no results recorded and no result can be recorded, waiting to be opened.
* `OPEN`: Poll is open, and results can be received.
* `CLOSED`: Poll is closed, and results can not be received anymore.

If you run the slidev server with remote access (and you should if you want other people to answer your poll), then you can control the state of the poll from the presenter view.

When remote control is enabled, the presenter button is not shown, so people does not have direct access to the presenter view.

But anyone who tap the presenter view URL in its browser can access the presenter view, and then control the state of your poll.

If you want to prevent that, you can start the server with `--remote=[your_password]` and in that case the presenter view is a little more secured.

When using a password, the controls will also be displayed on the presentation but only if the password query parameter in the URL is correct.

We can sum up the following cases:

* presentation view without password (or wrong password): controls are not shown
* presentation view with correct password (if any is set): controls are shown
* presenter view: controls are shown
