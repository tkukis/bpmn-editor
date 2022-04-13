import React, { useRef, useState } from "react";
import "./style.css";
const Sidebar = (props: { children: React.ReactNode, minWidth: number }) => {
    const sidebarRef = useRef(null);
    const _minWidth = props.minWidth || 50;
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
            console.log(mouseMoveEvent.clientX, window.innerWidth);
            if (isResizing) {
                const width = window.innerWidth - mouseMoveEvent.clientX

                setSidebarWidth(
                    width //> _minWidth ? width : _minWidth
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
    return <div ref={sidebarRef} style={{ width: sidebarWidth }} className="bpmn_sidebar">
        <div className="app-sidebar-resizer" onMouseDown={startResizing} />
        <div className="app-sidebar-content" >
            {props && props.children}
        </div>
    </div>
}

export default Sidebar;