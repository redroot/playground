var React = require('react'),
		DataStore = require('../stores/DataStore');

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
				I am a dashboard
				{JSON.stringify(this.state.data)}
			</div>
		);
	},
	_onChange: function(){
		this.setState({
			data: DataStore.getData()
		});
	}
});