import React, {useEffect, useState} from "react";
import * as layout from "../_redux/layoutRedux";
import {connect, shallowEqual, useSelector} from "react-redux";
import {get_current_notifications} from "../_redux/layoutCrud"
import {useHistory} from "react-router-dom";
import moment from 'jalali-moment'
import {compose} from "redux";
import {withTranslation} from "react-i18next";

function NotificationsDropdown(props) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    let {state} = useSelector(
        (state) => ({
            state: state.layout2
        }),
        shallowEqual
    );
    if (state === undefined) state = {};
    let history = useHistory();
    useEffect(() => {
        if (state.is_notifications_loading === 0) {
            props.handle_variables('is_notifications_loading', 1)
            get_current_notifications().then(res => {
                props.notifications_loaded(res)
            })
        }
    });
    let total_count = 0;
    let notifications_keys = Object.keys(state.notifications);

    if (notifications_keys.length > 0) {
        total_count += state.notifications.expired.length;
        total_count += state.notifications.today.length;
        total_count += state.notifications.tomorrow.length;
    }

    return (<>
        {total_count === 0 ? <div className={'notification-dropdown-btn'}><i className="fal fa-bell "></i></div> : <>
            {openDrawer === true ?
                <div className={'notification-dropdown-btn '}>
                    <i className="fad fa-bell-on"></i>
                    <div className={'dropdown-container notifications'} onMouseLeave={() => setOpenDrawer(false)}>
                        <div className={'tabs'}>
                            {notifications_keys.map((x, key) => {
                                return (<div className={key === currentTab ? 'active' : ''} key={key}
                                             onClick={() => setCurrentTab(key)}>{props.t(x)}</div>)
                            })}
                        </div>
                        <div className={'contents'}>
                            {notifications_keys.map((x, key) => {
                                if (key !== currentTab) return (<div key={key}></div>);
                                return (<div className={'tab-content'} key={key}>
                                    {state.notifications[x].length === 0 ?
                                        <div className={'notification-link'}>
                                            <div className={'nt-title'}>
                                                <h5>{props.t('No items')}</h5>
                                            </div>
                                        </div>:
                                        <>
                                            {state.notifications[x].map((y, key2) => {
                                                let update_date = moment(y.app_update_date).format('jYYYY/jMM/jDD');
                                                let finish_date = "";
                                                if(y.app_finish_date !== null) finish_date = moment(y.app_finish_date).format('jYYYY/jMM/jDD');
                                                return (<div className={'notification-link'} onClick={() => {
                                                    setOpenDrawer(false)
                                                    history.push('/details/' + y.app_uid + '/' + y.del_index)
                                                }} key={key + "-" + key2}>
                                                    <div className={'nt-title'}>
                                                        <h5><i className="fas fa-stop"></i>{y.app_tas_title}</h5>
                                                    </div>
                                                    <div className={'nt-info'}>
                                                        <div>
                                                            <small>{finish_date}</small>
                                                            <small>{props.t('Reference')}: {y.usr_firstname} {y.usr_lastname}</small>
                                                            <small>{props.t('Receive date')}: {update_date}</small>
                                                        </div>
                                                    </div>
                                                </div>)
                                            })}
                                        </>}
                                </div>)
                            })}
                        </div>
                        <div className={'notifications-footer col-sm-12 text-left'} style={{flexDirection: "row-reverse"}}>
                            <button className={'btn btn-blue'}>{props.t('View more')}</button>
                        </div>
                    </div>

                </div>
                : <div className={'notification-dropdown-btn notifications'}
                       onClick={() => setOpenDrawer(true)}
                       title={props.t('Notifications')}
                >
                    <div className="h-badge bg-color-green2">{total_count}</div>
                    <i className="fal fa-bell-on "></i></div>
            }
        </>

        }
    </>)
}
export default compose(
    withTranslation(),
    connect(null, layout.actions)
)(NotificationsDropdown);
