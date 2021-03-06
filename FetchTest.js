/**
 * Created by chawei on 2018/3/16.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
}from 'react-native';
import NavigationBar from './NavigationBar';
import HttpUtils from './HttpUtils';
export default class FetchTest extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            result: '',
        })
    }


    onLoad() {
        // fetch('http://rap.taobao.org/mockjsdata/11793/test')
        //     .then(response=>response.json())
        //     .then(result=> {
        //         this.setState({
        //             result: JSON.stringify(result),
        //         })
        //     }).catch(error=>{
        //         this.setState({
        //             result:JSON.stringify(error),
        //         })
        // })

        HttpUtils.get('http://rap.taobao.org/mockjsdata/11793/test')
            .then(result=>{
                this.setState({
                    result:JSON.stringify(result),
                })
            }).catch(error=>{
            this.setState({
                result: JSON.stringify(error),
            });
        })
    }

    onSubmit(url,data){
        {/*fetch(url,{*/}
            {/*method:'POST',*/}
            {/*header:{*/}
                {/*'Accept':'application/json',*/}
                {/*'Content-Type':'application/json',*/}
        //     },
        //     body:JSON.stringify(data)
        // })
        //     .then(response=>response.json())
        //     .then(result=>{
        //         this.setState({
        //             result:JSON.stringify(result),
        //         })
        //     }).catch(error=>{
        //     this.setState({
        //         result: JSON.stringify(error),
        //     });
        // })

        HttpUtils.post(url,data)
            .then(result=>{
                this.setState({
                    result:JSON.stringify(result),
                })
            }).catch(error=>{
                this.setState({
                    result:JSON.stringify(error),
                })
        })

    }

    render() {
        return <View style={styles.container}>
            <NavigationBar
                title={'FetchTest'}
            />

            <Text
                style={styles.tips}
                onPress={()=>this.onLoad()}
            >获取数据</Text>

            <Text
                style={styles.tips}
                onPress={()=>this.onSubmit('http://rap.taobao.org/mockjsdata/11793/submit',{userName:'小明',password:'123456'})}
            >提交数据</Text>

            <Text>返回的结果:{this.state.result}</Text>

        </View>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    tips:{
        fontSize:18,
    }
})
