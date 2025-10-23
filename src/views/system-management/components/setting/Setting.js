import React, {useContext} from 'react';
import getAuthonticatedJSON from '../../../../common/utils/functions/getAuthenticatedJSON';
import postAuthenticatedJSON from '../../../../common/utils/functions/postAuthenticatedJSON';
import {WidgetGrid, JarvisWidget, smallBox} from '../../../../common';
import $ from 'jquery';
import CardContent from "@mui/material/CardContent";
import MaterialDataTable from "../../../../common/tables/components/MaterialDataTable";
import Card from "@mui/material/Card";
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import * as Actions from "../../../process-management/ProcessManagementActions";
import {AppConfig} from "../../../../appConfig";

class Setting extends React.Component {
    static contextType = AppConfig;
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            dashboards:[]
        }
    }

    componentDidMount() {
        const config = this.context;
        let self = this;
        getAuthonticatedJSON(config.apiServer + 'anrsetting/default_route').then((res) => {
            self.setState({value:res});
            $("input[value=" + res + "]").attr('checked', 'checked');
        });
        getAuthonticatedJSON(config.apiServer + 'biarian/my-dashboard-report-list').then((res) => {
            self.setState({dashboards:res});
            $("input[value=" + self.state.value + "]").attr('checked', 'checked');
        });
    }

    saveDefault = () => {
        const config = this.context;
        let self = this;
        let URL = config.apiServer + "anrsetting";
        let request = {
            item_key: 'default_route',
            item_value: $("input[type='radio'][name='defaultPage']:checked").val()
        };
        postAuthenticatedJSON(URL, request)
            .then(res => {
                smallBox({
                    title: self.props.t('Successfully'),
                    content: '<i>' + self.props.t("Data has been saved successfully") + '</i>',
                    color: '#659265',
                    iconSmall: 'fa fa-check fa-2x fadeInRight animated',
                    timeout: 4000,
                });
            });
    }
    radioChange = e => {
        this.setState({
            value: e.target.value
        })
    }

    render() {
        const config = this.context;

        return (<>
            <Card id="content">
                <CardContent>
                    <h5 className={'table-header-title'}>
                        <i className={"fal fa-user table-header-icon"}></i>
                        تنظیمات نمایه
                    </h5>

                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12" style={{paddingBottom:20 , marginLeft:20}}>
                            <label className="radio" style={{marginRight: 20}}>
                                {/*<input type="radio" name="defaultPage" id="default" value="#/default" />*/}
                                <input type="radio" name="defaultPage" id="default" value="inbox"
                                       onChange={this.radioChange}/>
                                کارتابل</label>
                            <label className="radio" style={{marginRight: 20}}>
                                <input type="radio" name="defaultPage" id="analytical" value="DashboardBi"
                                       onChange={this.radioChange}/>
                                داشبورد تحلیلی</label>

                            {this.state.dashboards.map((x,key)=>{
                                return (<label key={key} className="radio" style={{marginRight: 20}}>
                                    <input type="radio" name="defaultPage" value={x.route}
                                           onChange={this.radioChange}/>
                                    {x.title}</label>)
                            })}
                            {/*<label className="radio" style={{marginRight: 20}}>*/}
                            {/*    <input type="radio" name="defaultPage" id="guest" value="dashboard/guest"*/}
                            {/*           onChange={this.radioChange}/>*/}
                            {/*    داشبورد مهمان</label>*/}
                            <button type="button" className="btn btn-success"
                                    onClick={() => this.saveDefault()}>ثبت
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>)
    }

}
export default withTranslation()(Setting);