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
import NavigationBar from '../../../NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage';
import LanguageDao,{FLAG_LANGUAGE}from '../../expand/dao/LanguageDao';

export default class MyPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <View style={styles.container}>
            <NavigationBar
                title={'我的'}
            />
            <Text
                style={styles.tips}
                onPress={()=> {
                    this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            flag:FLAG_LANGUAGE.flag_key,
                            ...this.props
                        }
                    })
                }
                }
            >自定义标签</Text>


            <Text
                style={styles.tips}
                onPress={()=> {
                    this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            flag:FLAG_LANGUAGE.flag_language,
                            ...this.props
                        }
                    })
                }
                }
            >自定义语言</Text>



            <Text
                style={styles.tips}
                onPress={()=> {
                    this.props.navigator.push({
                        component: SortKeyPage,
                        params: {
                            flag:FLAG_LANGUAGE.flag_key,
                            ...this.props
                        }
                    })
                }
                }
            >标签排序</Text>


            <Text
                style={styles.tips}
                onPress={()=> {
                    this.props.navigator.push({
                        component: SortKeyPage,
                        params: {
                            flag:FLAG_LANGUAGE.flag_language,
                            ...this.props
                        }
                    })
                }
                }
            >语言排序</Text>

            <Text
                style={styles.tips}
                onPress={()=> {
                    this.props.navigator.push({
                        component: CustomKeyPage,
                        params: {
                            ...this.props,
                            isRemoveKey:true,
                        }
                    })
                }
                }
            >标签移除</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 20,
    }
})