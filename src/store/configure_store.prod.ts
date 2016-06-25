import { createStore, applyMiddleware } from "redux";

function configureStore(
  middlewares: Redux.Middleware[],
  rootReducer: Redux.Reducer,
  initialState: any
): Redux.Store {

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );

}

export default configureStore;
