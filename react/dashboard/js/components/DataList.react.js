var React = require('react'),
		DashboardActions = require('../actions/DashboardActions'),
		moment = require('moment'),
		_ = require('underscore');

module.exports = DataList = React.createClass({
	newRandomData: function(){
		var time  = moment().unix(),
				value = Math.floor(Math.random() * 100);

		DashboardActions.addDataPoint(time,value);
	},
	componentDidMount: function() {
		setInterval(function(){
			console.log('adding random data');
			this.newRandomData();
		}.bind(this),15000);
	},
	render: function(){
		return (
			<div className="grid grid__bottom-right">
				<h2 className="data-list-header">
					Last 12 data points
					<button type="button" className="btn js-new-data-btn" onClick={this.newRandomData} >
						Add Random Data
					</button>
				</h2>
				<ul className="data-list">
				{_.map(_.last(this.props.data,[12]).reverse(),function(data){
					return (
						<li key={data.x + (Math.floor(Math.random() * 10000))} className="data-list-element">
							<em>{data.y}</em>
							<small className="data-list-element-timestamp">
								{moment(data.x*1000).fromNow()}
							</small>
						</li>
					);
				})}
				</ul>
			</div>
		);
	}
});