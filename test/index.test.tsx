import { createHashHistory, createMemoryHistory } from "history";
import { unmountComponentAtNode } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import thunk from "redux-thunk";
import { push } from "react-router-redux";
import * as $ from "jquery";
import { expect } from "chai";
import { bootstrap, interfaces } from "../src/index";
import { ACTION_TYPES, getRoutes, getReducers } from "./stubs";
import * as Redux from "redux";
import * as ReactRouterRedux from "react-router-redux";

const CONTAINER_ID = "root";

history.pushState({}, "", "/");
$("body").append(`<div id="${CONTAINER_ID}"/><div>`);

describe("redux-bootstrap", () => {

    it("Should throw if the wrong configuration is used.", () => {

        let b: any = bootstrap;

        let throw1 = () => { b(); };

        let throw2 = () => {
            b({
                routes: getRoutes()
            });
        };

        let throw3 = () => {
            b({
                reducers: getReducers()
            });
        };

        expect(throw1).to.throw("Null argument options.");
        expect(throw2).to.throw("Invalid configuration field: reducers.");
        expect(throw3).to.throw("Invalid configuration field: routes.");

    });

    describe("Should be able to bootstrap applications.", () => {

        before(() => {
            bootstrap({
                container: "root",
                initialState: {},
                middlewares: [thunk],
                reducers: getReducers(),
                routes: getRoutes()
            });

        });

        after(() => {
            // https://facebook.github.io/react/docs/top-level-api.html#reactdom.unmountcomponentatnode
            const rootNode = document.getElementById(CONTAINER_ID);
            unmountComponentAtNode(rootNode);
            rootNode.innerHTML = "";
        });


        it("Should be able to render the home page.", (done) => {
            setTimeout(() => {
                expect($("#home_page_title").text()).eql("Home Page!");
                done();
            }, 20);
        });

        it("Should be able to navigate to a page.", (done) => {
            let usersLink = document.getElementById("link_to_users");
            usersLink.click();
            setTimeout(() => {
                expect($("#users_page_title").text()).eql("Users Page!");
                done();
            }, 30);
        });

        it("Should be able to navigate to another to a page.", (done) => {
            let reposLink = document.getElementById("link_to_repos");
            reposLink.click();
            setTimeout(() => {
                expect($("#repos_page_title").text()).eql("Repos Page!");
                done();
            }, 30);
        });

        it("Should be able to return to the home page.", (done) => {
            let homeLink = document.getElementById("link_to_home");
            homeLink.click();
            setTimeout(() => {
                expect($("#home_page_title").text()).eql("Home Page!");
                done();
            }, 50);
        });

        it("Should be able to interact.", (done) => {

            // go to user page
            let usersLink = document.getElementById("link_to_users");
            usersLink.click();

            setTimeout(() => {

                // check counter and page title
                expect($("#users_page_title").text()).eql("Users Page!");
                expect($("#user_count").text()).eql("0");

                // trigger increase counter
                let addUserBtn = document.getElementById("add_user_btn");
                addUserBtn.click();

                // update counter
                setTimeout(() => {
                    expect($("#user_count").text()).eql("1");
                    done();
                }, 30);

            }, 30);

        });

    });

    describe("Should be able to bootstrap again.", () => {

        let result: interfaces.BootstrapResult;
        before(() => {
            result = bootstrap({
                container: "root",
                initialState: {},
                middlewares: [thunk],
                reducers: getReducers(),
                routes: getRoutes()
            });
        });


        it("Should expose history, root, store in result.", () => {
            expect(result).to.be.ok;
            expect(result).to.have.property("history");
            expect(result).to.have.property("root");
            expect(result).to.have.property("store");
        });

        after(() => {
            const rootNode = document.getElementById(CONTAINER_ID);
            unmountComponentAtNode(rootNode);
            rootNode.innerHTML = "";
       });

    });

    describe("Should be able to bootstrap with hashHistory.", () => {

        let result: interfaces.BootstrapResult;
        before(() => {
            result = bootstrap({
                container: "root",
                createHistory: createHashHistory,
                initialState: {},
                middlewares: [thunk],
                reducers: getReducers(),
                routes: getRoutes()
            });
        });

        it("Should be able to render the home page.", (done) => {
            setTimeout(() => {
                expect($("#home_page_title").text()).eql("Home Page!");
                done();
            }, 20);
        });

        it("Should be able to navigate to a page.", (done) => {
            let usersLink = document.getElementById("link_to_users");
            usersLink.click();
            setTimeout(() => {
                expect($("#users_page_title").text()).eql("Users Page!");
                done();
            }, 30);
        });

        after(() => {
            const rootNode = document.getElementById(CONTAINER_ID);
            unmountComponentAtNode(rootNode);
            rootNode.innerHTML = "";
        });

    });

    describe("Should bootstrap with efficient sync'ed history", () => {

        const BUMP_COUNTER = "BUMP_COUNTER";

        let history: ReactRouterRedux.ReactRouterReduxHistory;
        let store: Redux.Store<any>;

        before(() => {
            const result = bootstrap({
                container: "root",
                initialState: {},
                middlewares: [thunk],
                reducers: getReducers(),
                routes: getRoutes()
            });
            history = result.history;
            store = result.store;
        });

        let eventTimer: any;
        let removeListener: Function;

        afterEach(() => {
            // clear our fallback timer between tests
            if (eventTimer) {
                clearTimeout(eventTimer);
                eventTimer = null;
            }
            // unsubscribe our history listener between tests
            if (removeListener) {
                removeListener();
            }
        });

        it("Should not call history listener for each 'counter' action (3x)", (done) => {
            eventTimer = setTimeout(() => done(), 200);
            let historyListenerCalled = 0;
            removeListener = history.listen(() => {
                historyListenerCalled += 1;
                if (historyListenerCalled >= 3) {
                    // without the fix...
                    done(new Error("unexpected call"));
                }
            });
            store.dispatch({ type: ACTION_TYPES.BUMP_COUNTER });
            store.dispatch({ type: ACTION_TYPES.BUMP_COUNTER });
            store.dispatch({ type: ACTION_TYPES.BUMP_COUNTER });
        });

        it("Should call history listener after 'routing' changed", (done) => {
            eventTimer = setTimeout(() => done(new Error("timeout")), 200);
            removeListener = history.listen(() => done());
            store.dispatch(push("/"));
        });

        after(() => {
            const rootNode = document.getElementById(CONTAINER_ID);
            unmountComponentAtNode(rootNode);
        });

    });

    describe("Should bootstrap with memoryHistory and renderToStaticMarkup.", () => {

        let result: interfaces.BootstrapResult;
        before(() => {
            result = bootstrap({
                container: "root",
                createHistory: createMemoryHistory,
                initialState: {},
                middlewares: [thunk],
                reducers: getReducers(),
                render: renderToStaticMarkup,
                routes: getRoutes()
            });
            result.output = renderToStaticMarkup(result.root);
        });

        it("Should be able to render the home page to string.", () => {
            expect(result.output).to.be.string;
            expect(result.output).to.include('<div id="home_page_title">Home Page!</div>');
        });

    });

    describe("Should bootstrap with memoryHistory and renderToStaticMarkup, with navigation.", () => {

        let result: interfaces.BootstrapResult;
        before(() => {
            result = bootstrap({
                container: "root",
                createHistory: createMemoryHistory,
                initialState: {},
                middlewares: [thunk],
                reducers: getReducers(),
                render: () => { /*  skip first render, we navigate first */ },
                routes: getRoutes()
            });
            result.history.push("/users");
            result.output = renderToStaticMarkup(result.root);
        });

        it("Should be able to render the users page to string.", () => {
            expect(result.output).to.be.string;
            expect(result.output).to.include('<div id="users_page_title">Users Page!</div>');
        });

    });

});
