/**
 * Created by chawei on 2018/3/15.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ListView,
    TouchableOpacity,
    RefreshControl,
}from 'react-native';
import NavigationBar from './NavigationBar';
import Toast, {DURATION} from 'react-native-easy-toast';
var data =
{
    "result": [
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        },
        {
            "email": "12345@qq.com",
            "fullName": "张三"
        }
    ]
}

export default class ListViewTest extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(data.result),
            isLoading:true,
        }
        this.onLoad();
    }

    renderRow(item) {
        return <View>
            <TouchableOpacity
                onPress={()=>{
                    this.toast.show('你单击了:-->'+item.fullName,DURATION.LENGTH_SHORT);
                }
                }
            >
                <Text style={styles.tips}>{item.fullName}</Text>
                <Text style={styles.tips}>{item.email}</Text>
            </TouchableOpacity>
        </View>
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return <View key={rowID} style={styles.line}></View>
    }

    renderFooter() {
        //安卓原生暂时不支持gif,如果是网络图片,需要设置宽高,才会显示。本地图片不需要设置
        return <Image style={{width: 400, height: 100, backgroundColor: 'black'}}
                      source={require('./res/images/ic_polular.png')}/>
    }

    onLoad(){
        setTimeout(()=>{
            //通过构造函数修改isLoading的值
            this.setState({
                isLoading:false,
            })
        },2000)
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='ListViewTest'
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(item)=>this.renderRow(item)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=>this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    renderFooter={()=>this.renderFooter()}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={()=>this.onLoad()}
                        />
                    }
                />
                <Toast ref={toast=>this.toast = toast}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    tips: {
        fontSize: 18,
    },
    row: {
        height: 50,
    },
    line: {
        height: 1,
        backgroundColor: 'black',
    }
})