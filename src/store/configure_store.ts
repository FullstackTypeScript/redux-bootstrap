import interfaces from "../interfaces/interfaces";

let configureStore: interfaces.ConfigureStore = null;
import configureStoreProd from "./configure_store.prod";
import configureStoreDev from "./configure_store.dev";

configureStore = (process.env.NODE_ENV === "production") ? configureStoreProd : configureStoreDev;

export default configureStore;
