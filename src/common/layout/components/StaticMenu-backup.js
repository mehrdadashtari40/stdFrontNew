import React from "react";
import {connect, shallowEqual, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {withTranslation} from 'react-i18next';
import * as layout from "../_redux/layoutRedux";

function StaticMenu(props) {
    let {inbox_state} = useSelector(
        (state) => ({
            inbox_state: state.inbox
        }),
        shallowEqual
    );
    let {state} = useSelector(
        (state) => ({
            state: state.layout2
        }),
        shallowEqual
    );



    let history = useHistory();
    if (inbox_state === undefined) inbox_state = {};
    const handleFilterByAction = (action) =>{
        if(state.is_case_detail) {
            history.push('/inbox');
            props.handle_refresh_inbox();
        }
        props.load_data_with_action(action)
        props.handle_variables("menuChangeByAction",action)

    }
    return (<ul className={'static-menu'}>
        <li
            onClick={()=>handleFilterByAction("todo")}
            className={inbox_state.current_action === "todo"?'active':''}
        ><i className="fal fa-inbox-in"></i>{props.t("inbox")}</li>
        <li
            onClick={()=>handleFilterByAction("sent")}
            className={inbox_state.current_action === "sent"?'active':''}
        ><i className="fal fa-paper-plane"></i>{props.t("Sent")}</li>
        {/*Temporarily Removed*/}
        <li
            onClick={()=>handleFilterByAction("unassigned")}
            className={inbox_state.current_action === "unassigned"?'active':''}
        ><i className="fal fa-user-clock"></i>{props.t("Unassigned")}</li>
        <li
            onClick={()=>handleFilterByAction("draft")}
            className={inbox_state.current_action === "draft"?'active':''}
        ><i className="fal fa-pen"></i>{props.t("draft")}</li>
    </ul>)
}

export default connect(null, layout.actions)(withTranslation()(StaticMenu));
