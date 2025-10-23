import React, { Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';
export default class Datatable extends Component {
	constructor(props) {
		super(props);
		this.datatable = this.datatable.bind(this);
	}

	componentDidMount() {
		import('smartadmin-plugins/datatables-bundle/datatables.min.js').then(() => {
			setTimeout(() => {
				this.datatable(this.props.options.data);
			}, 500);
		});
		this.forceUpdate();
	}

	componentWillReceiveProps(newProps) {
		const element = $(this.refs.table);
		let options = newProps.options;
		let toolbar = '';
		if (options.buttons) toolbar += 'B';
		if (this.props.paginationLength) toolbar += 'l';
		if (this.props.columnsHide) toolbar += 'C';

		// "dom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>" +
		if (typeof options.ajax === 'string') {
			let url = options.ajax;
			options.ajax = {
				url: url,
				type: 'POST',
				complete: function(xhr) {
					// AjaxActions.contentLoaded(xhr)
				},
			};
		}
		// "dom": "<'dt-toolbar'<'col-xs-12 col-sm-6'><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>"  +
		// "t" +
		// "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
		// this.props.fullTextSearch ? "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>" :
		options = _.extend(options, {
			dom:
				' ' +
				't' +
				"<'dt-toolbar-footer'<'col-sm-2 col-xs-12 hidden-xs pull-right'" +
				toolbar +
				"><'col-sm-4 col-xs-12 hidden-xs pull-right'i><'col-xs-10 col-sm-6 pagination-centered'p>>",
			oLanguage: {
				sSearch: "<span class='input-group-addon input-sm'><i class='glyphicon glyphicon-search'></i></span> ",
				//"sLengthMenu": "_MENU_",
				sEmptyTable: 'اطلاعاتی ثبت نگردیده است',
				sInfo: '_START_ تا _END_ از _TOTAL_',
				sInfoEmpty: '0 از 0',
				sInfoFiltered: '(از _MAX_ رکورد فیلتر شده)',
				sInfoPostFix: '',
				sInfoThousands: '.',
				sLengthMenu: 'نمایش _MENU_ رکورد',
				sLoadingRecords: 'در حال بارگذاری...',
				sProcessing: 'در حال پردازش...',
				//"sSearch": "جستجو",
				sZeroRecords: 'هیچ رکوردی یافت نشد',
				oPaginate: {
					sFirst: 'اولین',
					sPrevious: 'قبلی',
					sNext: 'بعدی',
					sLast: 'آخرین',
				},
				oAria: {
					sSortAscending: ': مرتب سازی',
					sSortDescending: ': مرتب سازی',
				},
			},

			autoWidth: false,
			retrieve: true,
			responsive: true,
			destroy: true,
		});
		if (options.data === undefined) options.data = [];
		// const _dataTable = element.DataTable(options);
		// _dataTable.clear().draw();
		// _dataTable.rows.add(options.data); // Add new data
		// _dataTable.columns.adjust().draw();
	}

	datatable() {
		const element = $(this.refs.table);
		let { options, showAct, fullTextSearch } = { ...this.props } || {};
		let toolbar = '';
		if (options.buttons) toolbar += 'B';
		if (this.props.paginationLength) toolbar += 'l';
		if (this.props.columnsHide) toolbar += 'C';

		if (typeof options.ajax === 'string') {
			let url = options.ajax;
			options.ajax = {
				url: url,
				type: 'POST',
				complete: function(xhr) {
					// AjaxActions.contentLoaded(xhr)
				},
			};
		}
		{
			/*<'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r*/
		}
		// "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>", // change
		// "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>"
		options = _.extend(options, {
			dom:
				' ' +
				't' +
				"<'dt-toolbar-footer'<'col-sm-2 col-xs-12 hidden-xs pull-right'" +
				toolbar +
				"><'col-sm-4 col-xs-12 hidden-xs pull-right'i><'col-xs-10 col-sm-6 pagination-centered'p>>",
			oLanguage: {
				sSearch: "<span class='input-group-addon input-sm'><i class='glyphicon glyphicon-search'></i></span> ",
				//"sLengthMenu": "_MENU_",
				sEmptyTable: 'اطلاعاتی ثبت نگردیده است',
				sInfo: '_START_ تا _END_ از _TOTAL_',
				sInfoEmpty: '0 از 0',
				sInfoFiltered: '(از _MAX_ رکورد فیلتر شده)',
				sInfoPostFix: '',
				sInfoThousands: '.',
				sLengthMenu: 'نمایش _MENU_ رکورد',
				sLoadingRecords: 'در حال بارگذاری...',
				sProcessing: 'در حال پردازش...',
				//"sSearch": "جستجو",
				sZeroRecords: 'هیچ رکوردی یافت نشد',
				oPaginate: {
					sFirst: 'اولین',
					sPrevious: 'قبلی',
					sNext: 'بعدی',
					sLast: 'آخرین',
				},
				oAria: {
					sSortAscending: ': مرتب سازی',
					sSortDescending: ': مرتب سازی',
				},
			},

			autoWidth: false,
			retrieve: true,
			responsive: true,
			destroy: true,
		});

		const _dataTable = element.DataTable(options);

		if (this.props.filter) {
			// Apply the filter
			element.on('keyup change', 'thead th input[type=text]', function() {
				_dataTable
					.column(
						$(this)
							.parent()
							.index() + ':visible'
					)
					.search(this.value)
					.draw();
			});
		}

		// if (!toolbar) {
		//   element.parent().find(".dt-toolbar").append('<div class="text-right"><img src="assets/img/logo.png" alt="ArianNovinCo" style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>');
		// }
		if (this.props.showAct) {
			element.on('dblclick', 'td', function() {
				const data = _dataTable.row($(this).parents('tr')).data();
				showAct(data);
			});
		}

		if (this.props.detailsFormat) {
			const format = this.props.detailsFormat;
			element.on('click', 'td.details-control', function() {
				const tr = $(this).closest('tr');
				const row = _dataTable.row(tr);
				if (row.child.isShown()) {
					row.child.hide();
					tr.removeClass('shown');
				} else {
					row.child(format(row.data())).show();
					tr.addClass('shown');
				}
			});
		}
		if (options.rowID) {
			element.on('dblclick', 'td.row-controller', function() {
				const id = $(this)
					.siblings(options.rowID)
					.html();
				window.location.replace('#/outlook/detail/' + id);
			});
		}
	}

	render() {
		let { children, options, showAct, detailsFormat, paginationLength, ...props } = this.props;
		return (
			<table {...props} ref="table">
				{children}
			</table>
		);
	}
}
// Comments
/**
 *  @H.J TODO : Add fullTextSearch option to Datatable
 **/
