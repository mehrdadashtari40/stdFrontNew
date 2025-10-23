import React from "react";
import moment from "moment-jalaali";

export const documentStatsFormatter = (cellContent, row) => (
  <span>
    {row?.is_comment_available && (
      <>{+row?.is_comment_available === 1 ? "کامنت" : "سوال"}</>
    )}
  </span>
);
