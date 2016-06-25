import { createStore, applyMiddleware, compose } from "redux";
import DevTools from "../containers/dev_tools";

export default function configureStore(
    middlewares: Redux.Middleware[],
    rootReducer: Redux.Reducer,
    initialState: any
): Redux.Store {

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
