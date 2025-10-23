import React, { Component } from 'react';
import _ from 'lodash';
import $ from 'jquery'
class DataTablePaged extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Users: [],
			total: null,
			limit: null,
			current: null,
			pageCount: null,
			startPage: null,
			endPage: null,
			startIndex: null,
			endIndex: null,
			refresh: false,
			filter: '',
		};
		this.datatable = this.datatable.bind(this);
	}

	componentDidMount() {
		this.setState({
			Users: this.props.data,
		});
		this.setState(
			{
				total: this.props.pagination.total,
				limit: this.props.pagination.limit,
				current: this.props.pagination.current != null ? this.props.pagination.current : 1,
				Users: this.props.data,
				pageCount: this.getPageCount(this.props.pagination.total, this.props.pagination.limit),
				refresh: false,
			},
			() => {
				this.calcutePageIndex();
			}
		);
	}

	setParams = object => {
		let self = this;
		return new Promise(function(resolve, reject) {
			if (!self.isEmpty(object)) {
				self.setState(object);
				resolve(true);
			} else {
				reject();
			}
		});
	};

	isEmpty = obj => {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	};

	componentWillReceiveProps(newProps) {
		if (this.props.filter != newProps.filter) {
			let self = this;
			this.setParams({ filter: newProps.filter }).then(function(res) {
				self.getItems(10);
			});
		}

		if (newProps.refresh == true && !this.state.refresh) {
			this.setState({
				refresh: true,
			});
		} else {
			this.setState({
				refresh: false,
			});
		}
	}

	getItems = (limit, start = 0, filter = '', current) => {
		if (start == 0) this.setState({ current: start / limit + 1 });

		this.props.getDataList(
			this.props.action,
			start,
			limit,
			this.props.filter,
			this.props.sort,
			this.props.dir,
			this.props.cat_uid,
			this.props.pro_uid,
			filter,
			this.props.dateFrom,
			this.props.dateTo,
			this.props.newerThan,
			current
		);
	};

	changePaginateSize = e => {
		this.setState({
			limit: e.target.value,
		});
		this.getItems(e.target.value, 0, this.state.filter, 1);
	};

	calcutePageIndex = () => {
		if (this.state.current <= 5) {
			const pageCount = this.state.pageCount;
			let end = this.state.current + 4 < this.state.pageCount ? this.state.current + 4 : this.state.pageCount;
			this.setState({
				startIndex: 1,
				endIndex: end,
			});
		} else if (this.state.current > 5) {
			let start = this.state.current - 4;
			let end = this.state.current + 3 < this.state.pageCount ? this.state.current + 3 : this.state.pageCount;
			// this.state.pageCount;
			this.setState({
				startIndex: start,
				endIndex: end,
			});
		}
	};

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
				sEmptyTable: 'اطلاعاتی ثبت نگردیده است',
				sInfo: '_START_ تا _END_ از _TOTAL_',
				sInfoEmpty: '0 از 0',
				sInfoFiltered: '(از _MAX_ رکورد فیلتر شده)',
				sInfoPostFix: '',
				sInfoThousands: '.',
				sLengthMenu: 'نمایش _MENU_ رکورد',
				sLoadingRecords: 'در حال بارگذاری...',
				sProcessing: 'در حال پردازش...',
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

		if (this.props.filterDataTable) {
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
		let pagination = null;
		if (this.props.data.length > 0) {
			var tmp = [];
			for (var i = this.state.startIndex; i <= this.state.endIndex; i++) tmp.push(this.getPageinateCountItem(i));

			pagination = (
				<ul className="pagination">
					<li className="paginate_button first">
						<a aria-controls="DataTables_Table_7" data-dt-idx="0" tabIndex="0" onClick={this.firstPage}>
							اولین
						</a>
					</li>
					<li className="paginate_button previous">
						<a aria-controls="DataTables_Table_7" data-dt-idx="0" tabIndex="0" onClick={this.previusPage}>
							قبلی
						</a>
					</li>
					{tmp}
					<li className="paginate_button next">
						<a aria-controls="DataTables_Table_7" data-dt-idx="6" tabIndex="0" onClick={this.nextPage}>
							بعدی
						</a>
					</li>
					<li className="paginate_button last">
						<a aria-controls="DataTables_Table_7" data-dt-idx="0" tabIndex="0" onClick={this.lastPage}>
							آخرین
						</a>
					</li>
				</ul>
			);
		}

		return (
			<div>
				<table
					className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline"
					width="100%"
					filter="true"
					id="DataTables_Table_7"
					role="grid"
					aria-describedby="DataTables_Table_7_info"
				>
					{this.props.children}
				</table>

				<div className="dt-toolbar-footer">
					<div className="col-sm-4 col-xs-12 hidden-xs pull-right">
						<div className="dataTables_length" id="DataTables_Table_7_length" style={{display:"flex"}}>

							<div className="recordLabel" style={{margin:10}}>نمایش تعداد رکورد در هرصفحه</div>

							<select
								name="DataTables_Table_7_length"
								aria-controls="DataTables_Table_7"
								value={this.state.limit === null?"":this.state.limit}
								className="form-control input-sm"
								id="dataTableSize"
								onChange={this.changePaginateSize}
							>
								<option value="10">10</option>
								<option value="25">25</option>
								<option value="50">50</option>
								<option value="100">100</option>
							</select>
						</div>
					</div>
					<div className="col-xs-10 col-sm-6 pagination-centered">
						<div className="dataTables_paginate paging_simple_numbers" id="DataTables_Table_7_paginate">
							{pagination}
						</div>
					</div>
				</div>
			</div>
		);
	}

	getPageCount(total_items, limit) {
		return Math.ceil(total_items / limit);
	}

	getPageinateCountItem = i => {
		return (
			<li className={`paginate_button ${this.state.current == i ? 'active' : ''}`} key={i}>
				<a aria-controls="DataTables_Table_7" data-dt-idx="0" tabIndex="0" onClick={() => this.clickOnPage(i)}>
					{i}
				</a>
			</li>
		);
	};

	clickOnPage = index => {
		this.setState({ current: index });

		const start = this.state.limit * (index - 1);
		this.getItems(this.state.limit, start, this.props.pagination.filter, index);
	};

	previusPage = () => {
		if (this.state.current > 1) this.clickOnPage(this.state.current - 1);
	};

	nextPage = () => {
		if (this.getPageCount(this.state.total, this.state.limit) > this.state.current)
			this.clickOnPage(this.state.current + 1);
	};

	firstPage = () => {
		this.clickOnPage(1);
	};

	lastPage = () => {
		this.clickOnPage(this.getPageCount(this.state.total, this.state.limit));
	};
}

export default DataTablePaged;
