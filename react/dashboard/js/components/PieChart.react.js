var React = require('react');

module.exports = PieChart = React.createClass({
	render: function(){
		return (
			<div className="grid grid__top-right chart line-chart">
				Im a pie chart!
				{JSON.stringify(this.props.data)}
			</div>
		);
	}
});