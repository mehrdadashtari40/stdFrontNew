import React, {Component, useEffect} from 'react';
import $ from 'jquery';
import ModalForm from './ModalForm';
import Datatable from '../../../common/tables/components/Datatable2';
import {withTranslation} from 'react-i18next';
import MaterialDataTable from "../../../common/tables/components/MaterialDataTable";
import {compose} from "redux";
import {connect, useSelector} from "react-redux";
import * as base from "../_redux/baseInfoRedux";

function DynamicDataTable(props) {
	const state = useSelector(state => state.basicInformation)

    // this.state = {
    // 	Edit: false,
    // 	Show: [],
    // 	data: props.data,
    // 	structure: [],
    // 	refresh: false,
    // 	datatable: false,
    // 	editRowData: [],
    // 	newRowData: [],
    // 	formElement: null,
    // 	newRecord: false,
    // };

    useEffect(function () {
        props.handle_variables({
            datatable: true
        })
    })

    // this.setState({
    // 	datatable: false,
    // });

    // TODO : Get Row Item with id
    const getRowItemDetails = id => {
        var uniqueKey = props.primaryKey;
        var editRowData = null;
        props.data.map(item => {
            if (item[uniqueKey] === id) {
                editRowData = item;
            }
        });

        if (uniqueKey) {
            var dt = [];
            dt.push(editRowData);
            this.setState({
                editRowData: dt,
                Edit: true,
            });

            for (var k in editRowData) {
                if (editRowData.hasOwnProperty(k)) {
                    const value = editRowData[k];
                    const selector = '#' + k;
                    $(selector).val(value);
                }
            }
        }
    };

    // componentWillReceiveProps(nextProps) {
    // 	if (this.props.data !== nextProps.data) {
    // 		this.setState({
    // 			datatable: true,
    // 		});
    // 	} else {
    // 		this.setState({
    // 			datatable: false,
    // 		});
    // 		// return false;
    // 	}
    // 	if (this.props.newRecord) {
    // 		this.setState({
    // 			newRecord: true,
    // 		});
    // 	}
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    // 	if (this.props.data !== nextProps.data) {
    // 		this.setState({
    // 			datatable: true,
    // 		});
    // 		return true;
    // 	} else {
    // 		// this.setState({
    // 		// 	datatable: false,
    // 		// });
    // 		return false;
    // 	}
    // }

    /**
     *  TODO : ‌submit create or edit rows
     **/
    const onSubmit = () => {
        var uniqueKey = null;
        let sendData = {};
        sendData['table_name'] = props.tableName;
        this.props.structure.map(item => {
            if (item.pk == 'no') {
                const property = item.name;
                const valueProperty = $('#' + property).val();
                sendData[property] = valueProperty;
            } else {
                uniqueKey = item.name;
            }
        });

        // TODO : get data list
        // TODO : create array and send for Edit

        if (this.state.Edit) {
            const editData = this.state.editRowData[0];
            const recordId = editData[uniqueKey];
            if (recordId) {
                props.updateItem(recordId, sendData);
            }
            return;
        }

        props.addNew(sendData);
    };

    let self = this;
    let column = [];
    if (props.structure.length > 0) {
        var uniqueField = null;
        props.structure.map(item => {
            if (item.pk == 'yes') {
                uniqueField = item.name;
            }

            let obj1 = {
                class: item.pk == 'yes' ? 'service-id hidden' : '',
                data: null,
                render: function (data) {
                    if (item.pk == 'yes')
                        return "<input class='case-select' type='checkbox' value='" + data[item.name] + "'>";
                    else return '<div>' + (data[item.name] ? data[item.name] : 'No data') + '</div>';
                },
            };

            column.push(obj1);
        });
        const actions = {
            class: '',
            data: null,
            render: function (data) {
                return (
                    '<button type="button" rowId="' +
                    data[uniqueField] +
                    '" class="btn btn-danger btn-xs deleteRow"><i class="fa fa-trash"></i></button><span> </span>' +
                    '<button type="button" rowId="' +
                    data[uniqueField] +
                    '" class="btn btn-primary btn-xs updateRow"><i class="fa fa-pencil"></i></button>'
                );
            },
        };

        column.push(actions);
    }

    // TODO :‌ Open Modal
    let formContent = null;

    if (state.newRowData && state.newRowData != null) {
        formContent = (
            <ModalForm
                data={state.newRowData}
                edit={false}
                structure={props.structure}
                submit={() => onSubmit()}
            />
        );
    }

    let dataTable = null;
    if (props.data.length > 0 && props.structure.length > 0) {
        let primary_key = null;
        let columns = props.structure.map(x => {
            if (x.pk === "yes") primary_key = x.name
            return {
                dataField: x.name,
                text: x.label,
                filterable: x.name,
            }
        });
        columns.push({
            dataField: 'actions',
            text: 'عملیات',
            formatter: function (cell, item) {
                return (<div className={'table-actions'}>
                    <i className={'fas fa-edit'}
                       onClick={() => {
                           $('#editRowModal').modal('show');
                           self.getRowItemDetails(item[primary_key]);
                           self.props.editItem(primary_key);
                       }}
                    ></i>
                    <i className={'fas fa-trash'}
                       onClick={() => {
                           self.props.deleteRow(item[primary_key]);
                       }}
                    ></i>
                </div>)
            }
        })

        dataTable = (<MaterialDataTable
            items={props.data}
            columns={columns}
            sticky={1}
        />)

    }

    return (
        <div>
            {dataTable}
            <div
                className="modal fade"
                id="editRowModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="ServiceModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" style={{width: '65%'}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title" style={{display: 'inline-block'}} id="ServiceModalLabel">
                                {props.t('Show Details')}
                            </h4>
                        </div>
                        <div className="">{formContent}</div>
                        <div className="modal-footer">
                            <button type="button" className="btn_inbox btn_datatable" data-dismiss="modal">
                                <i className="fa fa-window-close "></i>
                                {props.t('Close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default compose(withTranslation(),
	connect(null, base.actions))(DynamicDataTable);