import React, {Component} from 'react';
import jMoment from 'moment-jalaali';
import {withTranslation} from 'react-i18next';
import {compose} from 'redux';

function ProcessInfo(props) {
    return (
        <div>
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td> {props.t('Title')}</td>
                    <td> {props.processInfo.PRO_TITLE ? props.processInfo.PRO_TITLE : props.t('Not Value')} </td>
                </tr>
                <tr>
                    <td> {props.t('Description')}</td>
                    <td>{props.processInfo.PRO_DESCRIPTION ? props.processInfo.PRO_DESCRIPTION : props.t('Not Value')}</td>
                </tr>
                <tr>
                    <td> {props.t('Category')}</td>
                    <td>{props.processInfo.PRO_CATEGORY_LABEL}</td>
                </tr>
                <tr>
                    <td> {props.t('Author')}</td>
                    <td>{props.processInfo.PRO_AUTHOR}</td>
                </tr>
                <tr>
                    <td>{props.t('Create Date')}</td>
                    <td>{jMoment(props.processInfo.PRO_CREATE_DATE).format('HH:mm:ss jYYYY/jMM/jDD')}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
export default withTranslation()(ProcessInfo);