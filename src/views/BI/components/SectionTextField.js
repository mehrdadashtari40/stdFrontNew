import React, {Component} from "react";

export default class SectionTextField extends Component {
	render() {
		return (
		      <section className={this.props.gridClass}>
                      <label className="input">
                          <i className={'icon-prepend fa '+this.props.fontAwsName}/>
                          <input type={this.props.type} value={this.props.value} id={this.props.id}
                                 name={this.props.name} placeholder={this.props.placeholder} />
                      </label>
                  </section>
            )
	}
}
