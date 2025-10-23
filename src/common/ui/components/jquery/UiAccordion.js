import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "smartadmin-plugins/es6/jquery-ui.min";

export default function UiAccordion({ children }) {
  const accordionRef = useRef(null);

  useEffect(() => {
    if (accordionRef.current) {
      $(accordionRef.current).accordion({
        autoHeight: false,
        heightStyle: "content",
        collapsible: true,
        animate: 300,
        icons: {
          header: "fa fa-plus",
          activeHeader: "fa fa-minus"
        },
        header: "h4"
      });
    }

    // Cleanup function to destroy accordion when component unmounts
    return () => {
      if (accordionRef.current) {
        $(accordionRef.current).accordion("destroy");
      }
    };
  }, []); // Empty dependency array = runs once on mount

  return (
    <div ref={accordionRef}>
      {children}
    </div>
  );
}