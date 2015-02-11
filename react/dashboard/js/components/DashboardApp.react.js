var React = require('react'),
		DataStore = require('../stores/DataStore'),
		DataList = require('./DataList.react'),
		BarChart = require('./BarChart.react'),
		PieChart = require('./PieChart.react'),
		LineChart = require('./LineChart.react');


module.exports = DashboardApp = React.createClass({
	getInitialState: function(){
		return {
			data: DataStore.getData()
		}
	},
	componentDidMount: function() {
		DataStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		DataStore.removeChangeListener(this._onChange);
	},
	render: function(){
		return (
			<div className="dashboard">
				<LineChart data={this.state.data} />
				<BarChart data={this.state.data} />
				<PieChart data={this.state.data} />
				<DataList data={this.state.data} />
			</div>
		);
	},
	_onChange: function(){
		this.setState({
			data: DataStore.getData()
		});
	}
});