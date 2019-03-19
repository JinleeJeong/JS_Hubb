import React, {Component} from 'react';
import './MyPage.css';
import { AppContext } from '../../contexts/appContext';

class MyPage extends Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			users : [],
		}

	}


	async componentDidMount() {
		this.context.actions.checkAuth();
		
		this.setState({
		  users : await this.context.actions.getUserInfomations(),
		});
	};

	render (){
		console.log(this.state.users);
		return (
			<div>
				<div>
					
				</div>
			</div>
		);
	}
}

export default MyPage;