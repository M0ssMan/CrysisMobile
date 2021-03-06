import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableHighlight
} from 'react-native';

import { sendUserStatus } from '../helpers/helperAPI';
import lowDebounce from 'lodash/debounce';
import red from '../assets/red.png';

class CheckIn extends Component {
	constructor(props) {
		super(props)
		this.state = {
			needHelp: false
		}
	}

	navigateSafe() {
		var self = this;
		console.log("safe button pushed");
		sendUserStatus('safe')
			.then(function(){
				console.log("inside of .then of sendUserStatus for safe")
				self.hideHelpMessage();
				self.props.navigator.push({
					name: 'Attendance'
				})
			})
			.catch(function(err){
				console.error("error inside of sendUserStatus", err);
			})
	}

	navigateHelp() {
		var self = this;
		console.log("help button pushed");
		sendUserStatus('inDanger')
			.then(function(){
				console.log("inside of .then of sendUserStatus for inDanger");
				self.helpMessage();
			})
	}

	hideHelpMessage() {
		this.setState({needHelp: false}, function() {
		})
	}

	helpMessage() {
		this.setState({needHelp: true}, function() {
		})
	}

	render() {
		var helpFeedback;
			if (this.state.needHelp) {
				helpFeedback = styles.helpFeedbackShow;
			} else {
				helpFeedback = styles.helpFeedbackHide
			}
		let navigateSafe = lowDebounce(this.navigateSafe.bind(this), 1000);
		return (
			<Image style={styles.container} source={red}>
				<View>
					<Text style={styles.title}>Check In</Text>
				</View>
				<View style={styles.buttons}>
					<TouchableHighlight
						onPress={navigateSafe}
						style={styles.safe}>
						<Text style={styles.buttonText}>SAFE</Text>
					</TouchableHighlight>

					<TouchableHighlight
						onPress={this.navigateHelp.bind(this)}
						style={styles.help}>
						<Text style={styles.buttonText}>HELP</Text>
					</TouchableHighlight>
				</View>
					<View>
        		<Text style={helpFeedback}>Help Alert Sent</Text>
        	</View>
			</Image>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
    width: null,
    height: null
	},
	title: {
		fontFamily: 'courier',
		padding: 15,
		color: '#fff',
		fontSize: 60,
		fontWeight: 'bold'
	},
	buttons: {
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'center'
	},
	help: {
		width: 100,
		height: 100,
		marginLeft: 20,
		backgroundColor: '#FE3C3C',
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  safe: {
  	width: 100,
		height: 100,
		marginRight: 20,
	  backgroundColor: '#3ED715',
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'courier',
    fontWeight: 'bold',
		alignSelf: 'center',
		paddingTop: 35,
  },
  helpFeedbackShow: {
		backgroundColor: 'gray',
		alignSelf: 'center',
		justifyContent: 'center',
		padding: 10,
		borderRadius: 5,
		color: '#fff',
    fontSize: 30,
    fontFamily: 'courier',
    fontWeight: 'bold',
		alignSelf: 'center'
  },
  helpFeedbackHide: {
  	color: 'transparent',
    fontSize: 30,
    fontFamily: 'courier',
    fontWeight: 'bold',
		alignSelf: 'center'
  }
})

export default CheckIn;
