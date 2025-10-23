import React, {Component} from 'react'
import Datatable from '../../../components/tables/Datatable'
import LanguageStore from "../../../components/i18n/LanguageStore";
import ModalForm from "./ModalForm";

export default class DataTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			Edit: false,
			Show: [],
			data: props.data,
			structure: [],
			refresh: false,
			datatable: false,
			editRowData: [],
			newRowData: [],
			formElement: null,
			newRecord: false
		};
	}

	componentWillMount() {
		this.setState({
			datatable: false
		});
	}

	componentDidMount() {
		this.setState({datatable: true});
		var self = this;
		$(document).ready(function () {
			$(document).delegate('.deleteRow', 'click', function () {
				const id = $(this).attr('rowId');
				self.props.deleteRow(id);

			});

			$(document).delegate('.updateRow', 'click', function () {
				$('#editRowModal').modal('show');
				const id = $(this).attr('rowId');
				self.getRowItemDetails(id);
				self.props.editItem(id);
			});
		});
	}

	// TODO : Get Row Item with id
	getRowItemDetails = (id) => {
		var uniqueKey = this.props.primaryKey;
		var editRowData = null;
		this.props.data.forEach((item) => {
			if (item[uniqueKey] == id) {
				editRowData = item;
			}
		});

		if (uniqueKey) {
			var dt = [];
			dt.push(editRowData)
			this.setState({
				editRowData: dt,
				Edit: true
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

	componentWillReceiveProps(nextProps) {
		if (this.props.data !== nextProps.data) {
			this.setState({
				datatable: true,
			});

		} else {
			this.setState({
				datatable: false
			});
			// return false;
		}
		if (this.props.newRecord) {
			this.setState({
				newRecord: true
			});
		}

	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.data !== nextProps.data) {
			this.setState({
				datatable: true,
			});
			return true;
		} else {
			this.setState({
				datatable: false
			});
			return false;
		}
	}

	/**
	 *  TODO : ‌submit create or edit rows
	 **/
	onSubmit = () => {
		var uniqueKey = null;
		let sendData = {};
		sendData['table_name'] = this.props.tableName;
		this.props.structure.map((item) => {
			if (item.ai == 'no') {
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
				this.props.updateItem(recordId, sendData);
			}
			return;
		}

		this.props.addNew(sendData);
	}

	render() {
		let column = [];
		if (this.props.structure.length > 0) {
			var uniqueField = null;
			this.props.structure.map((item) => {
                        if (item.ai == 'yes') {
                              uniqueField = item.name;
                        }

                        let obj1 = {
                        	"class": item.ai == 'yes' ? 'service-id hidden' : '',
	                        "data": null,
	                        "render": function (data) {
                        if (item.ai == 'yes')
                            return "<input class='case-select' type='checkbox' value='" + data[item.name] + "'>";
                        else
                            return '<div>' + (data[item.name] ? data[item.name] : 'No data') + '</div>';
                    }
                        }

                        column.push(obj1);
			});
			const actions = {
				"class": '',
                        "data": null,
                        "render": function (data) {
                    return '<button type="button" rowId="' + data[uniqueField] + '" class="btn btn-danger btn-xs deleteRow"><i class="fa fa-trash"></i></button><span> </span>' +
                        '<button type="button" rowId="' + data[uniqueField] + '" class="btn btn-primary btn-xs updateRow"><i class="fa fa-pencil"></i></button>';
                }
			};

			column.push(actions);
		}

		// TODO :‌ Open Modal
		let formContent = null;

		if (this.state.newRowData && this.state.newRowData != null){
		// if (!this.state.Edit) {
		// if (!this.props.editItemData) {
			formContent = <ModalForm data={this.state.newRowData} edit={false}
			                         structure={this.props.structure} submit={()=>this.onSubmit()}/>
		}

		let options = null;
		let dataTable = null;
		if (this.props.data.length > 0 && this.props.structure.length > 0) {
			options = {
				"data": this.props.data,
				"iDisplayLength": 10,
				"columns": column,
				"order": [],
				"rowID": "",
				"buttons": false
			};

			dataTable = <Datatable
						options={options}
						paginationLength={true}
						className="table table-striped table-bordered table-hover"
						width="100%"
						filter={true}>
					<thead>
					<tr>
						{this.props.structure.map(t => {
							return <th
								className={'' + t.ai == 'yes' ? 'hidden' : 'hasinput'}
								style={{width: "10%"}}>
								<input
									id="dateselect_filter"
									type="text"
									placeholder={t.label}
									className="form-control "/>
							</th>
						})
						}
						<th style={{width: "3%"}}></th>

					</tr>

					<tr>
						{this.props.structure.map(x => {
							return <th
								data-hide="phone">
								<i className={'fa fa-fw fa-qb text-muted hidden-md hidden-sm hidden-xs ' + x.ai == 'yes' ? 'hidden' : ''}/>
								{x.name}
							</th>
						})}
						<th style={{width: "3%"}}>عملیات</th>
					</tr>
					</thead>
				</Datatable>;
		}

		return (
			<div>
				{dataTable}
				<div className="modal fade" id="editRowModal" tabIndex="-1" role="dialog"
				     aria-labelledby="ServiceModalLabel" aria-hidden="true">
					<div className="modal-dialog" style={{width: "65%"}}>
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
									&times;
								</button>
								<h4 className="modal-title"
								    style={{display: "inline-block"}}
								    id="ServiceModalLabel">{LanguageStore.translate('Show Details')}</h4>
							</div>
							<div className="">
								{formContent}
							</div>
							<div className="modal-footer">
								<button type="button" className="btn_inbox btn_datatable" data-dismiss="modal">
									<i className="fa fa-window-close "></i>
									{LanguageStore.translate('Close')}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
    }
}
