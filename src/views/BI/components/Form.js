import React, { Component } from 'react';
import SectionTextField from './SectionTextField';
import { withTranslation } from 'react-i18next';

export default class Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			structure: [],
			data: {},
		};
	}

	render() {
		let formSection = [];
		if (this.state.structure) {
			var uniqueField = null;
			this.props.structure.map((item, index) => {
				if (item.ai == 'yes') {
					uniqueField = item.name;
				} else {
					const elmItem = (
						<SectionTextField
							key={index}
							name={item.name}
							id={item.name}
							type="text"
							value={null}
							fontAwsName={'fa-user'}
							gridClass={'col-lg-6'}
							placeholder={item.name}
						/>
					);
					formSection.push(elmItem);
				}
			});
		}
		return <div>{formSection}</div>;
	}
}
