import React , {Component} from 'react';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import * as Actions from "../ProcessManagementActions";
class every extends Component {
    constructor(props){
        super(props);
        this.state= {
            sch_repeat_every : 0
        }
    }

    onEveryChange (e){
        this.props.onEvery(e)
    }
    render(){
        return(
            <div className="form-group every">
                
               <span >{this.props.t('run each')}</span>

                <input className="form-control everyIn" type="text"  onChange={this.onEveryChange.bind(this)}/>
                <span>{this.props.t('Hour')}</span>
             </div>   
        );
    }
}
export default compose(
    withTranslation(),
    connect(state => state.processManagement, Actions)
)(every);
