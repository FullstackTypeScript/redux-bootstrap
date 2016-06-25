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

    export interface ReducersOption {
        [index: string]: Redux.Reducer;
    }

    export interface RootComponentProps {
        store: Redux.Store;
        history: ReactRouterRedux.ReactRouterReduxHistory;
        routes: JSX.Element;
    }

    export interface NodeModule {
        hot: {
            accept: (path: string, cb: () => void) => void;
        };
    }

}

export default interfaces;
