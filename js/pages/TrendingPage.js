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
    RefreshControl,
    DeviceEventEmitter,
    TouchableOpacity,
} from 'react-native';
import NavigationBar from '../../NavigationBar';
import ScrollableTabView, {ScrollableTabBar}from 'react-native-scrollable-tab-view';
import HomePage from './HomePage';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import TrendingCell from '../common/TrendingCell';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import RepositoryDetail from'./RepositoryDetail';
import TimeSpan from '../model/TimeSpan';
import {Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger, renderers} from 'react-native-popup-menu';
import FavoriteDao from '../expand/dao/FavoriteDao';
import ProjectModel from '../model/ProjectModel';
import Utils from '../utils/Utils';
import ActionUtils from '../utils/ActionUtils';

const API_URL = 'https://github.com/trending/';
const {Popover}=renderers;
var timeSpanTextArray = [new TimeSpan('今天', 'since=daily'), new TimeSpan('本周', 'since=weekly'), new TimeSpan('本月', 'since=monthly')];
var favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_trending);
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);

export default class TrendingPage extends Component {

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = ({
            dataArray: [],
            timeSpan: 'since=today',
            timeName: '今天',
        })
    }

    componentDidMount() {
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

    renderTitleView() {
        return <Menu
            onSelect={(value)=> {
                this.setState({
                    timeName: value.showText,
                    timeSpan: value.searchText,
                })
            }}
            renderer={Popover}
            rendererProps={{preferredPlacement: 'bottom'}}
        >
            <MenuTrigger>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 18, color: 'white', fontWeight: '400'}}>趋势{this.state.timeName}</Text>
                    <Image style={{width: 12, height: 12, marginLeft: 5}}
                           source={require('../../res/images/ic_spinner_triangle.png')}/>
                </View>
            </MenuTrigger>
            <MenuOptions>
                {timeSpanTextArray.map((r, i, arr)=> {
                    return <MenuOption key={i} style={styles.menuOption} value={arr[i]} text={arr[i].showText}/>
                })}
            </MenuOptions>
        </Menu>
    }

    render() {
        let navBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={{
                backgroundColor: '#2196f3',
            }}

        />;

        let content = this.state.dataArray.length > 0 ?
            <ScrollableTabView
                tabBarBackgroundColor='#2196f3'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={()=><ScrollableTabBar/>}
            >

                {this.state.dataArray.map((result, i, arr)=> {
                    let len = arr[i];
                    return len.checked ? <TrendingTab key={i} tabLabel={len.name} timeSpan={this.state.timeSpan} {...this.props}/> : null;
                })}

            </ScrollableTabView> : null;
        return <View style={styles.container}>

            <MenuProvider>
                {navBar}

                {content}
            </MenuProvider>
        </View>
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.isFavoriteChanged=false;
        this.state = ({
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2)=>row1 !== row2}),
            isLoading: false,
            favoriteKeys:[],
        })
    }

    componentDidMount() {
        this.loadData(this.props.timeSpan,true);
        this.listener=DeviceEventEmitter.addListener('favoriteChanged_trending',()=>{
            this.isFavoriteChanged=true;
        })
    }

    componentWillUnmount(){
        if(this.listener){
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.timeSpan!==this.props.timeSpan){
            this.loadData(nextProps.timeSpan);
        }else if(this.isFavoriteChanged){
            this.isFavoriteChanged=false;
            this.getFavoriteKeys();
        }
    }

    updateState(dic){
        if(!this){
            return;
        }
        this.setState(dic);
    }

    getUrl(timeSpan, category) {
        return API_URL + category +'?'+ timeSpan;
    }

    /**
     * 更新Project Item收藏的状态
     */
    flushFavoriteState(){
        let projectModel=[];
        let items=this.items;
        for(let i=0,len=items.length;i<len;i++){
            projectModel.push(new ProjectModel(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)));
        }
        this.updateState({
            isLoading:false,
            dataSource:this.getDataSource(projectModel)
        })
    }

    getDataSource(items){
        return this.state.dataSource.cloneWithRows(items);
    }


    getFavoriteKeys(){
        favoriteDao.getFavoriteKeys()
            .then(keys=>{
                if(keys){
                    this.updateState({favoriteKeys:keys})
                }
                this.flushFavoriteState();
            }).catch(e=>{
            this.flushFavoriteState();
        });
    }


    loadData(timeSpan,isRefresh) {
        this.updateState({
            isLoading: true
        })
        let url = this.getUrl(timeSpan,this.props.tabLabel);
        dataRepository.fetchRepository(url)
            .then(result=> {
                this.items = result && result.items ? result.items : result ? result : [];
                // this.updateState({
                //     // result:JSON.stringify(result),
                //     dataSource: this.state.dataSource.cloneWithRows(items),
                //     isLoading: false,
                // });
                this.getFavoriteKeys();
                if (!this.items||isRefresh&&result && result.update_date && Utils.checkDate(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时');
                    return dataRepository.fetchNetRepository(url);
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据');
                }
            })
            .then(items=> {
                if (!items || items.length === 0) {
                    return;
                }
                // this.updateState({
                //     dataSource: this.state.dataSource.cloneWithRows(items),
                // })
                this.items=items;
                this.getFavoriteKeys();
                DeviceEventEmitter.emit('showToast', '显示网络数据');

            })
            .catch(error=> {
                // this.setState({
                // result: JSON.stringify(error)
                // });
                this.updateState({
                    isLoading:false,
                })
                console.log(error);
            });
        }

    renderRow(projectModel) {
        return <TrendingCell
            //这里不能onSelect={(data)=>this.onSelect(data)}这样写
            // onSelect={()=>this.onSelect(projectModel)}
            onSelect={()=>ActionUtils.onSelectRepository({
                projectModel:projectModel,
                flag:FLAG_STORAGE.flag_trending,
                ...this.props
            })}
            key={projectModel.item.fullName}
            projectModel={projectModel}
            onFavorite={(item,isFavorite)=>ActionUtils.onFavorite(this.favoriteDao,item,isFavorite,FLAG_STORAGE.flag_trending)}
        />
    }

    render() {
        return <View style={{flex: 1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        colors={['#2196f3']}
                        tintColor={'#2196f3'}
                        title={'Loading'}
                        titleColor={'#2196f3'}
                    />
                }
                enableEmptySections={true}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 29
    },
    menuOption: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 8,
        paddingBottom: 8,
    }
})