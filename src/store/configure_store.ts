let configureStore: (middlewares: Redux.Middleware[], rootReducer: Object, initialState: any) => Redux.Store = null;
import configureStoreProd from "./configure_store.prod";
import configureStoreDev from "./configure_store.dev";

configureStore = (process.env.NODE_ENV === "production") ? configureStoreProd : configureStoreDev;

export default configureStore;
