import React from "react";
import moment from 'jalali-moment';
import { PropagateLoader } from "react-spinners";
export default function TrelloItem(props) {
    return (
        <div className='trello-item noselect' onClick={props.onClick}>
            <div className='head-info'>
                <div className='head-right circle-tag bg-orange'>{props.estimated_time}</div>
                <div className='head-left'>
                    <span className='project-name box-tag bg-green'>{props.project_name}</span>
                    <span className='project-id box-tag bg-red'>{props.project_id}</span>
                    <span className='story-id box-tag bg-blue'>{props.story_id}</span>
                    <span className='task-id box-tag bg-green'>{props.task_id}</span>
                </div>
            </div>
            <div className='main-info'>
                <h5>{props.task_title}</h5>
                <small>{props.story_title}</small>
            </div>
            <div className='footer-info'>
                {props.user == null ? null :
                    <span className='task-user'>
                        <img src={props.user.image_url} />
                        <span>{props.user.name}</span>
                    </span>
                }
                {props.completed == null ? null :
                    <div className='finish-info'>
                        {props.completed.finish_time == null ? null : <span className='task-due-time circle-tag bg-red'>{props.completed.finish_time}</span>}
                        {props.completed.finish_date == null ? null : <span className='task-finish-date box-tag bg-green'>{moment(props.completed.finish_date, 'YYYY-M-D HH:mm:ss').locale('fa').format('YYYY/MM/DD HH:mm:ss')}</span>}
                    </div>
                }
            </div>
            {props.draggable === true ? null :
                <div className="task-loader-container">
                    <PropagateLoader color="#00adff"/>
                </div>
            }
        </div>
    )

}