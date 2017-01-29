import * as History from "history";
import * as Redux from "redux";
import * as ReactRouterRedux from "react-router-redux";

namespace interfaces {

    export interface ConfigureStore extends Function {
        (middlewares: Redux.Middleware[], rootReducer: Object, initialState: any): Redux.Store<any>;
    }

    export interface BoostrapOptions {
        routes: JSX.Element;
        reducers: ReducersOption;
        createHistory?: History.CreateHistory<History.History>;
        historyOptions?: History.HistoryOptions;
        middlewares?: Redux.Middleware[];
        render?: Function;
        initialState?: any;
        container?: string;
        routerProps?: RouterProps;
    }

    export interface BootstrapResult {
        store: Redux.Store<any>;
        history: ReactRouterRedux.ReactRouterReduxHistory;
        output: any;
        root: JSX.Element;
    }

    export interface ReducersOption {
        [index: string]: Redux.Reducer<any>;
    }

    export interface RootComponentProps {
        store: Redux.Store<any>;
        history: ReactRouterRedux.ReactRouterReduxHistory;
        routes: JSX.Element;
    }

    export interface RouterProps {
        onError?: (error: any) => any;
        onUpdate?: () => any;
    }

    export interface NodeModule {
        hot: {
            accept: (path: string, cb: () => void) => void;
        };
    }

    export interface DevToolsOptions {
        serialize: {
            immutable: any
        };
    }

    export interface Compose extends Function {
        <F extends Function>(f: F): F;
    }

    export interface DevTools extends Function {
        (options: DevToolsOptions): Compose;
    }

}

export default interfaces;
