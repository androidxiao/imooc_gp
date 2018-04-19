/**
 * Created by chawei on 2018/3/19.
 */
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
DeviceEventEmitter,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
//应该新版已经过期，所以需要另外导入Navigator
import {
    Navigator
}
    from 'react-native-deprecated-custom-components';
import PopularPage from './PopularPage';
import FavoritePage from './FavoritePage';
import AsyncStorageTest from '../../AsyncStorageTest';
import MyPage from './my/MyPage';
import Toast,{DURATION} from 'react-native-easy-toast';
import WebViewTest from '../../WebViewTest';
import TrendingPage from './TrendingPage';

export const ACTION_HOME={A_SHOW_TOAST:'showToast',A_RESTART:'restart'};
export const FLAG_TAB={
    flag_popularTab:'tb_popular',
    flag_trendingTab:'tb_trending',
    flag_favoriteTab:'tb_favorite',
    flag_my:"tb_my"
};
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        let selectedTab=this.props.selectedTab?this.props.selectedTab:'tb_popular';
        this.state = {
            selectedTab: selectedTab,
        }
    }

    componentDidMount(){
        this.listener=DeviceEventEmitter.addListener('ACTION_HOME',(action,params)=>this.onAction(action,params));
    }

    /**
     * 通知回调事件处理
     * @param {*} action 
     * @param {*} params 
     */
    onAction(action,params){
        if(ACTION_HOME.A_RESTART===action){
            this.onRestart(params);
        }else if(ACTION_HOME.A_SHOW_TOAST===action){
            this.toast.show(params.text,DURATION.LENGTH_SHORT);
        }
    }

    /**
     * 重启首页
     * @param {默认显示的页面} jumpToTab 
     */
    onRestart(jumpToTab){
        this.props.navigator.resetTo({
            component:HomePage,
            params:{
                ...this.props,
                selectedTab:jumpToTab
            }
        })
    }

    componentWillUnmount(){
        this.listener&&this.listener.remove();
    }

    _renderTab(Component,selectTab,title,renderIcon){
        return  <TabNavigator.Item
            selected={this.state.selectedTab === selectTab}
            selectedTitleStyle={{color: '#2196f3'}}
            title={title}
            renderIcon={() => <Image style={styles.image} source={renderIcon}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]}
                                             source={renderIcon}/>}
            badgeText="1"
            onPress={() => this.setState({selectedTab: selectTab})}>
            <Component {...this.props}/>
        </TabNavigator.Item>
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                {this._renderTab(PopularPage,'tb_popular','最热',require('../../res/images/ic_polular.png'))}
                {this._renderTab(TrendingPage,'tb_trending','趋势',require('../../res/images/ic_trending.png'))}
                {this._renderTab(FavoritePage,'tb_favorite','收藏',require('../../res/images/ic_polular.png'))}
                {this._renderTab(MyPage,'tb_my','我的',require('../../res/images/ic_trending.png'))}
                    {/** <TabNavigator.Item
                    selected={this.state.selectedTab === 'tb_popular'}
                    selectedTitleStyle={{color: '#2196f3'}}
                    title="最热"
                    renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_polular.png')}/>}
                    renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196f3'}]}
                                                     source={require('../../res/images/ic_polular.png')}/>}
                    badgeText="1"
                    onPress={() => this.setState({selectedTab: 'tb_popular'})}>
                    <PopularPage {...this.props}/>
                </TabNavigator.Item>

                 <TabNavigator.Item
                     selected={this.state.selectedTab === 'tb_trending'}
                     selectedTitleStyle={{color: 'yellow'}}
                     title="趋势"
                     renderIcon={() => <Image style={styles.image}
                                              source={require('../../res/images/ic_trending.png')}/>}
                     renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]}
                                                      source={require('../../res/images/ic_trending.png')}/>}
                     onPress={() => this.setState({selectedTab: 'tb_trending'})}>

                     <TrendingPage {...this.props}/>
                 </TabNavigator.Item>
                 <TabNavigator.Item
                     selected={this.state.selectedTab === 'tb_favorite'}
                     selectedTitleStyle={{color: 'red'}}
                     title="收藏"
                     renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_polular.png')}/>}
                    renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]}
                                                     source={require('../../res/images/ic_polular.png')}/>}
                    badgeText="1"
                    onPress={() => this.setState({selectedTab: 'tb_favorite'})}>
                    <WebViewTest/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tb_my'}
                    selectedTitleStyle={{color: 'yellow'}}
                    title="我的"
                    renderIcon={() => <Image style={styles.image}
                                             source={require('../../res/images/ic_trending.png')}/>}
                    renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]}
                                                     source={require('../../res/images/ic_trending.png')}/>}
                    onPress={() => this.setState({selectedTab: 'tb_my'})}>
                    <MyPage {...this.props}/>
                </TabNavigator.Item>*/}
            </TabNavigator>
            <Toast ref={toast=>this.toast=toast}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
        backgroundColor: 'red',
    },
    page2: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    image: {
        width: 22,
        height: 22,
    }
});
