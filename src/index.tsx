import { render as renderToDOM } from "react-dom";
import { useRouterHistory, createMemoryHistory } from "react-router";
import { LOCATION_CHANGE, syncHistoryWithStore, routerMiddleware } from "react-router-redux";
import { combineReducers } from "redux-immutable";
import { createSelector } from "reselect";
import * as Immutable from "immutable";
import getRoot from "./containers/root";
import configureStore from "./store/configure_store";
import interfaces from "./interfaces/interfaces";
import * as Redux from "redux";

const initialRouterReducerState = Immutable.fromJS({
    locationBeforeTransitions: null
});

const routerReducer = (state = initialRouterReducerState, action: any) => {
    if (action.type === LOCATION_CHANGE) {
        return state.merge({
            locationBeforeTransitions: action.payload
        });
    }
    return state;
};

const getRouting = (state: any) => state.get("routing");

function bootstrap(options: interfaces.BoostrapOptions): interfaces.BootstrapResult {

    // Validate options and set defaults
    if (options === undefined) { throw new TypeError("Null argument options."); };
    if (options.routes === undefined) { throw new TypeError("Invalid configuration field: routes."); };
    if (options.reducers === undefined) { throw new TypeError("Invalid configuration field: reducers."); };

    // mandatory
    let routes = options.routes;
    let reducers: any = options.reducers;

    // optional
    let container = options.container || "root";
    const createHistory = options.createHistory || createMemoryHistory;
    const historyOptions = options.historyOptions || {};
    let initialState = options.initialState || {};
    let immutableInitialState = Immutable.fromJS(initialState);
    let middlewares = options.middlewares || [];
    const render = options.render || renderToDOM;

    // Define the root reducer
    reducers.routing = routerReducer;
    let rootReducer = combineReducers(reducers);

    // Configure store
    const routerHistory = useRouterHistory(createHistory)(historyOptions);
    let routerMddlwr: Redux.Middleware = routerMiddleware(routerHistory);
    const store = configureStore([...middlewares, routerMddlwr], rootReducer, immutableInitialState);

    // Create an enhanced history that syncs navigation events with the store
    const history = syncHistoryWithStore(routerHistory, store, {
        selectLocationState: createSelector(getRouting, (routing: any) => routing.toJS())
    });

    // root component
    let root = getRoot(store, history, routes, options.routerProps);

    // Render Root coponent

    let renderArgs: any[] = [root];

    if (typeof document !== "undefined") {
        renderArgs.push(document.getElementById(container));
    }

    const output = render(...renderArgs);

    return {
        store,
        history,
        output,
        root
    };

}

export { bootstrap, interfaces };
