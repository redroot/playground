var React = require('react'),
		Chart = require('chart.js'),
		moment = require('moment'),
		_ = require('underscore');

module.exports = LineChart = React.createClass({
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
			<div className="grid grid__top-left chart line-chart">
				<h2 className="grid-header">Series Data</h2>
				<canvas ref="canvasEl" className="chart-canvas" width="600" height="300"></canvas>
			</div>
		);
	},
	_transformedData: function(data){
		return {
			labels: _.map(data, function(obj){ return ""; }),
			datasets: [
				{
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
					data: _.map(data, function(obj){ return obj.y })
				}
			]
		};
	},
	_initializeChart: function(props){
		var ctx = this.refs.canvasEl.getDOMNode().getContext('2d');
		var chart = new Chart(ctx).Line(this._transformedData(props.data), { 
			animation: false 
		});
		this.setState({chart: chart});
	}
});