import React from "react";
import { useState, useEffect, useRef } from "react";

function Sidebar(props) {
    const sidebarRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(268);

    const startResizing = React.useCallback((mouseDownEvent) => {
        setIsResizing(true);
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = React.useCallback(
        (mouseMoveEvent) => {
            console.log(mouseMoveEvent.clientX);
            if (isResizing) {
                setSidebarWidth(
                    window.innerWidth - mouseMoveEvent.clientX
                );
            }
        },
        [isResizing]
    );

    React.useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div
            ref={sidebarRef}
            className="app-sidebar"
            style={{ width: sidebarWidth }}
        >
            <div className="app-sidebar-resizer" onMouseDown={startResizing} />
            <div className="app-sidebar-content" >
                {props && props.children}
            </div>

        </div>
    );
}

export default Sidebar;
