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

or

`npm i --save tryal-ai/tryal-ui#beta` 

for our beta branch

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

- [`<Tryal-Line>`]() - A single line of input, similar to `<Tryal-Workings>` however it does not automatically add new lines

- [`<Tryal-Workings>`]() - A workings component that continually grows as the user types input. This is the default for most text and numeric input

- [`<Tryal-Text>`]() - A convenience component for rendering Tryal generated question strings, e.g. `"What is $x$ when $2x+3=7$"`

- [`<Tryal-List>`]() - A basic list component for rendering list markup in a Tryal question.

- [`<Tryal-Multichoice>`]() - A multichoice radio button component that allows a user to select a given answer

- [`<Tryal-Image>`]() - A rendering component for rendering base64 encoded strings that are supplied by Tryal.AI when you generate a question using our API


- [`<Tryal-Question>`]() - An advanced component for rendering a question including body and inputs in a single block

- [`<Tryal-Graph>`]() - Tryal's TryGraph rendering component used to allow students to draw answers to graphical questions

### `<Tryal-Line>`
```html
<!-- For CDN users -->
<div id="tryalui">
    <!-- Create a single working line with the numerical type -->
    <Tryal-Line data-type="numerical"></Tryal-Line>
    <!-- Create a single working line with the text type -->
    <Tryal-Line data-type="text"></Tryal-Line>
</div>
```

```js
// For library users
import { Line } from 'tryal-ui';

const input = new Line({
    target: document.getElementById("my-id"),
    props: {
        type: "numerical" // or "text"
    }
});

//On 1 being selected by the user
input.$on('update', (event) => {
    console.log(event.detail);
    // {
    //  valid: true, // Note this will be false if the workings are invalid syntax
    //  workings: ["2x+3=7"] 
    //}
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

In the scenario above we distinguish a space for students to input their workings (which will continue to grow as they add more workings), and single line for their answer. Tryal's Question API recommends the use of `<Tryal-Workings>` only, despite the ambiguity it might cause. In most cases, strong user on-boarding can resolve issues with the continually growing number of lines available.

### `Tryal-Workings`

```html
<!-- For CDN users -->
<div id="tryalui">
    <!--Create a Tryal Workings component-->
    <Tryal-Workings></Tryal-Workings>
    <!--Create a Tryal Workings that adds a new text rather than numeric line each time-->
    <Tryal-Workings data-text="true"></Tryal-Workings>
</div>
```

```js
// For library users
import { Workings } from 'tryal-ui';

const input = new Workings({
    target: document.getElementById("my-id"),
    props: {
        text: true //set true to add a new line of text rather a numeric line each time
    }
});

//On 1 being selected by the user
input.$on('update', (event) => {
    console.log(event.detail);
    // {
    //  valid: true, // Note this will be false if the workings are invalid syntax
    //  workings: ["2x+3=7", "2x=4", "x=2"] 
    //}
});

```

Tryal Workings is a multi-line version of `Tryal Line`. It essentially serves as a self expanding input field, that allows students to continue contributing workings until they are satisfied they've solved the question.

The design of Tryal Workings is designed to feed in to the overall replication philosophy of Tryal.AI as a whole. In GCSE maths you can (within reason) submit as much or as little workings as you want. Because no negative marking (usually) takes place in GCSE, students should be free to submit all they've done and be marked according.

### `<Tryal-Text>`

```html
<!-- For CDN users -->
<div id="tryalui">
    <Tryal-Text data-body="Solve $2x + 5 = 11$"></Tryal-Text>
</div>
```

```js
// For library users
import { Text } from 'tryal-ui';

new Text({
    target: document.getElementById("my-id"),
    props: {
        body: "Solve $2x + 5 = 11$"
    }
});

```

`<Tryal-Text>` Allows you to render question strings (including algebraic expressions) in browser. This convenience component acts as a polyfill across most browsers in use today. Older versions of IE as well as some flavours of mobile Opera are still incompatible.

### `<Tryal-List>`

```html
<!-- For CDN users -->
<div id="tryalui">
    <!-- Note the correctly formatted JSON, including the double quotes -->
    <Tryal-List data-values='["1", "2", "3"]'></Tryal-List>
</div>
```

```js
// For library users
import { List } from 'tryal-ui';

new List({
    target: document.getElementById("my-id"),
    props: {
        values: ['1', '2', '3']
    }
});

```

`<Tryal-List>` is a convenience component provided for completeness with the markup used with Tryal's Question API. In some cases, questions return lists such as `"Put this four in order of size"`. Tryal UI's list component essentially takes a set of values, centres them and reasonable spaces them. It blends with `<Tryal-Text>` so that even if the multiple choice options include an expression formatting instruction (such as `$\dfrac{1}{2}$` to render a fraction) it will still render correctly.

### `<Tryal-Multichoice>`

<!-- For CDN users -->
<div id="tryalui">
    <!-- Note the correctly formatted JSON, including the double quotes -->
    <Tryal-Multichoice data-values='["1", "2", "3"]'></Tryal-Multichoice>
</div>
```

