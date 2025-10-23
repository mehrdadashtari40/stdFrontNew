import React from "react";
import moment from "moment-jalaali";

export const DateFormatter = (cellContent, row) => (
  <span>
    {row.submit_date
      ? moment(row.submit_date.substring(0, 10)).format("jYYYY/jMM/jDD")
      : "نامشخص"}
  </span>
);

export const CreatedDateFormatter = (cellContent, row) => (
  <span>
    {row.created_at
      ? moment(row.created_at.substring(0, 10)).format("jYYYY/jMM/jDD")
      : "نامشخص"}
  </span>
);

export const ExpiredFormatter = (cellContent, row) => (
  <span>
    {row.expire_date
      ? moment(row.expire_date.substring(0, 10)).format("jYYYY/jMM/jDD")
      : "نامشخص"}
  </span>
);
