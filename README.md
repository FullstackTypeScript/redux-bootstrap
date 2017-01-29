![](https://raw.githubusercontent.com/redux-bootstrap/redux-bootstrap.github.io/master/img/profile.png)

# redux-bootstrap

[![Join the chat at https://gitter.im/redux-bootstrap/redux-bootstrap](https://badges.gitter.im/redux-bootstrap/redux-bootstrap.svg)](https://gitter.im/redux-bootstrap/redux-bootstrap?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/redux-bootstrap/redux-bootstrap.svg?branch=master)](https://travis-ci.org/redux-bootstrap/redux-bootstrap)
[![Test Coverage](https://codeclimate.com/github/redux-bootstrap/redux-bootstrap/badges/coverage.svg)](https://codeclimate.com/github/redux-bootstrap/redux-bootstrap/coverage)
[![NPM version](https://badge.fury.io/js/redux-bootstrap.svg)](https://badge.fury.io/js/redux-bootstrap)
[![Dependencies](https://david-dm.org/redux-bootstrap/redux-bootstrap.svg)](https://david-dm.org/redux-bootstrap/redux-bootstrap#info=dependencies)
[![img](https://david-dm.org/redux-bootstrap/redux-bootstrap/dev-status.svg)](https://david-dm.org/redux-bootstrap/redux-bootstrap/#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/redux-bootstrap/redux-bootstrap/badge.svg)](https://snyk.io/test/github/redux-bootstrap/redux-bootstrap)


[![NPM](https://nodei.co/npm/redux-bootstrap.png?downloads=true&downloadRank=true)](https://nodei.co/npm/redux-bootstrap/)
[![NPM](https://nodei.co/npm-dl/redux-bootstrap.png?months=9&height=3)](https://nodei.co/npm/redux-bootstrap/)

**A `bootstrap()` function for initializing [Redux](https://github.com/reactjs/redux) applications.**

This module works by exporting a `bootstrap` function you can call in your project. It does not generate files for you – it is **not a project template or project scaffolding tool**. It is not related to the [Bootstrap](http://getbootstrap.com/) responsive front-end framework.

## Why do I need this?
This library handles most of the common application initialization/bootstrapping that takes place every time you create a new Redux project.

When you create a new Redux project you usually need to take care of a few things:

- Install dependencies.
- Integrate [React Router](https://github.com/reactjs/react-router) with Redux.
- Create a Root reducer.
- Enable [DevTools](https://github.com/gaearon/redux-devtools) if environment is development, and disable if environment is production.
- Integrate [Immutable](https://facebook.github.io/immutable-js/) with Redux.
- Apply middleware.
- Combine reducers into a root reducer.
- Create the store.
- Sync history with store.
- Create the Root component (Provider, Router).
- Set the routes, history and store in the Root component.
- Render the Root component.

The redux-bootstrap package handles all this stuff for you! 

This idea is based on the `bootstrap` functions built into other modern JS frameworks such as
[Angular 2.0](https://angular.io/docs/ts/latest/api/platform/browser/bootstrap-function.html) and
[Aurelia](http://aurelia.io/docs.html#/aurelia/bootstrapper/1.0.0-beta.1.2.0/doc/api/overview).

## How can I use it?

Install it via NPM:

```
$ npm install --save redux-bootstrap
```
```
$ npm install --save-dev @types/history@2.0.45 @types/react @types/react-dom @types/react-redux @types/react-router @types/react-router-redux @types/redux-devtools @types/redux-devtools-dock-monitor @types/redux-devtools-log-monitor @types/redux-immutable
```

The preceding command will install `redux-bootstrap` and the following dependencies:

```json
"dependencies": {
    "history": "^3.2.1",
    "immutable": "^3.7.6",
    "react": "^15.0.2",
    "react-dom": "^15.1.0",
    "react-redux": "^4.4.4",
    "react-router": "^3.0.0",
    "react-router-redux": "^4.0.2",
    "redux": "^3.5.2",
    "redux-devtools": "^3.2.0",
    "redux-devtools-dock-monitor": "^1.1.1",
    "redux-devtools-log-monitor": "^1.1.1",
    "redux-immutable": "^3.0.6",
    "reselect": "^2.5.1"
}
```
 
Then use the `bootstrap` function in your application’s entry point.

> Note: The following example uses two pieces of Redux middleware: `redux-thunk` and `redux-logger`.These packages are optional but if you are going to use them you will need to install them first:
>
> ```ts
> $ npm install redux-thunk redux-logger --save
> ```

All you need to do is import your routes file, your reducers and any additional middleware 
and pass them to the `bootstrap` function as configuration:

```ts
import { bootstrap, interfaces } from "redux-bootstrap";
import routes from "./routes";
import usersReducer from "./reducers/usersReducer";
import reposReducer from "./reducers/reposReducer";
// Example middlewares:
import thunk from "redux-thunk";
import * as createLogger from "redux-logger";

bootstrap({
    container: "root",                    // optional
    createHistory: createBrowserHistory,  // optional
    historyOptions: {},                   // optional
    initialState: {},                     // optional
    middlewares: [thunk, createLogger()], // optional    
    render: ReactDOM.render,              // optional
    routerProps: interfaces.RouterProps   // optional
    reducers: {
        usersReducer,
        reposReducer,
    },
    routes: routes
});
```

That’s it – routing, Immutable, and DevTools are ready and you can start working on your app!

## Where can I find an example?
If you are looking for a sample application, you can refer to the [redux-bootstrap-example](https://github.com/redux-bootstrap/redux-bootstrap-example) repository.

## Using `combineReducers`
Redux Bootstrap uses [Immutable.js](https://facebook.github.io/immutable-js/). The `combineReducers` function from Redux doesn’t work with Immutable objects in the state, so you should use [`redux-immutable`](https://github.com/gajus/redux-immutable)’s `combineReducers` function to solve this problem:

```ts
import { combineReducers } from "redux-immutable";
```

## Accessing the Store, History & Root Component
Sometimes you need to access the store, synched history or root component.  The result object returned by the `bootstrap` function provides access to these.

```ts
interface BootstrapResult {
    store: Redux.Store,
    history: ReactRouterRedux.ReactRouterReduxHistory,
    output: any, // value returned by render()
    root: JSX.Element
}
```

For example, when enabling hot loader:

```ts
const result = bootstrap({/* ... */});

if (module.hot) {
    module.hot.accept("../reducers", () => {
        const nextRootReducer = require("../reducers/index").default;
        // If you use module.exports or Babel 5, remove .default:
        // const nextRootReducer = require("../reducers/index");
        result.store.replaceReducer(nextRootReducer);
    });
}
```

## TypeScript Support
The NPM package includes type definitions. TypeScript 2.0 or higher and
the following `tsconfig.json` configuration is required.

```
{
    "compilerOptions": {
        "lib": ["es6", "dom"],
        "types": ["node"],
        "jsx": "react"
    }
}
```

TypeScript is recommended if you want to enjoy the best development experience.
