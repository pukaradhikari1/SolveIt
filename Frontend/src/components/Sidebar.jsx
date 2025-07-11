import React, { useState, useRef, useEffect } from "react";

function Sidebar({ setSidebarWidth, setSidebarX }) {
  const sidebarRef = useRef(null);
  const [width, setWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0 });
  const dragOffset = useRef(0);

  useEffect(() => {
    if (setSidebarWidth) setSidebarWidth(width);
  }, [width, setSidebarWidth]);

  useEffect(() => {
    if (setSidebarX) setSidebarX(position.x);
  }, [position.x, setSidebarX]);

  useEffect(() => {
    function handleMouseMove(e) {
      if (isResizing) {
        const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
        if (newWidth > 150 && newWidth < 500) setWidth(newWidth);
      }
      if (isDragging) {
        let newX = e.clientX - dragOffset.current;
        if (newX < 0) newX = 0;
        if (newX > window.innerWidth - width) newX = window.innerWidth - width;
        setPosition({ x: newX });
      }
    }

    function handleMouseUp() {
      setIsResizing(false);
      setIsDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isDragging, width]);

  const onMouseDownResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const onMouseDownDrag = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = e.clientX - position.x;
  };

  return (
    <aside
      ref={sidebarRef}
      className="bg-white border-r border-gray-200 p-6 flex flex-col fixed top-0 left-0 h-full shadow-lg select-none"
      style={{
        width: width,
        transform: `translateX(${position.x}px)`,
        transition: isDragging || isResizing ? "none" : "transform 0.3s ease",
        zIndex: 1000,
      }}
    >
      <div
        onMouseDown={onMouseDownDrag}
        className="mb-6 cursor-move font-bold text-blue-600 select-text"
        style={{ userSelect: "text" }}
      >
        SolveIt
      </div>

      <nav className="space-y-6 flex-1 overflow-auto">
        <ul className="space-y-4 text-gray-700 font-medium">
          <li>
            <a href="#" className="hover:text-blue-600">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Questions
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              About Us
            </a>
          </li>
        </ul>
      </nav>

      <div
        onMouseDown={onMouseDownResize}
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-blue-500"
        style={{ userSelect: "none" }}
      />
    </aside>
  );
}

export default Sidebar;
