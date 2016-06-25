/// <reference path="../redux/redux.d.ts" />
/// <reference path="../react/react.d.ts" />
/// <reference path="./redux-bootstrap.d.ts" />

import { bootstrap, interfaces } from "redux-bootstrap";

let routes: JSX.Element = null;

let options: interfaces.BoostrapOptions = {
    container: "root",
    initialState: {},
    middlewares: [],
    reducers: {
        reposReducer: (previousState: any, action: any) => { return null; },
        usersReducer: (previousState: any, action: any) => { return null; }
    },
    routes: routes
};

let result: interfaces.BootstrapResult = bootstrap(options);

console.log(result.store);
console.log(result.history);
console.log(result.root);
