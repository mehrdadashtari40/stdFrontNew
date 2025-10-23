import React, {useContext, useEffect} from 'react';

import 'react-dual-listbox/lib/react-dual-listbox.css';
import DynamicDataTable from '../components/DynamicDataTable';
import {connect, useSelector} from 'react-redux';
import {compose} from 'redux';
import * as base from '../_redux/baseInfoRedux';
import $ from 'jquery';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Spinner from "../../../common/Spinner/Spinner";
import {withTranslation} from "react-i18next";
import Select from 'react-select'
import {get_table_data, get_table_list} from "../_redux/baseInfoCrud";
import {AppConfig} from "../../../appConfig";

function Base(props) {
    const state = useSelector(state => state.basicInformation)
    const {apiServer} = useContext(AppConfig);
    useEffect(function () {
        if(state.tablesList.length === 0){
            get_table_list(apiServer).then(res=>{
                props.handle_variables({
                    tablesList:res
                })
            })
        }
    })

    const getTablesData = tableName => {
        props.handle_variables({loading:true});
        get_table_data(apiServer,tableName).then(res => {
            let primaryKey = '';
            res.structure.filter(item => {
                if (item.ai === 'yes') {
                    primaryKey = item.name;
                }
            });
            props.handle_variables({
                loading:false,
                data:res.data,
                structure:res.structure,
                selectedTable:tableName,
            })
        })
    };

    const onTableSelect = e => {
        const tableName = e.value;
        if (tableName) {
            getTablesData(tableName);
        } else {
            props.set_table_data({},'');
        }
    };

    const deleteRowItem = id => {
        var tableName = state.selectedTable;
        var name = getPrimaryKey();
        deleteItem(id, tableName, name);
    };

    const addNewItem = newItem => {
        props.setEmptyEditItem();
        props.addNewItem(newItem, () => {
            $('#editRowModal').modal('hide');
            getTablesData(state.selectedTable);
        });
    };

    const setEmptyValues = () => {
        if (state.data.length > 0) {
            var editRowData = state.data[0];
            for (var k in editRowData) {
                if (editRowData.hasOwnProperty(k)) {
                    const selector = '#' + k;
                    $(selector).val('');
                }
            }
        }
    };

    const onNewItem = () => {
        this.setEmptyValues();
        $('#editRowModal').modal('show');
    };

    const editRowItem = itemId => {
        props.editItem(itemId, state.primaryKey);
    };

    const updateItem = (id, data) => {
        var name = this.getPrimaryKey();
        props.updateItem(id, data, name, () => {
            $('#editRowModal').modal('hide');
        });
    };

    const getPrimaryKey = () => {
        let structure = state.structure;

        var name = '';
        structure.map(item => {
            if (item.ai == 'yes') {
                name = item.name;
            }
        });
        return name;
    };

    let dataTable = null;
    if (state.structure.length > 0) {
        let column = [];
        state.structure.map(item => {
            let obj = {
                class: '',
                data: null,
                render: function (data) {
                    return '<div>' + (data[item.name] ? data[item.name] : 'No data') + '</div>';
                },
            };
            column.push(obj);
        });
        dataTable = (
            <DynamicDataTable
                data={state.data}
                structure={state.structure}
                tableName={state.selectedTable}
                deleteRow={id => deleteRowItem(id)}
                column={column}
                addNew={newItem => addNewItem(newItem)}
                updateItem={(id, data) => updateItem(id, data)}
                editItem={id => editRowItem(id)}
                primaryKey={state.primaryKey}
            />
        );
    }


    if (dataTable === null && state.loading === false && state.tablesList.length !== 0) {
        getTablesData(state.tablesList[0].name)
    }
    let options = state.tablesList.map((t, index) => {
        return ({value: t.name, label: t.label});
    });
    return (
        <Card id="content" className={'overflow-visible'}>
            <CardContent>
                <h5 className={'table-header-title'}>
                    <i className={"fal fa-fw fa-database fa-2x"}></i>
                    مدیریت اطلاعات پایه
                    <div className={'base-table-select'}>
                        <Select
                            options={options}
                            onChange={onTableSelect} id="selected"/>
                    </div>
                    <button className="btn btn_inbox"
                            onClick={onNewItem}
                    >
                        <i className="fa fa-plus"/>
                        <span> درج اطلاعات</span>
                    </button>

                </h5>
                <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-12">
                        <div className="no-padding">
                            <div className="pull-right">

                            </div>
                            {state.loading === false ?
                                dataTable
                                :
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Spinner/>
                                </div>
                            }
                        </div>
                    </article>
                </div>
            </CardContent>
        </Card>
    );
}

export default compose(withTranslation(),
    connect(null, base.actions))(Base);