```js
// For library users
import { Multichoice } from 'tryal-ui';

const input = new Multichoice({
    target: document.getElementById("my-id"),
    props: {
        values: ['1', '2', '3']
    }
});

//On 1 being selected by the user
input.$on('update', (event) => {
    console.log(event.detail);
    // {
    //  valid: true,
    //  workings: ["1"]
    //}
});

```

`<Tryal-Multichoice>` is a convenience radio button selector that allows multiple choice questions to be rendered. It blends with `<Tryal-Text>` so that even if the multiple choice options include an expression formatting instruction (such as `$\dfrac{1}{2}$` to render a fraction) it will still render correctly.

### `<Tryal-Image>`

<!-- For CDN users -->
<div id="tryalui">
    <Tryal-Image data-data='iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAC2UlEQVRIS41WO28TQRCeOTuRz06cYAeEgnkkEg0FBRIFQoljx3F4v/ITEjqEEAWkQCBRgISQqCjhFyDjOCAQD5tQUVNRUCROHPEQRDahAIpDs4+53TvbcJJ1d3uz33z77TezRvjHlZrKeo4TBwQX6A4QE3fEGKw/uYPdpnf8ODi530N0wUEX6I4C0HyX4/R9deFqW5zQYHIiI5gCSobE9NuLWojgjpPzgZW4sPJ4zsKzXvqzac9kCMTMkQy/Pn/KCYZPXAJ0XGhUbsOuM3eFRBRDl5mAwRPjCU8AKW03Xn8QweliXmlsa76+eI+T7T57XyVA8DyPEzB4X7ZPaEy/ZnWFJw5NTyptpeb6R0TWKrc4bs+5B/ys2QvwxHjEA8HYhVbtCweli4cBlTukROQafy/ofXXhWigBIsJyaRYFeHwsIjbxx5sWB6YKBwyXxMBBxVztAbsI41AvXxbzguwxPgYeYpS1btY+wZbCPsFQbG4n5uQmlZBWDNALxJg015cAB4jCz7d/IJnbbmlqaRxiLgsJ9Tj2CMzl0iyvQDHvgc2l3+LjQH7E1lZpzZXJK1GVypUbFcB0jcw8FCsIgQ/mR5XWugLDLjFXJKWjWB9ca6/Ae2Fz6ZdiPtqGue9/v7fYvgeIMPO24MncsKxIYqKaUzeXyJ6j4jHSSXPaGKlhs9oQQanCQdk7gv4OuUSuYLl03t9I5RpVRDGuzlZNgsvSz3b1t+iKDjWsi6FCoiq1wHUXbFY/GuV/NLAHtkvq5Sscq11CAwxOL/0TKWZPjDZevedJ247McHf0ewuV/o0QYw1Md6NxpdSJo3oHuvD95TvYOn1MMP/87BEDZU7NA/WitYoEN8u+LTgNJnMZZm+6xOzlOsPO0zetLqnH2/Zz/XEgt1edRIEuqNzkd0Xlc+Ge8EFhycJrVg+pqUPWHphdUNtW618vX/i/MzSYZKh43DpTzX8BjcXrXU//v5Ljw2UYSwdjAAAAAElFTkSuQmCC'></Tryal-Image>
</div>
```

```js
// For library users
import { Image } from 'tryal-ui';

new Image({
    target: document.getElementById("my-id"),
    props: {
        data: "See base64 string above"
    }
});

```

`<Tryal-Image>` is a convenience component designed to provide completeness with respect to the markup used in Tryal generated questions. Tryal generated questions can include embedded graphics such as graphs that come in a base64 format. In time we plan to transition to a CDN driven format. This component will keep pace with the deployment and transfer to CDN.

### `<Tryal-Question>` - Library Only


```js
// For library users
import { Question } from 'tryal-ui';

const input = new Question({
    target: document.getElementById("my-id"),
    props: {
        body: [
            "(a) Solve $2x + 3 = 5$",
            {
                type: "numeric",
                part: "a"
            },
            "(b) Which is the odd one out",
            {
                type: "multichoice",
                part: "b",
                values: ["2", "3", "5", "9"]
            }
        ]
    }
});

input.$on('update', (event) => {
    console.log(event.details);
    // {
    //      valid: true,
    //      workings: {
    //          a: ["2x=2", "x=1"]
    //          b: ["9"]
    //      }
    //}
})
```

`<Tryal-Question>` Is a complete all-in-one rendering solution for Tryal generated questions. It can take questions generated by the Tryal Question API, automatically render them, then fires events as students provide input. 

Tryal Question does not submit results, meaning that you still have to attach to the event, track as the input changes and then submit it when students indicate they're ready to submit (This UI element does not contain a submit button meaning you have to implement one).

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
