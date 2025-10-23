import React, {useContext, useEffect} from "react";
import DatePicker from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import moment from 'jalali-moment';
import {shallowEqual, useSelector} from "react-redux";
import Select2 from "react-select2-wrapper";
import {get_tag_list} from "../_redux/layoutCrud";
import {AppConfig} from "../../../appConfig";

export default function AdvancedSearch(props) {
    const {apiServer} = useContext(AppConfig)
    let {state} = useSelector(
        (state) => ({
            state: state.layout2
        }),
        shallowEqual
    );
    let lang = localStorage.getItem('lang');
    if (lang === null) lang = 'fa';

    let fromDate = null;
    let fromDateString = "";
    if (state.fromDate !== null) {
        fromDateString = state.fromDate;
        if (lang === 'fa') fromDateString = moment(state.fromDate, 'YYYY-MM-DD').format('jYYYY-jMM-jDD');
        fromDate = {
            year: parseInt(fromDateString.split('-')[0]),
            month: parseInt(fromDateString.split('-')[1]),
            day: parseInt(fromDateString.split('-')[2]),
        }
    }
    let toDate = null;
    let toDateString = "";
    if (state.toDate !== null) {
        toDateString = state.toDate;
        if (lang === 'fa') toDateString = moment(state.toDate, 'YYYY-MM-DD').format('jYYYY-jMM-jDD')
        toDate = {
            year: parseInt(toDateString.split('-')[0]),
            month: parseInt(toDateString.split('-')[1]),
            day: parseInt(toDateString.split('-')[2]),
        }
    }

    let tags = state.tags.map(tag => {
        return {text: tag.TITLE, id: tag.ID, key: tag.ID};
    });
    useEffect(() => {
        if (state.is_tags_loading === 0) {
            props.handle_variables('is_tags_loading', 1)
            get_tag_list(apiServer).then(res => {
                let tags = Object.keys(res).map(x => {
                    return res[x];
                })
                props.tags_loaded(tags);
            })
        }
    });
    const handle_search_by_text = (text) => {
        props.load_data_with_text_search(text)
    }
    return (<ul className={'search-menu'}>
        <li>
            <div className={'col-sm-12 search-title'}>
                <input type='text'
                       onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                               handle_search_by_text(e.target.value);
                           }
                       }}
                       onBlur={(e) => handle_search_by_text(e.target.value)}
                       className={'form-control'} placeholder={props.t('search...')}/>
                <i className="fas fa-search"
                ></i>
            </div>
        </li>
        <li>
            {state.current_date_range === "" ?
                <>
                    {lang === 'fa' ? <>
                        <div className={'col-sm-6 pl-1'}>
                            <DatePicker
                                inline
                                locale={'fa'}
                                onChange={(e) => {
                                    let date = moment(e.year + '/' + e.month + '/' + e.day, 'jYYYY/jMM/jDD').locale('en').format('YYYY-MM-DD');
                                    props.handle_variables('fromDate', date);
                                    props.load_data_with_from_date(date)
                                }}
                                value={fromDate}
                                maximumDate={toDate}
                                renderInput={({ref}) => (<>
                                    <input readOnly ref={ref} value={fromDateString}
                                           placeholder={props.t('from date')}
                                           className={'form-control search-input'}/>
                                    {state.fromDate === null ? null :
                                        <i className={'fas fa-close clear-date'}
                                           onClick={() => {
                                               props.handle_variables('fromDate', null);
                                               props.load_data_with_from_date("")
                                           }}/>}
                                </>)}
                                shouldHighlightWeekends
                            />
                        </div>
                        <div className={'col-sm-6 pr-1'}>
                            <DatePicker
                                disabled={true}
                                inline
                                locale={'fa'}
                                onChange={(e) => {
                                    let date = moment(e.year + '/' + e.month + '/' + e.day, 'jYYYY/jMM/jDD').locale('en').format('YYYY-MM-DD');
                                    props.handle_variables('toDate', date);
                                    props.load_data_with_to_date(date)
                                }}
                                value={toDate}
                                minimumDate={fromDate}
                                renderInput={({ref}) => (<>
                                    <input readOnly ref={ref} value={toDateString} placeholder={props.t('to date')}
                                           className={'form-control search-input'}/>
                                    {state.toDate === null ? null :
                                        <i className={'fas fa-close clear-date'}
                                           onClick={() => {
                                               props.handle_variables('toDate', null)
                                               props.load_data_with_to_date("")
                                           }}/>}
                                </>)}
                                shouldHighlightWeekends
                            />
                        </div>
                    </> : <>
                        <div className={'col-sm-6 pl-1'}>
                            <DatePicker
                                disabled={true}
                                inline
                                locale={lang}
                                onChange={(e) => {
                                    let date = e.year + '-' + e.month + '-' + e.day;
                                    props.handle_variables('toDate', date);
                                    props.load_data_with_to_date(date)
                                }}
                                value={toDate}
                                minimumDate={fromDate}
                                renderInput={({ref}) => (<>
                                    <input readOnly ref={ref} value={toDateString} placeholder={props.t('to date')}
                                           className={'form-control search-input'}/>
                                    {state.toDate === null ? null :
                                        <i className={'fas fa-close clear-date'}
                                           onClick={() => {
                                               props.handle_variables('toDate', null)
                                               props.load_data_with_to_date("")
                                           }}/>}
                                </>)}
                                shouldHighlightWeekends
                            />
                        </div>
                        <div className={'col-sm-6 pr-1'}>
                            <DatePicker
                                inline
                                locale={lang}
                                onChange={(e) => {
                                    let date = e.year + '-' + e.month + '-' + e.day;
                                    props.handle_variables('fromDate', date);
                                    props.load_data_with_from_date(date)
                                }}
                                value={fromDate}
                                maximumDate={toDate}
                                renderInput={({ref}) => (<>
                                    <input readOnly ref={ref} value={fromDateString}
                                           placeholder={props.t('from date')}
                                           className={'form-control search-input'}/>
                                    {state.fromDate === null ? null :
                                        <i className={'fas fa-close clear-date'}
                                           onClick={() => {
                                               props.handle_variables('fromDate', null);
                                               props.load_data_with_from_date("")
                                           }}/>}
                                </>)}
                                shouldHighlightWeekends
                            />
                        </div>
                    </>}

                </> : <>
                    {lang === 'fa' ? <>
                        <div className={'col-sm-6 pl-1'}>
                            <input disabled={true} readOnly placeholder={props.t('from date')}
                                   className={'form-control search-input'}/>
                        </div>
                        <div className={'col-sm-6 pr-1'}>
                            <input disabled={true} readOnly placeholder={props.t('to date')}
                                   className={'form-control search-input'}/>
                        </div>
                    </> : <>
                        <div className={'col-sm-6 pl-1'}>
                            <input disabled={true} readOnly placeholder={props.t('to date')}
                                   className={'form-control search-input'}/>
                        </div>
                        <div className={'col-sm-6 pr-1'}>
                            <input disabled={true} readOnly placeholder={props.t('from date')}
                                   className={'form-control search-input'}/>
                        </div>
                    </>}
                </>
            }

        </li>
        <li>
            <div className={'col-sm-12 tag-box'}>
                <Select2
                    className={'tag-select'}
                    multiple
                    data={tags}
                    options={{
                        placeholder: props.t('tags'),
                    }}
                />
            </div>
        </li>
        <li>
            <div className={'col-sm-12'}>
                <select className={'form-control search-select'}
                        disabled={state.toDate !== null || state.fromDate !== null}
                        value={state.current_date_range}
                        onChange={(e) => {
                            props.handle_variables('current_date_range', e.target.value)
                            props.load_data_with_date_range(e.target.value)
                        }}>
                    <option value="">{props.t('choose date range')}</option>
                    <option value="-1 Days">{props.t('today')}</option>
                    <option value="-1 Weeks">{props.t('last week')}</option>
                    <option value="-1 Months">{props.t('last month')}</option>
                    <option value="-3 Months">{props.t('last 3 month')}</option>
                    <option value="-6 Months">{props.t('last 6 month')}</option>
                    <option value="-9 Months">{props.t('last 9 month')}</option>
                    <option value="-1 Years">{props.t('last year')}</option>
                </select>
            </div>
        </li>
        {/*<li>*/}
        {/*    <div className={'col-sm-12 text-left'} style={{flexDirection: "row-reverse"}}>*/}
        {/*        <button className={'btn btn-green'}>جستجو</button>*/}
        {/*    </div>*/}
        {/*</li>*/}
    </ul>)
}