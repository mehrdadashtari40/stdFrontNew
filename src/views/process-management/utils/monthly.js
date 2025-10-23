import React , {Component} from 'react';
import Date from './date';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import * as Actions from "../ProcessManagementActions";
class mountly extends Component {
    constructor(props){
        super(props);
        this.state= {
            everyText : "",
            day:"",
            wichday:"",
            dayVis:"hidden",
            wichDayVis:"hidden",
            sch_start_day:'',
            sch_start_day_opt_1:'',
            sch_start_day_opt_2:'',
            firstSel:'',
            seccondSel:''
        }
    }
    onDayChanged(e) {
        this.state.sch_start_day = ''
        this.setState({
        sch_start_day: e.target.value,
          dayVis :"",
          wichDayVis:"hidden"
          });
          this.props.onStartDay(e)

      }
    
      onWichDayChanged(e) {
        this.state.sch_start_day = ''
        this.setState({
        sch_start_day: e.target.value,
          wichDayVis:"",
          dayVis :"hidden"
          });
          this.props.onStartDay(e)
      }
      onStartDay = (e) => {
          this.props.onStartDay(e)
      }
      onStartDayOp1 = (e) => {
       this.props.onOption1(e)
      }
 
    onFirstSelectChange = (e) => {
        const firstItem = e.target.value;
        this.setState({
            firstSel:firstItem
        })
        if(this.state.seccondSel){
            const result = firstItem + '|' + this.state.seccondSel;
            this.setState({
                sch_start_day_opt_2:result
            })
        }

    }
    onSeccondSelectChange = (e) => {
        const secondItem = e.target.value;
        this.setState({
            seccondSel: secondItem
        })

        if(this.state.firstSel){
            const result = this.state.firstSel + '|' + secondItem;
            this.setState({
                sch_start_day_opt_2:result
            })
            this.props.onOption2(result)
        }

    }

    render(){ 

        return(
            <div>
                <Date onStart={this.props.onStart} onEnd={this.props.onEnd} onExecute={this.props.onExecute} />
            <div className="form-group">
                <div className="first">
                <span className="month_item_title">{this.props.t('Exact day')}</span>
               <input type="radio" name="mountType" value="1" className="month_rad_item" onChange={this.onDayChanged.bind(this)} />
                  <input type="text" className="form-control month_txt_style" style={{visibility:this.state.dayVis}} onChange={(e) => this.onStartDayOp1(e)}/>
                  </div>
                  <div className="seccond">
                  <span className="month_item_title">{this.props.t("Week day")}</span>
               <input type="radio" name="mountType" value="2" className="month_rad_item" onChange={this.onWichDayChanged.bind(this)} /> 

                   <select className=" form-control month_txt_style" style={{visibility:this.state.wichDayVis}} onChange={(e) => this.onFirstSelectChange(e)}>
                       <option value="1">{this.props.t("first")}</option>
                       <option value="2">{this.props.t("second")}</option>
                       <option value="3">{this.props.t("third")}</option>
                       <option value="4">{this.props.t("forth")}</option>
                       <option value="5">{this.props.t("last")}</option>
                       
                   </select>
                   <select className="form-control month_txt_style" style={{visibility:this.state.wichDayVis}} onChange={(e) => this.onSeccondSelectChange(e)}>
                       <option value="6">{this.props.t("Saturday")}</option>
                       <option value="7">{this.props.t("Sunday")}</option>
                       <option value="1">{this.props.t("Monday")}</option>
                       <option value="2">{this.props.t("Tuesday")}</option>
                       <option value="3">{this.props.t("Wednesday")}</option>
                       <option value="4">{this.props.t("Thursday")}</option>
                       <option value="5">{this.props.t("Friday")}</option>


                   </select>
                   </div>
                   </div>

             </div>   
        );
    }
}
export default compose(
    withTranslation(),
    connect(state => state.processManagement, Actions)
)(mountly);
