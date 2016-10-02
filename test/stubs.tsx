import * as React from "react";
import { IndexRoute, Route, Link } from "react-router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Immutable from "immutable";
import { interfaces } from "../src/index";
import * as Redux from "redux";

// ******************************************************************************
// * UTILS
// ******************************************************************************
function makeActionCreator(type: string, ...argNames: string[]) {
  return function(...args: any[]) {
    let action: any = { type : type };
    argNames.forEach((arg, index) => {
        let argName: string = argNames[index];
        let argValue: any = args[index];
        action[argName] = argValue;
    });
    return action;
  };
}

// ******************************************************************************
// * LAYOUT
// ******************************************************************************
class AppLayout extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <div>
                    <Link id="link_to_home" className="link_to" to="/">Home</Link>
                    <Link id="link_to_users" className="link_to" to="/users">Users</Link>
                    <Link id="link_to_repos" className="link_to" to="/repos">Repos</Link>
                </div>
                {this.props.children}
            </div>
        );
    }
}

// ******************************************************************************
// * HOME
// ******************************************************************************
class Home extends React.Component<any, any> {
    public render() {
        return (
            <div id="home_page_title">Home Page!</div>
        );
    }
}

// ******************************************************************************
// * CONSTANTS
// ******************************************************************************
export const ACTION_TYPES = {
    ADD_REPO_BEGIN: "ADD_REPO_BEGIN",
    ADD_REPO_SUCCESS: "ADD_REPO_SUCCESS",
    ADD_USER_BEGIN: "ADD_USER_BEGIN",
    ADD_USER_SUCCESS: "ADD_USER_SUCCESS",
    BUMP_COUNTER: "BUMP_COUNTER"
};

// ******************************************************************************
// * USER PAGE ACTIONS
// ******************************************************************************
let addUserBegin = makeActionCreator(ACTION_TYPES.ADD_USER_BEGIN);
let addUserSuccess = makeActionCreator(ACTION_TYPES.ADD_USER_SUCCESS);
let addUserAsync =  () => {
    return (dispatch: Redux.Dispatch<any>) => {
        dispatch(addUserBegin());
        // fake delay
        setTimeout(() => { dispatch(addUserSuccess()); }, 20);
    };
};

let userActions: any = { addUserAsync, addUserBegin, addUserSuccess };

// ******************************************************************************
// * USER PAGE COMPONENT
// ******************************************************************************
function mapStateToPropsUserPage(state: any) {
    return { users: state.get("users") };
}

function mapDispatchToPropsUserPage(dispatch: Redux.Dispatch<any>) {
    return { actions : bindActionCreators(userActions, dispatch) };
}

@connect(mapStateToPropsUserPage, mapDispatchToPropsUserPage)
class UsersPage extends React.Component<any, any> {
    public render() {
        let label = "Loading...";
        if (this.props.users !== undefined && this.props.users.get("loading") === false) {
            label = this.props.users.get("usersCount");
        }
        return (
            <div>
                <div id="users_page_title">Users Page!</div>
                <div>
                    <p>User count: <span id="user_count">{label}</span></p>
                    <button id="add_user_btn" onClick={() => { this.props.actions.addUserAsync(); }}>Add User</button>
                </div>
            </div>
        );
    }
}

// ******************************************************************************
// * REPOS PAGE ACTIONS
// ******************************************************************************
let addRepoBegin = makeActionCreator(ACTION_TYPES.ADD_REPO_BEGIN);
let addRepoSuccess = makeActionCreator(ACTION_TYPES.ADD_REPO_SUCCESS);
let addRepoAsync =  () => {
    return (dispatch: Redux.Dispatch<any>) => {
        dispatch(addRepoBegin());
        // fake delay
        setTimeout(() => { dispatch(addRepoSuccess()); }, 20);
    };
};

let repoActions: any = { addRepoAsync, addRepoBegin, addRepoSuccess };

// ******************************************************************************
// * REPOS PAGE COMPONENT
// ******************************************************************************
function mapStateToPropsReposPage(state: any) {
    return { repos: state.get("repos") };
}

function mapDispatchToPropsReposPage(dispatch: Redux.Dispatch<any>) {
    return { actions : bindActionCreators(repoActions, dispatch) };
}

@connect(mapStateToPropsReposPage, mapDispatchToPropsReposPage)
class ReposPage extends React.Component<any, any> {
    public render() {
        let label = "Loading...";
        if (this.props.repos !== undefined && this.props.repos.get("loading") === false) {
            label = this.props.repos.get("reposCount");
        }
        return (
            <div>
                <div id="repos_page_title">Repos Page!</div>
                <div>
                    <p>Repo count: <span id="repo_count">{label}</span></p>
                    <button id="add_repo_btn" onClick={() => { this.props.actions.addRepoAsync(); }}>Add Repo</button>
                </div>
            </div>
        );
    }
}

// ******************************************************************************
// * ROUTES
// ******************************************************************************
function getRoutes() {
    return (
        <Route path="/" component={AppLayout}>
            <IndexRoute component={Home} />
            <Route path="/users" component={UsersPage} />
            <Route path="/repos" component={ReposPage} />
        </Route>
    );
}

// ******************************************************************************
// * REDUCERS
// ******************************************************************************
function getReducers(): interfaces.ReducersOption {

    const counterReducer: Redux.Reducer<any> = (previousState: any = 0, action: any) => {
        switch (action.type) {
            case ACTION_TYPES.BUMP_COUNTER:
                return previousState + 1;
            default:
                return previousState;
        }
    };

    const defaultUsersState = Immutable.fromJS({
        loading: false,
        usersCount: 0
    });

    const usersReducer: Redux.Reducer<any> = (previousState: any = defaultUsersState, action: any) => {
        switch (action.type) {
            case ACTION_TYPES.ADD_USER_BEGIN:
                return previousState.set("loading", true);
            case ACTION_TYPES.ADD_USER_SUCCESS:
                return previousState.merge({
                    loading: false,
                    usersCount: (previousState.get("usersCount") + 1)
                });
            default:
                return previousState;
        }
    };

    const defaultReposState = Immutable.fromJS({
        loading: false,
        reposCount: 0
    });

    const reposReducer: Redux.Reducer<any> = (previousState: any = defaultReposState, action: any) => {
        switch (action.type) {
            case ACTION_TYPES.ADD_REPO_BEGIN:
                return previousState.set("loading", true);
            case ACTION_TYPES.ADD_REPO_SUCCESS:
                return previousState.merge({
                    loading: false,
                    reposCount: (previousState.get("reposCount") + 1)
                });
            default:
                return previousState;
        }
    };

    let reducers: interfaces.ReducersOption = {
        repos: reposReducer,
        users: usersReducer
    };

    return reducers;
}

export { getRoutes, getReducers };
