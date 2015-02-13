var React = require('react/addons'),
		DashboardActions = require('../actions/DashboardActions'),
		moment = require('moment'),
		_ = require('underscore');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

module.exports = DataList = React.createClass({
	newRandomData: function(){
		var time  = moment().unix(),
				value = Math.floor(Math.random() * 100);

		DashboardActions.addDataPoint(time,value);
	},
	componentDidMount: function() {
		setInterval(function(){
			this.newRandomData();
		}.bind(this),3000);
	},
	render: function(){
		return (
			<div className="grid grid__bottom-right">
				<h2 className="grid-header">
					Last 12 data points
					<button type="button" className="btn js-new-data-btn" onClick={this.newRandomData} >
						Add Random Data
					</button>
				</h2>
				<ReactCSSTransitionGroup component="ul" className="data-list" transitionName="data-list-trans">
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
				</ReactCSSTransitionGroup>
			</div>
		);
	}
});