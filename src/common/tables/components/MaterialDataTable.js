import React, {useState} from 'react';
import getAuthonticatedJSON from '../../utils/functions/getAuthenticatedJSON';

import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
// import Checkbox from "@mui/material/Checkbox";
// import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import {makeStyles} from "@mui/styles";
import {connect} from "react-redux";
import * as inbox from "../../../views/inbox/_redux/inboxRedux";
import {withTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

function MaterialDataTable(props) {
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [current, setCurrent] = useState(1);
    const [filter, setFilter] = useState('');
    const [filters, setFilters] = useState([]);
    const [loading, setLoading] = useState(0);
    const [currentUrl, setCurrentUrl] = useState('');

    const {title, icon, columns} = props;
    const classes = useStyles();

    if (props.items !== undefined && props.items !== totalItems && filters.length === 0 && filter === '') {
        setLoading(0);
    }
    if (props.url !== undefined && currentUrl !== '' && props.url !== currentUrl) {
        setLoading(0);
    }
    if (props.fixedCount !== undefined && props.fixedCount !== limit) {
        setLimit(props.fixedCount);
    }

    const getItems = (limit, start = 0) => {
        if (props.items === undefined) {
            let URL = props.url + '?limit=' + limit + '&start=' + start + '&filter=' + filter;
            setLoading(1);
            setCurrentUrl(props.url);
            getAuthonticatedJSON(URL).then(res => {
                if(res.data === null || res.data === undefined){
                    let parent_items = res;
                    filters.map(x => {
                        if(x.exact === true)
                            parent_items = parent_items.filter(y => y[x.key].toString().toUpperCase() === x.value.toString().toUpperCase())
                        else
                            parent_items = parent_items.filter(y => y[x.key].toString().toUpperCase().indexOf(x.value.toString().toUpperCase()) !== -1)
                        return x;
                    })
                    let current_items = parent_items.slice(start, start + limit);
                    setTotal(parent_items.length);
                    setTotalItems(parent_items);
                    setLimit(limit);
                    setItems(current_items);
                    setLoading(2);
                    let current = Math.ceil((start + 1) / limit);
                    setCurrent(current)
                } else {
                    setTotal(res.total);
                    setLimit(res.limit);
                    setItems(res.data);
                    setLoading(2);
                    props.getDataList(res.data);
                    let current = Math.ceil((start + 1) / limit);
                    setCurrent(current)
                }

            });
        } else {
            let parent_items = props.items;
            filters.map(x => {
                parent_items = parent_items.filter(y => y[x.key] !== null)
                if(x.exact === true)
                    parent_items = parent_items.filter(y => y[x.key].toString().toUpperCase() === x.value.toString().toUpperCase())
                else{
                    parent_items = parent_items.filter(y => y[x.key].toString().toUpperCase().indexOf(x.value.toString().toUpperCase()) !== -1)
                }
                return x;
            })
            let current_items = parent_items.slice(start, start + limit);
            setTotal(parent_items.length);
            setTotalItems(parent_items);
            setLimit(limit);
            setItems(current_items);
            setLoading(2);
            let current = Math.ceil((start + 1) / limit);
            setCurrent(current)
        }


    };

    if (loading === 0) getItems(limit);

    const handle_on_per_page_change = (e) => {
        let sizePerPage = e.target.value;
        setLimit(sizePerPage)
        getItems(sizePerPage, 0, filter);
    };

    const handle_on_page_change = (e, page) => {
        const start = limit * (page);
        getItems(limit, start);
    }

    const handle_filters_change = (e,headCell,exact=false) => {

        let current_filters = filters;
        let new_item = true;
        current_filters = current_filters.map(x => {
            if (x.key === headCell.filterable) {
                new_item = false;
                x.value = e.target.value
            }
            return x
        });
        if (new_item) {
            current_filters.push({
                key: headCell.filterable,
                value: e.target.value,
                exact:exact
            })
        }
        setFilters(current_filters);
        setLoading(0);

    }

    let sticky = '';
    if(props.sticky !== undefined) sticky=props.sticky;
    return (<div className={classes.root}>
        <Paper className={classes.paper} elevation={0}>
            {props.title === undefined?null:
                <Toolbar>
                    {icon === null ? null :
                        <Tooltip title="Filter list">
                            <IconButton aria-label="filter list">
                                <i className={icon}></i>
                            </IconButton>
                        </Tooltip>
                    }
                    <Typography variant="h4" id="tableTitle" component="div">
                        {title}
                    </Typography>
                    {(props.toolbar_btns === undefined) ? null :<>{props.toolbar_btns}</>}
                    {(props.main_filter === undefined || props.main_filter === false) ? null :
                        <input
                            placeholder={props.t('search...')}
                            type={'text'} className={'datatable-filter'}
                            onBlur={(e) => {
                                setFilter(e.target.value);
                                setLoading(0);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setFilter(e.target.value);
                                    setLoading(0);
                                }
                            }}
                        />
                    }
                </Toolbar>
            }

            <TableContainer
                onScroll={(e)=>{
                    if(props.onScroll !== undefined) props.onScroll(e);
                }}
                className={'table-container'}>
                <Table
                    className={classes.table+(sticky===''?'':' sticky-'+sticky)}
                    size={'medium'}
                >
                    <TableHead>
                        <TableRow>
                            {columns.map((headCell,key) => (
                                <TableCell
                                    key={key}
                                    align={headCell.numeric ? 'right' : 'left'}
                                    padding={headCell.disablePadding ? 'none' : 'default'}
                                    // sortDirection={orderBy === headCell.id ? order : false}
                                >
                                    {headCell.headerFormatter === undefined ? <div>
                                        {headCell.filterable === undefined ? null :
                                            <>
                                                {headCell.filterOptions === undefined ?
                                                    <input className={'column-filter'}
                                                           placeholder={props.t('search in ') + headCell.text}
                                                           type={'text'}
                                                           onChange={(e) => handle_filters_change(e, headCell)}
                                                    /> : <select className={'column-filter'}
                                                                 onChange={(e) => handle_filters_change(e, headCell, true)}>
                                                        <option value={''}>{props.t("all")}</option>
                                                        {headCell.filterOptions.map(x => (
                                                            <option key={x.key} value={x.key}>{props.t(x.text)}</option>))}
                                                    </select>

                                                }
                                            </>
                                        }
                                        <span>
                                        {headCell.text}
                                    </span>
                                    </div> :headCell.headerFormatter()
                                    }
                                    {/*<TableSortLabel*/}
                                    {/*    // active={orderBy === headCell.id}*/}
                                    {/*    // direction={orderBy === headCell.id ? order : 'asc'}*/}
                                    {/*    // onClick={createSortHandler(headCell.id)}*/}
                                    {/*><b>*/}
                                    {/*    {headCell.text}*/}
                                    {/*    /!*                        {orderBy === headCell.id ? (*!/*/}
                                    {/*    /!*                            <span className={classes.visuallyHidden}>*!/*/}
                                    {/*    /!*  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}*!/*/}
                                    {/*    /!*</span>*!/*/}
                                    {/*    /!*                        ) : null}*!/*/}
                                    {/*</b>*/}
                                    {/*</TableSortLabel>*/}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {items.map((row, index) => {
                            return (
                                <TableRow
                                    hover
                                    // onClick={(event) => handleClick(event, row.name)}
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={index}
                                >
                                    {columns.map((x, key2) => {
                                        let text = row[x.dataField];
                                        if (x.formatter !== undefined) {
                                            text = x.formatter(index, row)
                                        }
                                        return (<TableCell key={key2} align="right">{text}</TableCell>)
                                    })}

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                // labelRowsPerPage={props.t('display count')}
                rowsPerPageOptions={props.fixedCount !== undefined?[]:[10, 25, 50]}
                component="div"
                count={total}
                rowsPerPage={limit}
                page={current - 1}
                onChangePage={handle_on_page_change}
                onChangeRowsPerPage={handle_on_per_page_change}
                // labelDisplayedRows={({from, to, count}) => {
                //     return 'نمایش ' + from + ' تا ' + to + ' از ' + count + ' مورد';
                // }}
            />
        </Paper>
    </div>)
}

export default withTranslation()(MaterialDataTable);
