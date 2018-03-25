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
    ListView,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

export default class HomeTabNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            selectedTab: 'tb_popular',
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab==='tb_popular'}
                        selectedTitleStyle={[styles.selectTextColor]}
                        title='最热'
                        renderIcon={()=><Image style={styles.imageSize}
                                               source={require('./res/images/ic_polular.png')}/>}
                        renderSelectedIcon={()=><Image style={[styles.imageSize, styles.selectedIcon]}
                                                       source={require('./res/images/ic_polular.png')}/>}
                        onPress={()=> {
                            this.setState({
                                selectedTab: 'tb_popular'
                            })
                        }}>
                        <View/>
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab==='tb_trending'}
                        selectedTitleStyle={[styles.selectTextColor]}
                        title='趋势'
                        renderIcon={()=><Image style={[styles.imageSize]}
                                               source={require('./res/images/ic_trending.png')}/>}
                        renderSelectedIcon={()=><Image style={[styles.imageSize,styles.selectedIcon]}
                                                       source={require('./res/images/ic_trending.png')}/>}
                        onPress={()=> {
                            this.setState({
                                selectedTab: 'tb_trending'
                            })
                        }}>
                        <View/>
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab==='tb_favorite'}
                        selectedTitleStyle={[styles.selectTextColor]}
                        title='收藏'
                        renderIcon={()=><Image style={[styles.imageSize]}
                                               source={require('./res/images/ic_favorite.png')}/>}
                        renderSelectedIcon={()=><Image style={[styles.imageSize,styles.selectedIcon]}
                                                       source={require('./res/images/ic_favorite.png')}/>}
                        onPress={()=> {
                            this.setState({
                                selectedTab: 'tb_favorite'
                            })
                        }}>
                        <View/>
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab==='tb_my'}
                        selectedTitleStyle={[styles.selectTextColor]}
                        title='我的'
                        renderIcon={()=><Image style={[styles.imageSize]}
                                               source={require('./res/images/ic_my.png')}/>}
                        renderSelectedIcon={()=><Image style={[styles.imageSize,styles.selectedIcon]}
                                                       source={require('./res/images/ic_my.png')}/>}
                        onPress={()=> {
                            this.setState({
                                selectedTab: 'tb_my'
                            })
                        }}>
                        <View/>
                    </TabNavigator.Item>
                </TabNavigator>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
    },
    selectedIcon: {
        tintColor: 'red',
    },
    selectTextColor:{
      color:'red',
    },
    imageSize: {
        width: 22,
        height: 22,
    }
})