/**
 * Created by chawei on 2018/3/20.
 */
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    Text,
    View,
    AsyncStorage,
    TextInput,
} from 'react-native';
import Toast,{DURATION} from 'react-native-easy-toast';


const KEY='text';

export default class AsyncStorageTest extends Component {
    constructor(props) {
        super(props);
    }

    onSave(){
        AsyncStorage.setItem(KEY,this.text,(error)=>{
            if(!error){
                this.toast.show('保存成功!',DURATION.LENGTH_SHORT);
            }else{
                this.toast.show('保存失败!',DURATION.LENGTH_SHORT);
            }

        });
    }

    onRemove(){
        AsyncStorage.removeItem(KEY,(error)=>{
            if(!error){
                this.toast.show('移除成功!',DURATION.LENGTH_SHORT);
            }else{
                this.toast.show('移除失败!',DURATION.LENGTH_SHORT);
            }
        });
    }

    onFetch(){
        AsyncStorage.getItem(KEY,(error,result)=>{
            if(!error){
                if(result!==''&&result!==null) {
                    this.toast.show('取出的内容为:' + result);
                }else{
                    this.toast.show('KEY不存在');
                }
            }else{
                this.toast.show('没有该值了');
            }

        })
    }

    render() {
        return <View style={styles.container}>
            <TextInput
                style={{borderWidth: 1, height: 40,margin:6}}
                onChangeText={text=>this.text=text}
            />


            <View style={{flexDirection:'row'}}>
                <Text
                    style={styles.tips}
                    onPress={()=>
                        this.onSave()
                    }
                >保存</Text>
            <Text
                style={styles.tips}
                onPress={()=>
                    this.onRemove()
                }
            >移除</Text>
            <Text
                style={styles.tips}
                onPress={()=>
                    this.onFetch()
                }
            >获取</Text>
            </View>
            <Toast ref={toast=>this.toast=toast}/>
        </View>
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    tips:{
        fontSize:20,
        margin:5,
    }
})


