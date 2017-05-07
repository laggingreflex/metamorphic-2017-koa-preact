# Usage

This repo contains both server and the client code.

* Server: Serves JSON API and handles web-sockets.
* Client: Front-end app built with Preact framework and uses Webpack bundler. It may be served statically, like via nginx, or there's also a light http server built for it specifically.

## Files and directory structure:

```
├─index.js     // CLI to run/configure the project
├─config.js    // Config like server IP, host address.
├─tasks        // Start runner tasks
├─dist         // compiled code
├─src          // source code
│ ├─server
│ │ ├─routes   // API Routes
│ │ ├─socket   // Socket routes
│ │ └─utils
│ └─client
│   ├─app      // client js app
│   │ ├─components
│   │ └─views
│   ├─assets   // fonts, icons
│   └─server   // client SSR server
├─tests
├─coverage
└─.meta        // resources, todos
```

## Task scripts

Uses Start task runner for the following tasks:

(see [`tasks.js`](../tasks/tasks.js) file for more details)

Tasks are run under npm script '`start`':
```
npm start buildServer # or bs
```
(most tasks have short aliases like that)

Note: Make sure you've run `npm install` before running any commands.

### `buildServer`

Compiles the server related code ([`src/server`](../src/server)) for 'production' environment and outputs the result in `dist/server` (after performing a cleanup there).

Uses Babel to transpile ES2017 code to ES5.

### `buildServerDev`

Runs [`buildServer`](#buildServer) with 'development' environment and in `watch` mode, i.e. re-builds on file modification.

### `buildClient`

Uses Webpack to

* bundle all javascript into one/several entrypoint(s) (like "index.js", "app.js"),

* all styles into a single css file

* copy all other assets (fonts, images) as is

* generates a single endpoint "index.html" (based on the template of the same name) referencing all necessary bundles

outputs in `dist/client` dir which can be used as a static file server using NGINX or the accompanied [server](../src/client/server).

### `buildClientDev`

Runs Webpack Dev Server for client in `watch` mode, and 'development' environment, with Hot Module Replacement enabled.

### `build`

Runs [`buildServer`](#buildServer) and [`buildClient`](#buildClient) concurrently.

### `buildDev`

Runs [`buildServerDev`](#buildServerDev) and [`buildClientDev`](#buildClientDev) concurrently.

### `test`

Runs tests and generates coverage reports.

### `testDev`

Runs tests in `watch` mode.

### `dev`

Runs [`buildDev`](#buildDev) and [`testDev`](#testDev) concurrently.

### **`runServer`**

**\* This is the main command to start the server. \***

Executes `dist/server/run.js`

Note: Make sure you've run the [`buildServer`](#buildServer) task before running this.

### `buildRunServer`

(for the lazy) Runs [`buildServer`](#buildServer) and then [`runServer`](#runServer).

### `runClient`

Executes `dist/client/server/run.js`

Hosts the `dist/client/*` files and maps all other routes to `index.html` (same as `historyFallbackApi: true` in WebpackDevServer)

Note: Make sure you've run the [`buildClient`](#buildClient) task before running this.

Note: In production you should probably be using a CDN enabled service to host the client-side app files instead. For local development you should probably use [`buildClientDev`](#buildClientDev).

