import React, {Component} from 'react';
import LanguageStore from "../../../components/i18n/LanguageStore";
import Form from "./Form";
import { withTranslation } from 'react-i18next';

export default class ModalForm extends Component {

	onSubmit = () => {
		this.props.submit();
	}

	render() {
		let formElements = null;
		if (this.props.edit) {
		    formElements = <Form edit={true} structure={this.props.structure} />;
		} else {
		    formElements = <Form edit={false} structure={this.props.structure} />;
		}

		return(<form id="new-user-form" className="smart-form" noValidate="novalidate">
				<div>
					<fieldset>
						<div className="row" style={{marginTop:'10px'}}>
							{formElements}
						</div>
					</fieldset>
					<footer>
						<button type="button" onClick={ () => this.onSubmit() } className="btn btn-success"><i
							className="fa fa-check"></i>
							{this.props.t('Submit')}
						</button>
					</footer>
				</div>
			</form>)
    }
}


