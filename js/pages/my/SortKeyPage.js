/**
 * Created by chawei on 2018/3/19.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
} from 'react-native';
import NavigationBar from '../../../NavigationBar';
import CustomKeyPage from './CustomKeyPage';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import ArrayUtils, {clone} from '../../utils/ArrayUtils';
import SortableListView from 'react-native-sortable-listview';
import ViewUtils from '../../utils/ViewUtils';

export default class SortKeyPage extends Component {

    constructor(props) {
        super(props);

        this.dataArray = [];//数据库中所有标签的数组
        this.sortResultArray = [];//排序之后生成的数组
        this.originalCheckedArray = [];//记录上一次标签排序的顺序
        this.state = {
            checkedArray: []//获取已经订阅的标签
        }
    }

    componentDidMount() {
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result=> {
                this.getCheckedItems(result);
            }).catch(error=> {

        })
    }

    getCheckedItems(result) {
        this.dataArray = result;
        let checkedArray = [];
        for (let i = 0, len = result.length; i < len; i++) {
            let data = result[i];
            if (data.checked)
                checkedArray.push(data);
        }
        this.setState({
            checkedArray: checkedArray,
        })
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }

    onBack() {
        if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop();
            return;
        }
        Alert.alert('提示','要保存修改吗',[
            {text:'不保存',onPress:()=>{this.props.navigator.pop();}},
            {text:'保存',onPress:()=>{this.onSave(true)}},
        ])
    }

    onSave(isChecked) {
        if (!isChecked&&ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            this.props.navigator.pop();
            return;
        }
        this.getSortResult();
        this.languageDao.save(this.sortResultArray);
        this.props.navigator.pop();
    }

    getSortResult() {
        this.sortResultArray = ArrayUtils.clone(this.dataArray);
        for (let i = 0, len = this.originalCheckedArray.length; i < len; i++) {
            let item = this.originalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }

    render() {
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>;
        let title=this.props.flag===FLAG_LANGUAGE.flag_key?"标签排序":"语言排序";
        return <View style={styles.container}>
            <NavigationBar
                title={title}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                rightButton={rightButton}
            />
            <SortableListView
                style={{flex: 1}}
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
                    this.forceUpdate()
                }}
                renderRow={row => (<SortCell data={row}/>)}
            />
        </View>
    }
}

class SortCell extends Component {
    render() {

        return <View>
            <TouchableHighlight
                underlayColor={'#eee'}
                style={styles.item}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image
                        style={styles.image}
                        source={require('./images/ic_sort.png')}
                    />
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
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
    item: {
        padding: 15,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        tintColor: '#2196f3',
        width: 16,
        height: 16,
        marginRight: 10,
    },
    title: {
        fontSize: 22,
        color: 'white',
    },
})