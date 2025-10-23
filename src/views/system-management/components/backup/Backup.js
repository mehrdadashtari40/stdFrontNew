import React from 'react'
import {config} from '../../../../config/config';
import getAuthonticatedJSON from '../../../../common/utils/functions/getAuthenticatedJSON';
import {withTranslation} from 'react-i18next';
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import postAuthonticatedJSON from "../../../../common/utils/functions/postAuthenticatedJSON";

class Backup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            download_link:''
        }
    }

    backup = () => {
        this.setState({spinner: true});
        let self = this;
        let temp_items = config.apiServer.split('/');
        let workspace = temp_items[temp_items.length - 2];
        let URL = config.apiServer + 'arian/ut/backup-with-link/' + workspace;

        postAuthonticatedJSON(URL)
            .then((res) => {
                self.setState({spinner: false,download_link:res});
            }).catch(() => {
            self.setState({spinner: false});
        });
    }

    downloadFile = (filename, text) => {
        var element = document.getElementById('export');
        // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('href', 'data:application/x-gzip;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        // document.body.appendChild(element);
        element.click();
    }

    render() {
        let spinner = null;
        if (this.state.spinner)
            spinner = <i className="fa fa-spin fa-spinner" style={{marginLeft: '5px'}}></i>

        return (<>
            <Card id="content">
                <CardContent>
                    <h5 className={'table-header-title'}>
                        <i className={"fal fa-download table-header-icon"}></i>
                        تنظیمات - نسخه پشتیبان
                    </h5>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="center" style={{textAlign: 'center'}}>
                                <br/>
                                {this.state.download_link === ""?
                                    <button className="btn btn-primary" onClick={this.backup}>
                                    {spinner}
                                    ایجاد لینک دانلود
                                </button>:<a className="btn btn-success" href={config.apiServer + 'arian/ut/backup-with-link/' + this.state.download_link}>دانلود فایل</a> }

                                <a id="export" className="hidden">export file</a>
                                <br/>
                                <br/>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>)
    }
}

export default withTranslation()(Backup);