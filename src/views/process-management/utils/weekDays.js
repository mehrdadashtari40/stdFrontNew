import React, {Component} from 'react';
import PropTypes from 'prop-types';
import checkboxes from './checkboxes';
import Checkbox from './checkbox';
import Date from './date';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import * as Actions from "../ProcessManagementActions";


class weekDays extends Component {


    constructor(props) {
        super(props);
        this.state = {
            checkedItems: new Map(),

            val: [],
            sch_week_days: ''
        }
        this.handleChange = this.handleChange.bind(this);


    }

    handleChange(e) {

        const item = e.target.value;
        const isChecked = e.target.checked;
        this.setState(prevState => ({checkedItems: prevState.checkedItems.set(item, isChecked)}));

        let newMap = new Map(this.state.checkedItems)
        newMap.set(item, isChecked)

        let arr = [];
        newMap.forEach((value, key) => {
            if (value) {
                arr.push(key)
            }
        })

        let week_days = arr.join("|")
        this.props.onWeekDays(week_days);


    }

    render() {

        return (
            <div>
                <Date onStart={this.props.onStart} onEnd={this.props.onEnd} onExecute={this.props.onExecute}/>
                <div className="weekdays">
                    <h3> {this.props.t('Pick day')} </h3>
                    {checkboxes.map(item => (
                        <label key={item.key}>
                            <span>{this.props.t(item.name)}</span>
                            <Checkbox name={item.name} value={item.value}
                                      checked={this.state.checkedItems.get(item.value)} onChange={this.handleChange}/>
                        </label>
                    ))
                    }
                </div>
            </div>
        );
    }
}
export default compose(
    withTranslation(),
    connect(state => state.processManagement, Actions)
)(weekDays);

