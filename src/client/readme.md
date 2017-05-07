
# Client side app

Made with Preact as the view engine, hyperscript as the markup language, preact-router as the routing mechanism to load different views, and mobx + localforage for managing state + persistent storage.

This guide assumes no prior knowledge to anything other than basic HTML/CSS/Javascript.

## View engine

> A view engine is the one that works between your view and browser to provide valid HTML output to your browser by considering output provided by your view

Basically (and in this app specifically) it lets you render/modify HTML via javascript.

If you're worked with jquery, or even just basic javascript to manipulate the DOM (programmatic representation of the HTML), this is a framework that does exactly that but in a more sophisticated way such that you don't ever have to directly deal with DOM (at least in theory, which is what enables isomorphism (rendering on server)).

There have been many view engines developed in the past, some of the famous ones being (in semi-chronological order) Angular 1, ReactJS, VueJS, Aurelia, Angular 2, and to name a few of the big ones. Though not all of them are equally comparable, some of them offer more features that just being a view engine, such as Angular providing its own routing mechanism whereas others being really specific in the things they do and offering better speeds and responsiveness, and everything in between.

## Preact

Preact is a relatively new, but a supposed light weight alternative to the more popular ReactJS library by Facebook.

Checkout: https://preactjs.com/guide/getting-started for a quick tutorial, or feel free to study ReactJS in depth as well.

## Markup/templating language

Traditionally HTML has been the de facto markup language. But more recently its limitations has led to the view engines coming up with their own implementations that makes it easier to manipulate or have full control over the HTML and the DOM.

Angular 1 works by only modifying HTML in place, whereas React has an entire JSX syntax which, though looks like HTML but actually creates/renders HTML entirely via javascript.

There's also server-side templating languages (Jade/Pug/EJS) but this app only uses client-side javascript libraries to manage its view. It enables it to be a better single-page and offline web app, rather than a traditional HTML website.

## Hyperscript

https://github.com/hyperhype/hyperscript

This app uses Hyperscript as it's markup/templating language.

## Router

In a traditional website when the user points to an address URL it makes a request from the server to fetch the HTML/resource being served on that path by the server and displays it in the browser. So in this scenario the server manages the routing mechanism.

But in a web app that's rendered entirely by the client-side javascript view engine, all the views, or the pages, are already available (at least the basic shell or the different components of the app), so a client-side router needs to manage, by communicating with the view engine, which view to actually render when the user navigates to a specific location in the address bar.


## Preact-router

View engines and their routers are usually coupled together, so for Preact there's preact-router.

## **Routing in this App**

**This is probably one of the more important topics needed to understand the functionality of this app.**

The preact-router, or other routers in general, work as following:

```
import Router from 'preact-router'
import {createElement as h} from 'preact-hyperscript'
import Home from './views/home'
import About from './views/about'
...

h(Router, [
  h(Home, {path: '/'}),
  h(About, {path: '/about'}),
  ...
])
```

This requires modification of this router every time you add or edit a new view.

This app tries to offload the managing of routing information associated with the views by attaching that information to the view itself and then reading and configuring all of it automatically.

This is explained in a few steps, but the immediate next step to automatically managing all views would be to do something like this:

```
import * as views from './views'

h(Router, Object.entries(views).map(([, View])=>
  h(View, {path: View.path})
))
```

```
import * as views from './views'
```
This works by having an index in `./views/index.js` that looks like:
```
export Home from './Home';
export About from './About';
```
This can be auto-generated with [`create-index`](https://github.com/gajus/create-index) for which there should be a task command in the app `npm start createIndexClient` or `npm start cis` that runs `create-index` recursively and this pattern of indexing is used throughout the app.

```
h(Router, Object.entries(views).map(([, View])=>
```
[`Object.entries`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) (like [Object.keys](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)) returns the `* as views` object's exported entries and renders them as `Router`'s children.

```
  h(View, {path: View.path})
```
This require that a `.path` property be attached to the view itself rather than specifying it in the router code. You'll find that the views have exactly that:

**`views/Home/index.js`**:
```
import { Component } from 'preact';
...
class Home extends Component {

  static path = '/'

  render() {
...
```
So the route at which a specific view should be rendered is attached to the view itself.

So far so good, but this wouldn't work with **nested** view structure that this app uses. More details on it later in the view section.


## **Views, Template, and Components in this App**

### **Template**

(**not** templating *language*)

A basic layout consisting of a generic **Header**, **Menu**, and the **Footer** that are common across any **Contents** that will be rendered using this template component.

Resides in `./views/template`

### **Views**

To be continued...

Work in progress.









----

Older text:

This is the the app that renders on client side.

Well, the actual app code is in `./app/` and this (`./index.js`) just initializes it and renders it, as well as loads the third party css libraries like bulma or bootstrap and fontawesome, or fonts used in this app as well.

It uses Webpack to bundle everything. Webpack config is located in the root `../../webpack.config.babel.js`

With webpack you can require resources (like CSS) from the javascript code itself.

I've used Stylus as the main CSS preprocessor but regular CSS, or SASS may also be required.

The `index.html` is used as a template by html-webpack-plugin which injects all resources automatically.

To build, just run `npm start buildClient` which will output the bundled files in the same path from root but under `dist` dir: `../../dist/client`. This can be served statically with a server that redirects all unfound pages back to `index.html`. `./server` does exactly this. To build and run the client server run `npm start buildClientServer && npm start runClient` or `npm start buildRunClient` to both build and run. (more details on tasks in the readme in the root)



