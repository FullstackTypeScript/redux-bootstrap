import { createStore, applyMiddleware, compose } from "redux";
import * as Redux from "redux";
import interfaces from "../interfaces/interfaces";

function configureStore(
    middlewares: Redux.Middleware[],
    enhancers: Redux.StoreEnhancer<any>[],
    rootReducer: Redux.Reducer<any>,
    initialState: any,
    devToolsOptions: interfaces.DevToolsOptions
): Redux.Store<any> {

    let devTools: interfaces.DevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    const composeEnhancers = devTools ? devTools(devToolsOptions) : compose;

    return createStore(
        rootReducer,
        initialState,
        composeEnhancers(
            ...enhancers,
            applyMiddleware(...middlewares)
        )
    );
}

export default configureStore;
