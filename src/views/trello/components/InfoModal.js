import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../trelloActions';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { Modal } from "react-bootstrap";
import {postFiles} from '../trelloCrud';
import {AppConfig} from "../../../appConfig";
import CheckList from "./CheckList";
import Attachments from "./Attachments";
import {useDropzone} from 'react-dropzone';
import Comment from "./Comment";




function InfoModal(props) {
    const { apiServer } = React.useContext(AppConfig);

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        noClick: true,
        onDrop: acceptedFiles => {

            let data = new FormData();
            data.append("task_code", props.current_task_code);
            acceptedFiles.map((file,index) =>data.append(`file_${index}`, file));
            postFiles(apiServer, data)
                .then(res => {
                    let totalFiles = [...props.files,...res.data]
                    props.change_variable('files',totalFiles);
                })
                .catch(err => {

                })

            }
    });



    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />

            <Modal
                show={props.show_task_modal}
                onHide={props.close_modal}
                aria-labelledby="ModalHeader"
            >
                <Modal.Header closeButton>
                    <Modal.Title id='ModalHeader'>
                            <span>
                                {props.current_task.task_code} - {props.current_task.TASK_TITLE}
                            </span>
                        <span>
                                <small className='badge'>{props.current_task.TASK_PRIORITY_LABEL}</small>
                            </span>
                    </Modal.Title>
                    <small>{props.current_task.PROJECT_ID_LABEL}</small>
                </Modal.Header>
                <Modal.Body>
                    <div className='head-left'>
                        <span className='project-name box-tag bg-green'>{props.current_task.project_name}</span>
                        <span className='project-id box-tag bg-red'>{props.current_task.PROJECT_CODE}</span>
                        <span className='story-id box-tag bg-blue'>{props.current_task.STORY_CODE}</span>
                        <span className='task-id box-tag bg-green'>{props.current_task.TASK_ID}</span>
                    </div>
                    {/*{props.current_task.finish_date === null ? null :*/}
                    {/*    <h3>زمان اتمام: {moment(props.current_task.finish_date, 'YYYY-M-D HH:mm:ss').locale('fa').format('YYYY/MM/DD HH:mm:ss')}</h3>*/}
                    {/*}*/}
                    <div>{props.current_task.STORY_ID_LABEL}</div>
                    {props.current_task.user_id == null ?
                        null :
                        <div>
                            <h4>کاربر تسک</h4>
                            <span className='task-user'>
                                    <img src={props.current_task.USR_IMAGE_URL} alt={'تصویر کاربر'} />
                                    <span>{props.current_task.USR_FIRSTNAME} {props.current_task.USR_LASTNAME}</span>
                                </span>
                        </div>
                    }
                    <CheckList />
                    <Comment/>
                    <Attachments/>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>


    )
}

export default compose(
    withTranslation(),
    connect(state => state.trello, Actions)
)(InfoModal);