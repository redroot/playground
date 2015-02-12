var React = require('react'),
		Chart = require('chart.js'),
		moment = require('moment'),
		_ = require('underscore');

module.exports = BarChart = React.createClass({
	componentDidMount: function() {
		this._initializeChart(this.props);
	},
	componentWillReceiveProps: function(nextProps) {
		var chart = this.state.chart;
		chart.destroy();
		this._initializeChart(nextProps);
	},
	componentWillUnmount: function() {
		var chart = this.state.chart;
		chart.destroy();
	},
	render: function(){
		return (
			<div className="grid grid__bottom-left chart bar-chart">
				<h2 className="grid-header">Banded Data</h2>
				<canvas ref="canvasEl" className="chart-canvas" width="600" height="300"></canvas>
			</div>
		);
	},
	_transformedData: function(data){
		return {
			labels: _.keys(data),
			datasets: [
				{
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
					data: _.values(data)
				}
			]
		};
	},
	_initializeChart: function(props){
		var ctx = this.refs.canvasEl.getDOMNode().getContext('2d');
		var chart = new Chart(ctx).Bar(this._transformedData(props.data), { 
			animation: false 
		});
		this.setState({chart: chart});
	}
});