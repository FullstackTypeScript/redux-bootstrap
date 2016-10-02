import { createStore, applyMiddleware } from "redux";
import * as Redux from "redux";

function configureStore(
  middlewares: Redux.Middleware[],
  rootReducer: Redux.Reducer<any>,
  initialState: any
): Redux.Store<any> {

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );

}

export default configureStore;
