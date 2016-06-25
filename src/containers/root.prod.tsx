import * as React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";

export default function getRoot(
  store: Redux.Store,
  history: ReactRouterRedux.ReactRouterReduxHistory,
  routes: JSX.Element
) {
    return (
      <Provider store={store}>
        <Router history={history}>
            {routes}
          </Router>
      </Provider>
    );
}
