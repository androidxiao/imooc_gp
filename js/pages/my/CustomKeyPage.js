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
    ScrollView,
    TouchableOpacity,
Alert,
} from 'react-native';
import NavigationBar from '../../../NavigationBar';
import ViewUtils from '../../utils/ViewUtils';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import CheckBox from 'react-native-check-box';
import ArrayUtils from '../../utils/ArrayUtils';
export default class CustomKeyPage extends Component {

    constructor(props) {
        super(props);
        this.isRemoveKey=this.props.isRemoveKey?true:false;
        this.changeValues=[];
        this.state = {
            dataArray: []
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result=> {
                this.setState({
                    dataArray: result
                })
            }).catch(error=> {
            console.log(error);
        })
    }

    onSave() {
       if(this.changeValues.length===0){
           this.props.navigator.pop();
           return;
       }
       if(this.isRemoveKey) {
           for (let i = 0, len = this.changeValues.length; i < len; i++) {
               ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
           }
       }
       this.languageDao.save(this.state.dataArray)
        this.props.navigator.pop();
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0) {
            return null;
        } else {
            let length = this.state.dataArray.length;
            let views = [];
            for (let i = 0, l = length; i < l - 2; i += 2) {
                views.push(
                    <View key={i}>
                        <View style={styles.item}>
                            {this.renderCheckBox(this.state.dataArray[i])}
                            {this.renderCheckBox(this.state.dataArray[i + 1])}
                        </View>
                        <View style={styles.line}/>
                    </View>
                )
            }
            views.push(
                <View key={length - 1}>
                    <View style={styles.item}>
                        {length % 2 === 0 ? this.renderCheckBox(this.state.dataArray[length - 2]) : null}
                        {this.renderCheckBox(this.state.dataArray[length - 1])}
                    </View>
                </View>
            )
            return views;
        }
    }

    onClick(data) {
        if(!this.isRemoveKey)
        data.checked=!data.checked;
        ArrayUtils.updateArray(this.changeValues,data);
    }

    renderCheckBox(data) {
        let leftText = data.name;
        return (
            <CheckBox
                style={{flex: 1,padding:10}}
                onClick={()=>this.onClick(data)}
                isChecked={data.checked}
                leftText={leftText}
                checkedImage={<Image style={{tintColor:'#6495ed'}} source={require('./images/ic_check_box.png')}/>}
                unCheckedImage={<Image style={{tintColor:'#6495ed'}} source={require('./images/ic_check_box_outline_blank.png')}/>}
            />
        )
    }

    onBack(){
        if(this.changeValues.length>0){
            Alert.alert('提示','要保存修改吗',[
                {text:'不保存',onPress:()=>{this.props.navigator.pop();},style:'cancel'},
                {text:'保存',onPress:()=>{this.onSave()},style:'Ok'},
            ])
        }else{
            this.props.navigator.pop();
        }

    }

    render() {
        let title=this.isRemoveKey?'标签移除':'自定义标签';
        title=this.props.flag===FLAG_LANGUAGE.flag_language?'自定义语言':'自定义标签';
        let rightButtonTitle=this.isRemoveKey?'移除':'保存';
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>{rightButtonTitle}</Text>
            </View>
        </TouchableOpacity>
        return <View style={styles.container}>
            <NavigationBar
                title={title}
                style={{backgroundColor: '#6495ed'}}
                leftButton={ViewUtils.getLeftButton(()=> {
                    this.onBack()
                })}
                rightButton={rightButton}
            />
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 20,
    },
    title: {
        fontSize: 22,
        color: 'white',
    },
    line: {
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    }


})