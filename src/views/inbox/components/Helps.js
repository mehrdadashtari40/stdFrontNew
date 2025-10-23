import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import * as layout from "../../../common/layout/_redux/layoutRedux";
import MaterialDataTable from "../../../common/tables/components/MaterialDataTable";
import { config } from "../../../config/config";

class Helps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Helps: [],
      refresh: false,
      total: null,
      limit: null,
      User: [],
      Edit: false,
      Show: [],
      filter: "",
      HelpId: null,
      searchVal: "",
      status: "",
      successor: "",
    };
  }
  getTableRow = (item, self) => {
    return [
      {
        dataField: "name",
        text: "نام فایل راهنما"
      },
      {
        dataField: "actions",
        text: self.props.t("actions"),
        formatter: function (cell, item) {
          return (
            <div className={"table-actions"}>
              <i
                className={"fas fa-download"}
                onClick={() => {
                 window.open(item.path, "_blank");
                }}
              />
            </div>
          );
        },
      },
      /* {
        dataField: "description",
        text: self.props.t("Description"),
      }, */
    ];
  };

  getHelps = (data) => {
    this.setState({ Helps: data });
  };
  render() {
    let helps = null;
    if (this.state.Helps.length > 0) {
      var tmp = [];
      this.state.Helps.map((user) => {
        tmp.push(this.getTableRow(user, this));
      });
      helps = tmp;
    }

    return (
      <MaterialDataTable 
        columns={this.getTableRow(helps, this)}
        url={config.apiServer + "arian/ut/list-helps"}
        getDataList={(data) => this.getHelps(data)}
      />
    );
  }
}

export default compose(withTranslation(), connect(null, layout.actions))(Helps);
