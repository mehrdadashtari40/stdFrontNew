import React, {useState} from "react";
import * as layout from "../_redux/layoutRedux";
import {connect, shallowEqual, useSelector} from "react-redux";
import {get_current_notifications} from "../_redux/layoutCrud"
import {useHistory} from "react-router-dom";
import moment from 'jalali-moment'
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import EqualizerIcon from '@mui/icons-material/Equalizer';

function DashboardDropdown(props) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(null);
    let {state} = useSelector(
        (state) => ({
            state: state.layout2
        }),
        shallowEqual
    );
    if (state === undefined) state = {};
    let history = useHistory();


    return (<>
        {openDrawer === true ?
            <div className={'notification-dropdown-btn dashboard-btn'} onClick={() => setOpenDrawer(false)}>
                <div style={{display: 'flex', alignItems:'center', gap:4}}>
                    <EqualizerIcon sx={{fontSize: 25}} />
                    <span>داشبوردهای تحلیلی</span>
                </div>
                <div className={'p-relative'}>
                    <div className={'dropdown-container dashboards'}>
                        <div className={'contents'} onMouseLeave={()=>{setOpenDrawer(false)}}>
                            {state.bi_menu_items.map((y, key2) => {
                                return (<div className={'notification-link'} key={key2}
                                             onMouseEnter={()=>setCurrentMenu(y)}
                                             onMouseLeave={()=>setCurrentMenu(null)}
                                >
                                    {(currentMenu !== y || y.items === null || y.items=== undefined || y.items.length===0)?null:
                                        <div className={'p-relative'}>
                                            <ul className={'bi-menu-holder'}>
                                                {y.items.map(x=>{
                                                    return (<li onClick={()=>{history.push('/'+x.route)}}><div><i className={x.icon}></i> {x.title}</div></li>)
                                                })}
                                            </ul>
                                        </div>
                                    }
                                    <div className={'first-bi-menu'} onClick={()=>{if(y.route !== undefined) history.push('/'+y.route)}}><i className={y.icon}></i>{y.title}</div>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
            </div>
            : <div className={'notification-dropdown-btn'}
                   onClick={() => setOpenDrawer(true)}
                   title={props.t('Analytical dashboards')}
            >
                <div style={{display: 'flex', alignItems:'center', gap:4}}>
                    <EqualizerIcon sx={{fontSize: 25}} />
                    <span>داشبوردهای تحلیلی</span>
                </div>
            </div>
        }
    </>)
}
export default compose(
    withTranslation(),
    connect(null, layout.actions)
)(DashboardDropdown);
