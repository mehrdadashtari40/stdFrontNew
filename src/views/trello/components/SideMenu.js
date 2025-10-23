import React, { useState } from "react";

export default function SideMenu(props) {
    const [openMenu, setOpenMenu] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [filterProjectTypes, setFilterProjectTypes] = useState([]);
    const [showProjectTypes, setShowProjectTypes] = useState(false);
    const [filterProjects, setFilterProjects] = useState([]);
    const [showProjects, setShowProjects] = useState(false);
    const [filterUsers, setFilterUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);


    let project_types = props.project_types === false ? [] : props.project_types;

    let projects = props.projects === false ? [] : props.projects;

    let users = props.users === false ? [] : props.users;
    const searchString_change = (e) => {
        setSearchString(e.target.value)
    }

    const filters_changed = (id, filter_name) => {
        let types_temp = filterProjectTypes;
        let projects_temp = filterProjects;
        let users_temp = filterUsers;
        switch (filter_name) {
            case 'project_type':
                if (types_temp.indexOf(id) === -1)
                    types_temp = types_temp.concat([id]);
                else
                    types_temp = types_temp.filter(x => x !== id);
                setFilterProjectTypes(types_temp);
                break;
            case 'project':
                if (projects_temp.indexOf(id) === -1)
                    projects_temp = projects_temp.concat([id]);
                else
                    projects_temp = projects_temp.filter(x => x !== id);
                setFilterProjects(projects_temp);
                break;
            case 'user':
                if (users_temp.indexOf(id) === -1)
                    users_temp = users_temp.concat([id]);
                else
                    users_temp = users_temp.filter(x => x !== id);
                setFilterUsers(users_temp);
                break;
        }
        const filters = {
            project_types:types_temp,
            projects:projects_temp,
            users:users_temp
        }
        props.refresh_cards(filters);
    }


    project_types = project_types.filter(x => x.TITLE !== null);
    projects = projects.filter(x => x.PROJECT_TITLE_LABEL !== null);
    users = users.filter(x => (x.USR_FIRSTNAME !== null && x.USR_LASTNAME !== null));


    if(filterProjectTypes.length > 0){
        projects = projects.filter(x => filterProjectTypes.indexOf(x.PROJECT_TYPE) !== -1);
    }

    project_types = project_types.filter(x => x.TITLE.toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
    projects = projects.filter(x => x.PROJECT_TITLE_LABEL.toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
    users = users.filter(x => (x.USR_FIRSTNAME.toLowerCase().indexOf(searchString.toLowerCase()) !== -1 || x.USR_LASTNAME.toLowerCase().indexOf(searchString.toLowerCase()) !== -1))

    let filtered_project_types = project_types;
    let filtered_projects = projects;
    let filtered_users = users;

    if (!showProjectTypes) {
        filtered_project_types = filtered_project_types.slice(0, 5);
    }
    if (!showProjects) {
        filtered_projects = filtered_projects.slice(0, 5);
    }
    if (!showUsers) {
        filtered_users = filtered_users.slice(0, 5);
    }

    return (
        <div className='drawer-holder'>
            {!openMenu?
                <i className="fa fa-cog open-filters-btn" style={{marginLeft:'35px',fontSize:'30px'}} onClick={()=>setOpenMenu(true)}></i>:
                <div className='menu-container'>
                <div className='menu-header'>
                    <h3 className='title text-center'>جستجو</h3>
                    <i className='close-btn fa fa-close' onClick={()=>setOpenMenu(false)}/>
                </div>
                <div className='menu-body text-left'>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={searchString}
                                    onChange={(e) => searchString_change(e)}
                                />
                            </div>
                        </div>
                        <div className='col-sm-12'>
                            <h6>نوع پروژه</h6>
                            <div className='filter-project-type'>
                                {filtered_project_types.map(x => (
                                    <label
                                        className={'filter-label' + (filterProjectTypes.indexOf(x.ID) === -1 ? '' : ' selected')}
                                        onClick={(e) => filters_changed(x.ID, 'project_type')}
                                    >
                                        {x.TITLE}
                                        <i className="fa fa-check"></i>
                                    </label>
                                ))}
                                {project_types.length < 6 ?
                                    null :
                                    <>
                                        {showProjectTypes ?
                                            <label className='filter-label show-more-list'
                                                onClick={() => setShowProjectTypes(false)}
                                            >بستن لیست</label> :
                                            <label className='filter-label show-more-list'
                                                onClick={() => setShowProjectTypes(true)}
                                            > نمایش همه ({project_types.length - 5} مورد بیشتر)</label>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                        <hr className='filter-hr' />
                        <div className='col-sm-12'>
                            <h6>پروژه</h6>
                            <div className='filter-project-type'>
                                {filtered_projects.map(x => (
                                    <label
                                        className={'filter-label' + (filterProjects.indexOf(x.PROJECT_CODE) === -1 ? '' : ' selected')}
                                        onClick={() => filters_changed(x.PROJECT_CODE, 'project')}
                                    >
                                        {x.PROJECT_TITLE_LABEL}
                                        <i className="fa fa-check"></i>
                                    </label>
                                ))}
                                {projects.length < 6 ?
                                    null :
                                    <>
                                        {showProjects ?
                                            <label className='filter-label show-more-list'
                                                onClick={() => setShowProjects(false)}
                                            >بستن لیست</label> :
                                            <label className='filter-label show-more-list'
                                                onClick={() => setShowProjects(true)}
                                            > نمایش همه ({projects.length - 5} مورد بیشتر)</label>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                        <hr className='filter-hr' />
                        <div className='col-sm-12'>
                            <h6>کاربر</h6>
                            <div className='filter-project-type'>
                                {filtered_users.map(x => (
                                    <label
                                        className={'filter-label' + (filterUsers.indexOf(x.USR_UID) === -1 ? '' : ' selected')}
                                        onClick={() => filters_changed(x.USR_UID, 'user')}
                                    >
                                        {x.USR_FIRSTNAME} {x.USR_LASTNAME}
                                        <i className="fa fa-check"></i>
                                    </label>
                                ))}
                                {users.length < 6 ?
                                    null :
                                    <>
                                        {showUsers ?
                                            <label className='filter-label show-more-list'
                                                onClick={() => setShowUsers(false)}
                                            >بستن لیست</label> :
                                            <label className='filter-label show-more-list'
                                                onClick={() => setShowUsers(true)}
                                            > نمایش همه ({users.length - 5} مورد بیشتر)</label>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}