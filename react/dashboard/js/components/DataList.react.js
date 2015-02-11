var React = require('react'),
		_ = require('underscore');

module.exports = DataList = React.createClass({
	render: function(){
		return (
			<div className="grid grid__bottom-right">
				Im a list of data
				{JSON.stringify(_.first(this.props.data,[10]))}
			</div>
		);
	}
});