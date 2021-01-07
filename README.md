# Tryal.AI UI Library

![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/tryal-ai/tryal-ui?sort=semver&style=for-the-badge)
![GitHub](https://img.shields.io/github/license/tryal-ai/tryal-ui?style=for-the-badge)

Tryal.AI UI library, Tryal UI, is a Javascript User Interface Library build in Svelte.js and Pixi.js, that provides a way for maths workings to be written or drawn in real time.

## Getting Started


### Via CDN

Getting started depends on your build situation and how you want to integrate Tryal UI. The quickest and easiest way is to use the latest version deployed from our CDN. 

`https://cdn.tryal.ai/tryalui/tryalui-latest.min.js`

You should embed this after your DOM has finished loading. E.g. if you use React, Vue, Angular etc. you should make sure those have loaded first as this will skim the loaded DOM and inject Tryal UI elements where custom Tryal tags are found.

In your application you should have a div, with `id="tryalui` e.g.

```html
<div id="tryalui">
    <!-- This is your Tryal UI Window -->
</div>
```

This is your TryalUI window, in here Tryal UI will search for custom Tryal tags and replace them with components from our component library.

For example if you write

```html
<div id="tryalui">
    <Tryal-Workings></Tryal-Workings>
</div>
```

Tryal UI will replace this tag with a Tryal Workings Component (a text/mathematical field that auto expands to allow additional input).

For a full list of components available see reference.

### Via Library

Alternatively, if you want to package Tryal UI components as part of your javascript bundles that you serve to your users, you may wish to install this library as an NPM package.

You can do this by running

`npm i --save tryal-ai/tryal-ui`

You can then import the library and use their constructor to target specific HTML tags. e.g.

```js
import TryalUI from 'tryal-ui';

new TryalUI.Workings({
    target: document.getElementById("my-id"),
});

```

If you're conscious of reducing package size (at writing Tryal UI comes in ~700kb minified). You might use specific imports such as

```js
import { Workings } from 'tryal-ui';

new Workings({
    target: document.getElementById("my-id"),
});

```

Most bundlers will then only bundle the required packages and it may reduce your overall bundle size.

## Reference

Tryal UI provides 4 components as documented below

### `<Tryal-Graph>`

```html
<div id="tryalui">
    <Tryal-Graph></Tryal-Graph>
</div>
```

```js
import { Graph } from 'tryal-ui';

new Graph({
    target: document.getElementById("my-id"),
});

```

Tryal Graph is Tryal's graph drawing component. Tryal Graph allows students to draw graphs with their mouse by dragging, clicking and resizing, giving them estimates of various crossing points etc, to allow them to illustrate their workings clearly.

### `<Tryal-Line>`
```html
<div id="tryalui">
    <Tryal-Line></Tryal-Line>
</div>
```

```js
import { Line } from 'tryal-ui';

new Line({
    target: document.getElementById("my-id"),
});

```

Tryal Line is Tryal's singular working input field. This is different to `Tryal-Workings` because it doesn't add a new line every time a previous line has input. 

This is useful to create distinct answer boxes, that aren't misleading students to believe that they need to enter more information e.g.

```html
<div id="tryalui">
    <p>If a car is travelling at 2m/s for 15 seconds, how far does it travel</p>
    <h3>Workings:</h3>
    <Tryal-Workings></Tryal-Workings>
    <h3>Answer:</h3>
    <Tryal-Line></Tryal-Line>
</div>
```

In the scenario above we distinguish a space for students to input their workings (which will continue to grow as they add more workings), and single line for their answer.

### `Tryal-Session`
Tryal Session is not ready for development use yet. It will eventually allow you to use our API service to get a client side token which can be used to retrieve a question (or set of questions) from Tryal.

### `Tryal-Workings`
```html
<div id="tryalui">
    <Tryal-Workings></Tryal-Workings>
</div>
```

```js
import { Workings } from 'tryal-ui';

new Workings({
    target: document.getElementById("my-id"),
});

```

Tryal Workings is a multi-line version of `Tryal Line`. It essentially serves as a self expanding input field, that allows students to continue contributing workings until they are satisfied they've solved the question.

The design of Tryal Workings is designed to feed in to the overall replication philosophy of Tryal.AI as a whole. In GCSE maths you can (within reason) submit as much or as little workings as you want. Because no negative marking (usually) takes place in GCSE, students should be free to submit all they've done and be marked according.