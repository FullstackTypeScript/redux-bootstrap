import * as React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import * as Redux from "redux";
import * as ReactRouterRedux from "react-router-redux";

export default function getRoot(
  store: Redux.Store<any>,
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
