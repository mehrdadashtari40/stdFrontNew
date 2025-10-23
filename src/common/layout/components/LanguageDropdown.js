import React, {useState} from "react";
import * as layout from "../_redux/layoutRedux";
import {connect, shallowEqual, useSelector} from "react-redux";
import {get_current_notifications} from "../_redux/layoutCrud"
import {useHistory} from "react-router-dom";
import moment from 'jalali-moment'
import {compose} from "redux";
import {withTranslation} from "react-i18next";
function LanguageDropdown(props) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(null);
    let self = this;
    let {state} = useSelector(
        (state) => ({
            state: state.layout2
        }),
        shallowEqual
    );
    if (state === undefined) state = {};
    let history = useHistory();
    let current_lang = localStorage.getItem('lang');

    const onLanguageChange = (val) =>{
        if(current_lang !== val.name){
            localStorage.setItem('lang', val.name);
            localStorage.setItem('is_rtl', val.is_rtl);
            window.location.reload();
        }
    }
    let current_flag = null;
    if(current_lang !== null){
        state.langs.map(x=>{
            if(x.name === current_lang){
                current_flag = x.name
            }
        })
    }
    if(state.langs.length === 0) return (<></>)
    return (<>
        {openDrawer === true ?
            <div className={'notification-dropdown-btn dashboard-btn'} onClick={() => setOpenDrawer(false)}>
                <i className="fas fa-flag"></i>
                <div className={'p-relative'}>
                    <div className={'dropdown-container lgCon '}
                         onMouseLeave={()=>{setOpenDrawer(false)}}

                    >
                        <div className={'contents'}>
                            {state.langs.map((y, key2) => {
                                return (<div className={'notification-link'} onClick={()=>onLanguageChange(y)} key={key2}>

                                    <div className={'first-bi-menu text-center'}>
                                        {/*<img src={y.image_path} style={{width:25 , margin:5}} />*/}
                                        {y.title}</div>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
            </div>
            : <div className={'notification-dropdown-btn'} onClick={() => setOpenDrawer(true)}
                title={props.t('Choose language')}
            >
                {current_flag === null?
                    <i className="far fa-flag"></i>:
                   <>{current_flag}</>
                }

            </div>
        }
    </>)
}

export default compose(
    withTranslation(),
    connect(null, layout.actions)
)(LanguageDropdown);
