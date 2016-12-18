import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Header from './frame/Header.js';

import Friend from './page/Friend.js';
import Room from './page/Room.js';
import MyInfo from './page/MyInfo.js';
import SignIn from './page/SignIn.js';
import Join from './page/Join.js';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			childrenData : null
		};
	}

	componentWillUnmount() {
		if (this.serverRequest) {
			this.serverRequest.abort();
		}
	}

	render() {
		if (auth.principal === 'anonymousUser') {
			if (this.props.location.pathname === '/join') {
				return (<Join />);
			}
			return(<SignIn />);
		}
		return (
			<div>
				<Header />
				{React.cloneElement(this.props.children, {childrenData: this.state.childrenData})}
			</div>
		);
	}
}

ReactDOM.render((
		<Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Friend}></IndexRoute>
				<Route path="/myInfo" component={MyInfo}></Route>
				<Route path="/users" component={Friend}></Route>
				<Route path="/rooms(/:childrenData)" component={Room}></Route>
				<Route path="/join" component={Join}></Route>
				<Route path="/signin" component={SignIn}></Route>
			</Route>
		</Router>
), document.getElementById('app'));
