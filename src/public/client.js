import React from 'react';
import ReactDOM from 'react-dom';
import './css/base.css';


const Button = React.createClass ({
	getInitialState: function(){
		return {
			bgColor: 'white'
		}
	},
	handleClick: function(evt){
		const newColor = this.state.bgColor == 'white' ? 'red' : 'white';
		this.setState({
			bgColor: newColor
		})
	},
	render : function (){
		return {
			<div>
				<button
					onClick={this.handleClick}
					style={{backgroundColor: this.state.bgColor}}>Button</button>
			</div>
		}
	}
})

ReactDOM.render(<Button />, document.getElementById('background'));

// function formatName(user){
// 	return user.firstName + ' ' + user.lastName;
// }

// const user = {
// 	firstName: 'Harper',
// 	lastName: 'Perez'
// };

// const element = <h1>Hello, {formalName(user)}!</h1> 

// ReactDOM.render(
// 	element,
// 	document.getElementById('background')
// );