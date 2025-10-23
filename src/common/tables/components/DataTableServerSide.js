import React, { Component } from 'react';
import _ from 'lodash';
import getAuthonticatedJSON from '../../utils/functions/getAuthenticatedJSON';


class DataTableServerSide extends Component {
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
	}

	componentDidMount() {
		this.getItems(10);
	}

	setParams = object => {
		let self = this;
		return new Promise(function(resolve, reject) {
			if (!self.isEmpty(object)) {
				// Object is NOT empty
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
			// if(this.state.filter != newProps.filter){
			// 	this.setState({ filter : "" });
			let self = this;
			this.setParams({ filter: newProps.filter }).then(function(res) {
				self.getItems(10);
			});
		}

		if (newProps.refresh && !this.state.refresh) {
			this.setState({
				refresh: true,
			});
			// const limit = this.state.limit;
			// const start = this.state.limit * this.state.current;
			// this.getItems(limit,start);
		} else {
			this.setState({
				refresh: false,
			});
		}
		setTimeout(() => {
			if(this.state.refresh == true){
				const limit = this.state.limit;
				const start = 0;
				const filter = this.state.filter;
				this.getItems(limit,start,filter);
			}
		},0);
	}

	getItems = (limit, start = 0, filter = '') => {
		if (start == 0) this.setState({ current: 1 });

		let self = this;
		let token = localStorage.getItem('access_token');
		let URL = this.props.url + '?limit=' + limit + '&start=' + start + '&filter=' + filter;
		getAuthonticatedJSON(URL, token).then(res => {
			// this.setState({ });
			self.setState({
				total: res.total,
				limit: res.limit,
				Users: res.data,
				pageCount: self.getPageCount(res.total, res.limit),
				refresh: false,
			});

			self.calcutePageIndex();
			// self.props.getUsersList(res.data);
			self.props.getDataList(res.data);
			self.setState({
				refresh: false,
			});
		});
	};

	changePaginateSize = e => {
		this.setState({
			limit: e.target.value,
		});
		this.getItems(e.target.value, 0, this.state.filter);
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
			let end = this.state.current + 4 < this.state.pageCount ? this.state.current + 4 : this.state.pageCount;
			// this.state.pageCount;
			this.setState({
				startIndex: start,
				endIndex: end,
			});
		}
	};

	render() {
		let pagination = null;
		if (this.state.Users.length > 0) {
			var tmp = [];
			for (var i = this.state.startIndex; i <= this.state.endIndex; i++) tmp.push(this.getPageinateCountItem(i));


			pagination =
				<ul className="pagination">
                    <li className="paginate_button first">
                        <a aria-controls="DataTables_Table_7"
                           data-dt-idx="0"
                           tabIndex="0"
                           onClick={this.firstPage}>اولین</a>
                    </li>
					<li className="paginate_button previous">
						<a aria-controls="DataTables_Table_7"
						   data-dt-idx="0"
						   tabindex="0"
						   onClick={this.previusPage}>قبلی</a>
					</li>
					{tmp}
					<li className="paginate_button next">
						<a aria-controls="DataTables_Table_7"
						   data-dt-idx="6"
						   tabindex="0"
						   onClick={this.nextPage}>بعدی</a>
					</li>
                    <li className="paginate_button last">
                        <a aria-controls="DataTables_Table_7"
                           data-dt-idx="0"
                           tabIndex="0"
                           onClick={this.lastPage}>آخرین</a>
                    </li>

				</ul>
		}

		return (
			<div>
				<table
					className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline"
					width="100%"
					filter="true"
					id="DataTables_Table_7"
					role="grid"
					aria-describedby="DataTables_Table_7_info">
					{this.props.children}
				</table>

				<div className="dt-toolbar-footer">
					<div className="col-sm-2 col-xs-12 hidden-xs pull-right">
						<div className="dataTables_length"
						     id="DataTables_Table_7_length">
							<label>نمایش
								<select
									name="DataTables_Table_7_length"
									aria-controls="DataTables_Table_7"
									className="form-control input-sm"
									onChange={this.changePaginateSize}
								>
									<option value="10">10</option>
									<option value="25">25</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>{' '}
								رکورد
							</label>
						</div>
					</div>
					<div className="col-xs-10 col-sm-6 pagination-centered">
						<div className="dataTables_paginate paging_simple_numbers"
						     id="DataTables_Table_7_paginate">
							{pagination}
						</div>
					</div>
				</div>
			</div>
		);
	}

	getPageCount(total_items, limit) {
		// return 20;
		return Math.ceil(total_items / limit);
	}

	getPageinateCountItem = (i) => {
		return <li
			className={`paginate_button ${this.state.current == i ? 'active' : ''}`}
			key={i}>
			<a aria-controls="DataTables_Table_7"
			   data-dt-idx="0"
			   tabindex="0"
			   onClick={() => this.clickOnPage(i)}>
				{i}
			</a>
		</li>;
	}

	clickOnPage = index => {
		this.setState({ current: index });
		const start = this.state.limit * (index - 1);
		this.getItems(this.state.limit, start);
		// this.calcutePageIndex();
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

export default DataTableServerSide;
