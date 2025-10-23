import React from "react";
import { withTranslation } from "react-i18next";
import { Timeline, TimelineEvent } from "react-event-timeline";

function CaseHistory(props) {
  let dataTable = props.caseHistories.map((caseHistory) => (
    <TimelineEvent
      key={caseHistory.tas_uid}
      title={caseHistory.tas_title}
      icon={props.t("Task")}
      iconColor="black"
      titleStyle={{ fontWeight: 'bold' }}
    >
      {props.t("Delegated User")}:
      <p>
        <i className="fas fa-user fa-fw"> </i>
        {caseHistory.delegations[0] && caseHistory.delegations[0].usr_firstname +
            " " +
            caseHistory.delegations[0].usr_lastname
          }
      </p>
      {props.t("START DATE")}:
      <p>
        <i className="fas fa-calendar-day fa-fw"> </i>
        {caseHistory.delegations[0] &&
           caseHistory.delegations[0].del_init_date}
      </p>
      {props.t("End Date")}:
      <p>
        <i className="fas  fa-calendar-week fa-fw"> </i>
        {caseHistory.delegations[0] &&
          (caseHistory.delegations[0].del_finish_date === "Not finished"
            ? props.t("Not finished")
            : caseHistory.delegations[0].del_finish_date)}
      </p>
    </TimelineEvent>
  ));

  return (
    <Timeline
      orientation="right"
       lineColor="#fcab03"
    >
      {dataTable}
    </Timeline>
  );
}

export default withTranslation()(CaseHistory);
