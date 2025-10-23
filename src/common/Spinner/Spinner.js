
import React, { Component } from 'react';

class Spinner extends Component{
	render() {
		return (
			<div className="spinner" >
				<i className="fa fa-spin fa-spinner fa-2x"></i>
				<b> ... درحال بارگزاری </b>
			</div>
		);
	}
}

export default Spinner;