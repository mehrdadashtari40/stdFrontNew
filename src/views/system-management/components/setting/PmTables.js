import React from 'react'
import {config} from '../../../../config/config';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MaterialDataTable from "../../../../common/tables/components/MaterialDataTable";
import Form from "../../utils/CategoryForm";

export default class PmTables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    render() {
        const {loading} = this.state;
        let IframeURL = config.iframeServer + "pmTables" + "?sid=" + localStorage.getItem('session_id');

        return (<>
                <Card id="content">
                    <CardContent>
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-12 p-0">
                                <iframe name="my-iframe" src={IframeURL} id="my-iframe"
                                        style={{width: "100%", height: "1000px", marginTop: "0", border: "none"}}
                                        sandbox="allow-downloads allow-top-navigation allow-same-origin allow-scripts allow-forms allow-modals allow-popups"></iframe>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </>
        )
    }

}