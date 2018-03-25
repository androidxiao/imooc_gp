/**
 * Created by chawei on 2018/3/19.
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
} from 'react-native';
import NavigationBar from '../../NavigationBar';
import HomePage from './HomePage';
export default class WelcomePage extends Component{
    componentDidMount(){
        this.timer=setTimeout(()=>{
            this.props.navigator.resetTo({
                component:HomePage
            })
        },500);
    }

    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);
    }

    render(){
        return <View>
            <NavigationBar
                title={'欢迎'}
            />
            <Text>欢迎</Text>
        </View>
    }
}
