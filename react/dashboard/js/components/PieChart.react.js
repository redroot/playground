var React = require('react'),
		Chart = require('chart.js'),
		moment = require('moment'),
		ColorScheme = require('color-scheme'),
		_ = require('underscore');


var _scheme = new ColorScheme;
_scheme.from_hue(21)         
      .scheme('triade')   
      .variation('soft');
var _colors = _scheme.colors();

module.exports = PieChart = React.createClass({
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
			<div className="grid grid__top-right chart bar-chart">
				<h2 className="grid-header">Banded Data</h2>
				<canvas ref="canvasEl" className="chart-canvas" width="600" height="300"></canvas>
			</div>
		);
	},
	_transformedData: function(data){
		var colorIndex = -1;
		return _.map(_.keys(data),function(key){
			colorIndex++;
			if(colorIndex > _colors.length - 1) {
				colorIndex = -1;
			}
			return {
				value: data[key],
				label: key,
				color: "#" + _colors[colorIndex],
        highlight: "#5A5A5A"
			}
		});
	},
	_initializeChart: function(props){
		var ctx = this.refs.canvasEl.getDOMNode().getContext('2d');
		var chart = new Chart(ctx).Pie(this._transformedData(props.data), { 
			animation: false 
		});
		this.setState({chart: chart});
	}
});