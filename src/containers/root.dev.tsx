import * as React from "react";
import { Provider } from "react-redux";
import DevTools from "./dev_tools";
import { Router } from "react-router";

export default function getRoot(
  store: Redux.Store,
  history: ReactRouterRedux.ReactRouterReduxHistory,
  routes: JSX.Element
) {
    return (
      <Provider store={store}>
        <div>
          <Router history={history}>
            {routes}
          </Router>
          <DevTools />
        </div>
      </Provider>
   );
}
