import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "smartadmin-plugins/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js";

export default function EasyPieChart({ 
  className, 
  children, 
  percent, 
  pieColor, 
  trackColor = "rgba(0,0,0,0.04)", 
  pieSize = 25 
}) {
  const chartRef = useRef(null);

  useEffect(() => {
    const $element = $(chartRef.current);
    const barColor = $element.css("color") || pieColor;

    // Initialize chart
    $element.easyPieChart({
      barColor: barColor,
      trackColor: trackColor,
      scaleColor: false,
      lineCap: "butt",
      lineWidth: parseInt(pieSize / 8.5, 10),
      animate: 1500,
      rotate: -90,
      size: pieSize,
      onStep: function(from, to, percent) {
        $(this.el)
          .find(".percent")
          .text(Math.round(percent));
      }
    });

    // Set data-reactid (if still needed)
    $element
      .find("canvas")
      .attr("data-reactid", $element.data("reactid") + ".0.1");

    // Update with initial percent
    $element.data("easyPieChart").update(percent);

    // Cleanup function
    return () => {
      // Destroy chart if needed
      if ($element.data("easyPieChart")) {
        $element.removeData("easyPieChart");
      }
    };
  }, []); // Empty dependency array = componentDidMount

  useEffect(() => {
    // Update chart when percent changes
    if (chartRef.current) {
      const $element = $(chartRef.current);
      const chart = $element.data("easyPieChart");
      if (chart) {
        chart.update(percent);
      }
    }
  }, [percent]); // Update when percent changes

  return (
    <div ref={chartRef} className={className}>
      {children}
    </div>
  );
}