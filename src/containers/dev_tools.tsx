import * as React from "react";
import * as ReduxDevtols from "redux-devtools";
import LogMonitor from "redux-devtools-log-monitor";
import DockMonitor from "redux-devtools-dock-monitor";

let DevTools: any = ReduxDevtols.createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-w">
        <LogMonitor />
    </DockMonitor>
);

export default DevTools;
