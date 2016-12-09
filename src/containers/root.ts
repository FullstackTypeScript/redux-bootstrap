import RootProd from "./root.prod";
import RootDev from "./root.dev";

let getRoot = (process.env.NODE_ENV === "production") ? RootProd : RootDev;

export default getRoot;
