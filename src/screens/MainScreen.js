import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';

import Feed from './main/Feed';
import  Profile from './main/Profile';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class  MainScreen extends Component {

  componentDidMount(){
    this.props.fetchUser();
  }
  render(){
  // const {currentUser} = this.props;  
  // if(currentUser == undefined){
  //   return(
  //     <View></View>
  //   )
  // }
  return(
    // <View style={{flex:1, justifyContent:'center',,alignItems:'center'}}>
    //   <Text>{currentUser.name} is logged in</Text>
    // </View>
    <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed" component={Feed}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }} />
                <Tab.Screen name="AddContainer" component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        ),
                    }} />
                <Tab.Screen name="Profile" component={Profile}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                        ),
                    }} />
            </Tab.Navigator>
  )
  }
}


const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser
})
// const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser}, dispatch);

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(MainScreen);