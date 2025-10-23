import React, {useContext, useEffect, useState} from "react";

import * as layout from "../_redux/layoutRedux";
import {connect, shallowEqual, useSelector} from "react-redux";
import StaticMenu from "./StaticMenu";
import AdvancedSearch from "./AdvancedSearch";
import {get_my_name} from "../_redux/layoutCrud";
import Activities from "./Activities";
import SettingMenu from "./SettingMenu";
import {useHistory} from "react-router-dom";
import {withTranslation} from 'react-i18next';
import {config} from "../../../config/config";
import {AppConfig} from "../../../appConfig";

function Sidebar(props) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activitiesOpen, setActivitiesOpen] = useState(false);
    const [staticOpen, setStaticOpen] = useState(false);
    const {apiServer} = useContext(AppConfig)
    let {state} = useSelector(
        (state) => ({
            state: state.layout2
        }),
        shallowEqual
    );
    if (state === undefined) state = {};
    let history = useHistory();
    useEffect(() => {
        if (state.is_user_info_loading === 0) {
            props.handle_variables('is_user_info_loading', 1)
            get_my_name(apiServer).then(res => {
                props.user_info_loaded(res)
            })
        }
    });
    if (state.not_inbox) {
        if (state.current_side_menu !== 1) {
            props.handle_variables('current_side_menu', 1)
        }
    }

    return (<div className={'sidebar-container' + (state.is_sidebar_collapsed === true ? ' collapsed-sidebar' : '')}>
        <div className={'static-info'}>
            <div className={'main-logo-holder'} style={{cursor: 'pointer'}}
                 onClick={() => {
                     history.push('/workDesk')
                     props.handle_refresh_inbox();
                 }}
            >
                {state.is_sidebar_collapsed === true ?
                    <img className={'small-image'} src={'/assets/img/arian.png'}/> :
                    <img src={'/assets/img/logo-white.png'}/>
                }
            </div>
            {state.is_sidebar_collapsed === true ?
            <div style={{textAlign: 'center',fontSize: '27px',marginTop: '15px',cursor: 'pointer'}} onClick={() => {
                history.push('/workDesk')
                props.handle_refresh_inbox();
            }}>
           <i class="fas fa-home"></i>
        </div> : null}
            <div className={'user-info'}>
                <div className={'user-info-holder'} onClick={() => (history.push('/profile'))}>
                    <div>
                        <img src={'/assets/img/avatars/user-avatar.png'}/>
                        {state.is_sidebar_collapsed === true ? null: <>
                            <div style={{display: 'inline-block'}}>{state.username}</div>
                        </>
                        }
                        <i className={'fal fa-edit user-edit'}></i>
                    </div>
                </div>
                {state.is_sidebar_collapsed === true ? null :
                    <div>
                        <div className={'text-right menu-switch-holder'}>
                            
                            {state.not_inbox ? null : <>
                                {state.current_side_menu === 0 ?
                                    <div onClick={() => props.handle_variables('current_side_menu', 1)}>
                                        <i className="fal fa-cog fa-1x"></i>
                                    </div> : null
                                }
                                {state.current_side_menu === 0 ?
                                    <div onClick={() => props.handle_variables('current_side_menu', 2)}>
                                        <i className="fal fa-search fa-1x"></i></div> :
                                    <div onClick={() => props.handle_variables('current_side_menu', 0)}>
                                        <i className="fal fa-arrow-right brand-color fa-1x"></i>
                                    </div>
                                }</>
                            }
                            <div onClick={() => {
                                    history.push('/workDesk')
                                    props.handle_refresh_inbox();
                                }}>
                               <i class="fas fa-home"></i>
                            </div>
                        </div> 
                    </div>
                }
            </div>
        </div>
        <div className={'side-menu'+(state.current_side_menu === 1?' nav-menu':'')}>
            {state.current_side_menu === 0 ? <>
                <div className={'main-part'}>
                    <div className={'side-activities'}
                         onMouseEnter={() => setActivitiesOpen(true)}
                         onMouseLeave={() => setActivitiesOpen(false)}
                    >
                        {(state.is_sidebar_collapsed === false || activitiesOpen === false) ? null :
                            <div className={'p-relative'}>
                                <div className={'collapsed-open'}>
                                    <Activities {...props} />
                                </div>
                            </div>
                        }
                        <div className={'site-text'}>{props.t("Activities")}</div>
                    </div>
                    <div className={'side-static-links'}
                         onMouseEnter={() => setStaticOpen(true)}
                         onMouseLeave={() => setStaticOpen(false)}
                    >
                        {(state.is_sidebar_collapsed === false || staticOpen === false) ? null :
                            <div className={'p-relative'}>
                                <div className={'collapsed-open'}>
                                    <StaticMenu {...props} />
                                </div>
                            </div>
                        }
                        <div className={'site-text'}>{props.t("Cartable")}</div>
                    </div>
                </div>
                {state.is_sidebar_collapsed === true ? null :
                    <div className={'content-part'}>
                        <div className={'activities'}>
                            <Activities {...props} />
                        </div>
                        <div className={'static-links'}>
                            <StaticMenu {...props} />
                        </div>
                    </div>
                }
            </> : <>
                {state.current_side_menu === 1 ?
                    <div className={'main-part'}>
                        {state.is_sidebar_collapsed ? <>
                                <div
                                    onMouseEnter={() => setSettingsOpen(true)}
                                    onMouseLeave={() => setSettingsOpen(false)}>
                                    {settingsOpen === false ? null :
                                        <div className={'p-relative'}>
                                            <div className={'float-menu-holder'}>
                                                <SettingMenu {...props} user_permissions={state.user_permissions}/>
                                            </div>
                                        </div>
                                    }
                                    <div className={'mt-2 text-center'}>
                                        <i className={'fal fa-cog fa-2x'}></i>
                                    </div>
                                </div>
                            </> :
                            <SettingMenu {...props} user_permissions={state.user_permissions}/>}
                    </div> :
                    <div className={'main-part'}>
                        {state.is_sidebar_collapsed ? <>
                                <div
                                    onMouseEnter={() => setSearchOpen(true)}
                                    onMouseLeave={() => setSearchOpen(false)}>
                                    {searchOpen === false ? null :
                                        <div className={'p-relative'}>
                                            <div className={'float-menu-holder'}>
                                                <AdvancedSearch {...props} />
                                            </div>
                                        </div>
                                    }
                                    <div className={'mt-2 text-center'}>
                                        <i className={'fal fa-search fa-2x'}></i>
                                    </div>
                                </div>
                            </> :
                            <AdvancedSearch {...props} />}

                    </div>}

            </>}
        </div>

        <div className={'content-footer'}>
            <div className={'collapse-btn'}
                 onClick={() => props.handle_variables('is_sidebar_collapsed', !state.is_sidebar_collapsed)}>
                {state.is_sidebar_collapsed === true ?
                    <i className="fal fa-arrow-to-left fa-3x"></i> :
                    <i className="fal fa-arrow-to-right fa-3x"></i>
                }
            </div>
            {state.is_sidebar_collapsed === true ? null :
                <div className={'menu-footer'}>
                    <img src="assets/img/arian.png" className="footer_arian_logo" alt="ArianNovin"/>
                    <a href="http://arian.co.ir" className="txt-color-white" target="_blank">{props.t('Arian Novin Co')} - {process.env.REACT_APP_VERSION}</a>
                </div>
            }

        </div>
    </div>)
}

export default connect(null, layout.actions)(withTranslation()(Sidebar));
