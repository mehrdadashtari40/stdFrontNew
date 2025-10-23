import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "smartadmin-plugins/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js";

export default function EasyPieChartContainer({ className, children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      $(".easy-pie-chart", $(containerRef.current)).each(function(idx, element) {
        const $this = $(element);
        const barColor = $this.css("color") || $this.data("pie-color");
        const trackColor = $this.data("pie-track-color") || "rgba(0,0,0,0.04)";
        const size = parseInt($this.data("pie-size"), 10) || 25;

        $this.easyPieChart({
          barColor: barColor,
          trackColor: trackColor,
          scaleColor: false,
          lineCap: "butt",
          lineWidth: parseInt(size / 8.5, 10),
          animate: 1500,
          rotate: -90,
          size: size,
          onStep: function(from, to, percent) {
            $(this.el)
              .find(".percent")
              .text(Math.round(percent));
          }
        });
      });
    }
  }, []); // Empty dependency array = runs once on mount

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}