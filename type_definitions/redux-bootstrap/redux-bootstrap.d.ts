// Type definitions for react-bootstrap v1.0.0
// Project: https://github.com/remojansen/redux-bootstrap
// Definitions by: Remo H. Jansen <https://github.com/remojansen>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="../redux/redux.d.ts" />
/// <reference path="../react/react.d.ts" />

declare module "redux-bootstrap" {

    namespace interfaces {

        export interface BoostrapOptions {
            routes: JSX.Element;
            reducers: ReducersOption;
            createHistory?: HistoryModule.CreateHistory<HistoryModule.History>;
            historyOptions?: HistoryModule.HistoryOptions;
            middlewares?: Redux.Middleware[];
            render?: Function;
            initialState?: any;
            container?: string;
        }

        export interface BootstrapResult {
            store: Redux.Store;
            history: ReactRouterRedux.ReactRouterReduxHistory;
            output: any;
            root: JSX.Element;
        }

        interface ReducersOption {
            [index: string]: Redux.Reducer;
        }

    }

    export function bootstrap(options: interfaces.BoostrapOptions): interfaces.BootstrapResult;
}
