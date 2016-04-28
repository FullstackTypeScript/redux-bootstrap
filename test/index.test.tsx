/// <reference path="../src/interfaces/interfaces.d.ts" />

import { unmountComponentAtNode } from 'react-dom';
import thunk from "redux-thunk";
// import * as createLogger from "redux-logger";
import * as $ from "jquery";
import { expect } from "chai";
import bootstrap from "../src/index";
import { getRoutes, getReducers } from "./stubs";

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

        let result: BootstrapResult;
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
        });

    });

});
