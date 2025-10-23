import React,{useContext} from 'react';
import { connect } from 'react-redux';
import * as Actions from '../trelloActions';
import Board from 'react-trello'
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import TaskItem from './TaskItem';
import SideMenu from './SideMenu';
import { get_lane_info, change_task_lane } from '../trelloCrud';
import {AppConfig} from "../../../appConfig";
import InfoModal from "./InfoModal";

function Trello(props) {


    const {apiServer} = useContext(AppConfig);
    props.lanes.map((x, key) => {
        if (x.loading === false && x.current_page === 0) {
            props.loading_cards(x.id, props.lanes);
            get_lane_info(apiServer,x.server_id,1,null,props.task_title_filter).then(res => {
                props.setLaneInfo(x.server_id, props.lanes, res)
            })
        }
        return x;
    })

    if (props.project_types === false) props.get_fitler_info('project_types');
    if (props.projects === false) props.get_fitler_info('projects');
    if (props.users === false) props.get_fitler_info('users');

    function getCorrectArray(data) {
        data = data.filter(x => x.TASK_CODE !== null);
        return data.map(x => {
            let user = null;
            let completed = null;
            if (x.user_id !== null && x.user_id !== undefined) {
                user = {
                    image_url: x.USR_IMAGE_URL,
                    name: x.USR_FIRSTNAME + " " + x.USR_LASTNAME
                };
                completed = {
                    finish_time: x.finish_time,
                    finish_date: x.finish_date,
                }
            }
            return {
                id: x.TASK_CODE,
                estimated_time: parseInt(x.TASK_ESTIMATE) * 60,
                project_name: x.PROJECT_ID_LABEL,
                project_id: x.PROJECT_CODE,
                story_id: x.STORY_CODE,
                task_id: x.TASK_ID,
                task_title: x.TASK_TITLE,
                story_title: x.STORY_ID_LABEL,
                completed: completed,
                user: user,
                draggable: x.draggable === undefined ? true : x.draggable
            };
        })
    }

    let data = {
        lanes: props.lanes.map(x => {
            return {
                id: x.id,
                title: x.title,
                label: '',
                cards: getCorrectArray(x.tasks)
            }
        })
    }

    const paginate = (requestedPage, laneId) => {
        return new Promise(function (resolve) {
            let lane = props.lanes.filter(x => x.id === laneId)[0];
            if (lane !== undefined) {
                if (lane.loading === false) {
                    props.loading_cards(laneId, props.lanes);
                    get_lane_info(apiServer,lane.server_id, lane.current_page + 1, props.filters,props.task_title_filter).then(res => {
                        props.setLaneInfo(lane.server_id, props.lanes, res, false)
                        resolve([])
                    })
                }
            }
        });
    }

    const openCardModal = (cardId, metadata, laneId) => {
        // if (laneId === "lane1") return;
        let task = props.lanes.filter(x => x.id === laneId)[0].tasks.filter(x => x.TASK_CODE === cardId)[0];
        props.open_modal(task);
        props.getTaskInfo(cardId);
        props.change_variable("current_task_code",cardId);
    }

    const updateTaskInfo = () => {
        props.update_user_info(props.lanes, props.current_task, props.finish_time_text, props.description_text);
    }

    const onCardMoved = (fromLaneId, toLaneId, cardId, index) => {
        let target_lane = props.lanes.filter(x => x.id === toLaneId)[0];
        if (target_lane !== undefined) {
            let first_lane = props.lanes.filter(x => x.id === fromLaneId)[0];
            let task = first_lane.tasks.filter(x => x.TASK_CODE === cardId)[0];
            task.draggable = false;

            let lanes = props.lanes.map(x => {
                if (x.id === fromLaneId) {
                    x.tasks = x.tasks.filter(y => y.TASK_CODE !== cardId);
                }
                if (x.id === toLaneId) {
                    x.tasks.unshift(task);
                }
                return x
            });
            props.updateLanes(lanes)

            change_task_lane(apiServer,target_lane, cardId).then(response => {
                let status = parseInt(response.code);
                task.draggable = true;
                if (status === 200) {
                    task.USR_FIRSTNAME = response.data.USR_FIRSTNAME;
                    task.USR_LASTNAME = response.data.USR_LASTNAME;
                    task.USR_IMAGE_URL = response.data.USR_IMAGE_URL;

                    task.finish_time = response.data.finish_time;
                    task.finish_date = response.data.finish_date;
                    task.user_id = response.data.user_id;
                    
                    let lanes = props.lanes.map(x => {
                        if (x.id === toLaneId) {
                            x.tasks = x.tasks.map(y=>{
                                if(y.TASK_CODE === cardId ){
                                    return task;
                                }
                                return y;
                            });
                        }
                        return x
                    });
                    props.updateLanes(lanes);
                } else if (status === 400) {
                    alert(response.message);
                    let lanes = props.lanes.map(x => {
                        if (x.id === toLaneId) {
                            x.tasks = x.tasks.filter(y => y.TASK_CODE !== cardId);
                        }
                        if (x.id === fromLaneId) {
                            x.tasks.unshift(task);
                        }
                        return x
                    });
                    props.updateLanes(lanes)

                }
            })
            // props.changeLane(targetLane, cardId, fromLaneId, props.lanes, index);
        }
    }

    const refresh_cards = (filters) => {
        props.refresh_tasks(filters, props.lanes)
    }

    const change_title_search = (title) => {
        props.refresh_tasks(props.filter, props.lanes,title)
    }
    return (
        <div>
            <div className={'search-card-container'}>
                <input type={'text'} placeholder={'عنوان تسک ...'}
                       className={'search-card-input'}
                       value={props.task_title_filter}
                       onChange={(e)=>{
                           props.change_variable("task_title_filter",e.target.value)
                           change_title_search(e.target.value)
                       }}
                />
            </div>
            <Board
                onCardMoveAcrossLanes={onCardMoved}
                data={data}
                components={
                    { Card: TaskItem }
                }
                onLaneScroll={paginate}
                onCardClick={openCardModal}
                laneStyle={{
                    maxHeight: "95vh"
                }}
            />
            {props.current_task === null ? null :
                <InfoModal/>
            }
            <SideMenu
                projects={props.projects}
                project_types={props.project_types}
                users={props.users}
                refresh_cards={refresh_cards}
            />
        </div>
    )
}

export default compose(
    withTranslation(),
    connect(state => state.trello, Actions)
)(Trello);
