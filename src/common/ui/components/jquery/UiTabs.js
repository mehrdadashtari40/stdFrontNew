import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "smartadmin-plugins/es6/jquery-ui.min";

export default function UiTabs(props) {
  const tabsRef = useRef(null);
  const { children, ...otherProps } = props;

  useEffect(() => {
    if (tabsRef.current) {
      $(tabsRef.current).tabs();
    }

    // Cleanup function to destroy tabs when component unmounts
    return () => {
      if (tabsRef.current) {
        $(tabsRef.current).tabs("destroy");
      }
    };
  }, []); // Empty dependency array = runs once on mount

  return (
    <div ref={tabsRef} {...otherProps}>
      {children}
    </div>
  );
}