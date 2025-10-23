import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "smartadmin-plugins/es6/jquery-ui.min";

export default function UiMenu({ children }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (menuRef.current) {
      $(menuRef.current).menu();
    }

    // Cleanup function to destroy menu when component unmounts
    return () => {
      if (menuRef.current) {
        $(menuRef.current).menu("destroy");
      }
    };
  }, []); // Empty dependency array = runs once on mount

  return (
    <div ref={menuRef}>
      {children}
    </div>
  );
}