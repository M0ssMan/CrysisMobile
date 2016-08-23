import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  PushNotificationIOS,
  AppState,
  AlertIOS,
  Text,
  View
} from 'react-native';

import { registerPush } from './src/helpers/helperPushNotification';
import { getFromStorage } from './src/helpers/helperLocalStorage';
import { getStatusList, checkIfAuthenticated, getEmergencyStatus } from './src/helpers/helperAPI'

import Loading from './src/Components/Loading';
import Home from './src/Components/Home';
import CheckIn from './src/Components/CheckIn';
import Attendance from './src/Components/Attendance';
import Login from './src/Components/Login';

class crysis extends Component {
  constructor(props){
    super(props)
    this.state = {
      isAuthenticated: false,
      employeeStatusData: null,
      inEmergency: false,
    }
  }

  handleRender(route, navigator) {
    if (route.name === 'Loading') {
      return <Loading
                navigator={navigator}
                changeAuthState={this.onAuthenticated.bind(this)}
                inEmergency={this.state.inEmergency}
                changeEmergencyState={this.onEmergencyAlert.bind(this)}
              />
    }
    if (route.name === 'Login') {
      return <Login
                navigator={navigator}
                changeAuthState={this.onAuthenticated.bind(this)}
                changeEmergencyState={this.onEmergencyAlert.bind(this)}
              />
    }
    if (route.name === 'Home') {
      return <Home
                navigator={navigator}
                inEmergency={this.state.inEmergency}
              />
    }
    if (route.name === 'CheckIn') {
      return <CheckIn
                navigator={navigator}
              />
    }
    if (route.name === 'Attendance') {
      return <Attendance
                navigator={navigator}
                empData={this.state.employeeStatusData}
                checkAttendanceList={this.checkAttendanceList.bind(this)}
              />
    }
  }

  componentWillMount() {
    var self = this;
    registerPush();
    // checkIfAuthenticated()
    //   .then(function(){
    //     console.log('this totally is running');
    //     self.setState({isAuthenticated: true});
    //     getStatusList()
    //       .then(function(response) {
    //         console.log('running inside of getStatusList on willMount');
    //         return response.json()
    //         // self.setState({employeeStatusData: JSON.parse(response._bodyInit)})
    //       })
    //       .then(function(data){
    //         console.log("just JSON'ed in getStatusList", data);
    //         self.setState({employeeStatusData: data});
    //       })
    //       .catch(function(err) {
    //         console.log('Error Recieving Data - ', err);
    //       })
    //   })
    //   .catch(function(){
    //     console.log('error in retreiving jwt from storage');
    //   })
    PushNotificationIOS.addEventListener('notification', this.onNotification.bind(this));
    console.log('this comp started up')
  }

  componentDidMount(){
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
  }

  render() {
    Navigator.SceneConfigs.HorizontalSwipeJump.gestures = {}
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{name: 'Loading'}}
          renderScene={this.handleRender.bind(this)}
          configureScene={(route, routeStack) => Navigator.SceneConfigs.HorizontalSwipeJump}
        />
      </View>
    )
  }

  handleAppStateChange(appState){
    var self = this;
    PushNotificationIOS.setApplicationIconBadgeNumber(0)
    if(appState === "active"){
      getEmergencyStatus()
      .then(function(response){
        console.log('getEmergencyStatus response - ', response);
        return response.json();
      })
      .then(function(data){
        if (data.emergencyStatus === true) {
          console.log("emergencyStatus is true");
          self.onEmergencyAlert();
        }
      })
      .catch(function(error){
        console.log('error in handleAppStateChange getting emergencyStatus', error);
      })
    }
  }

  onNotification(notification) {
    var self = this;
    console.log("a push notification was received");
    if(notification.getData().silent){
      this.checkAttendanceList();
      return;
    }
    if(!this.state.inEmergency){
      AlertIOS.alert(
        "Push Notification Received",
        "Alert message: " + notification.getMessage(),
        [{
          text: "Dismiss",
          onPress: null
        }]
      )
      this.setState({inEmergency: true});
    }
  }

  onAuthenticated() {
    this.setState({isAuthenticated: true});
    // getStatusList()
    //   .then(function(response) {
    //     console.log('running inside of getStatusList on willMount');
    //     return response.json()
    //     // self.setState({employeeStatusData: JSON.parse(response._bodyInit)})
    //   })
    //   .then(function(data){
    //     console.log("just JSON'ed in getStatusList", data);
    //     self.setState({employeeStatusData: data}, function(){
    //       console.log(self.state.employeeStatusData);
    //     });
    //   })
    //   .catch(function(err) {
    //     console.log('Error Recieving Data - ', err);
    //   })
  }

  onEmergencyAlert(){
    this.setState({inEmergency: true});
  }

  checkAttendanceList() {
    var self = this;
    getStatusList()
      .then(function(response) {
        console.log('running inside of getStatusList of checkAttendanceList');
        return response.json()
      })
      .then(function(data){
        console.log("just JSON'ed in getStatusList", data);
        self.setState({employeeStatusData: data}, function(){
          console.log(self.state.employeeStatusData, "new state");
        });
      })
      .catch(function(err) {
        console.log('Error Recieving Data - ', err);
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  }
});

AppRegistry.registerComponent('crysis', () => crysis);
