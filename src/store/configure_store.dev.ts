import { createStore, applyMiddleware, compose } from "redux";
import DevTools from "../containers/dev_tools";
import * as Redux from "redux";

export default function configureStore(
    middlewares: Redux.Middleware[],
    rootReducer: Redux.Reducer<any>,
    initialState: any
): Redux.Store<any> {

    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middlewares),
            DevTools.instrument()
        )
    );

    return store;
}
