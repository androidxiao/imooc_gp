/**
 * Created by chawei on 2018/3/14.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
TextInput,
} from 'react-native';
import Girl from './Girl';
import NavigationBar from './NavigationBar';
import GitHubTrending from 'GitHubTrending';

const URL='https://github.com/trending/';
export default class TrendingTest extends Component {
    constructor(props) {
        super(props);
        this.trending=new GitHubTrending();
        this.state=({
            result:'',
        })
    }

    onLoad(){
        let url=URL+this.text;
        this.trending.fetchTrending(url)
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
        return (
            <View style={styles.container}>
                <NavigationBar title={'TrendingTest'}
                               statusBar={
                               {backgroundColor: 'yellow'}
                               }/>
                <TextInput
                    style={{borderWidth: 1, height: 40,margin:6}}
                    onChangeText={(text)=>this.text=text}
                />


                <View style={{flexDirection:'row'}}>
                    <Text
                        style={styles.tips}
                        onPress={()=>
                            this.onLoad()
                        }
                    >加载数据</Text>


                    <Text style={{flex:1}}>{this.state.result}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center'
    },
    text: {
        fontSize: 20,
    }
})