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
} from 'react-native';
import NavigationBar from '../../NavigationBar';
import ScrollableTabView, {ScrollableTabBar}from 'react-native-scrollable-tab-view';
import HomePage from './HomePage';
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository';
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import FavoriteDao from '../expand/dao/FavoriteDao';
import RepositoryDetail from'./RepositoryDetail';
import ProjectModel from '../model/ProjectModel';
import Utils from '../utils/Utils';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
var favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_popular);
export default class PopularPage extends Component {

    constructor(props){
        super(props);
        this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state=({
            dataArray:[],
        })
    }

    componentDidMount(){
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

    render() {
        let content=this.state.dataArray.length>0?
            <ScrollableTabView
                tabBarBackgroundColor='#2196f3'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={()=><ScrollableTabBar/>}
            >

                {this.state.dataArray.map((result,i,arr)=>{
                    let len=arr[i];
                    return len.checked?<PopularTab key={i} tabLabel={len.name} {...this.props}/>:null;
                })}

            </ScrollableTabView>:null;
        return <View style={styles.container}>
            <NavigationBar
                title={'最热'}
                statusBar={{
                    backgroundColor: '#2196f3',
                }}

            />

            {content}

        </View>
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = ({
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2)=>row1 !== row2}),
            isLoading: false,
            favoriteKeys:[],
        })
    }

    componentDidMount() {
        this.loadData();
    }

    getUrl() {
        return URL + this.props.tabLabel + QUERY_STR;
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

    updateState(dic){
        if(!this){
         return;
        }

        this.setState(dic);
    }


    loadData() {
        this.setState({
            isLoading: true
        })
        let url = this.getUrl();
        this.dataRepository.fetchRepository(url)
            .then(result=> {
                this.items=result&&result.items?result.items:result?result:[];
                // this.setState({
                //     // result:JSON.stringify(result),
                //     dataSource: this.state.dataSource.cloneWithRows(items),
                //     isLoading: false,
                // });
                // this.flushFavoriteState();
                this.getFavoriteKeys();
                if(result&&result.update_date&&!this.dataRepository.checkDate(result.update_date)){
                    DeviceEventEmitter.emit('showToast','数据过时');
                    return this.dataRepository.fetchNetRepository(url);
                }else{
                    DeviceEventEmitter.emit('showToast','显示缓存数据');
                }
            })
            .then(items=>{
                if(!items||items.length===0){
                    return;
                }
                this.items=items;
                // this.flushFavoriteState();
                this.getFavoriteKeys();
                // this.setState({
                //     dataSource:this.state.dataSource.cloneWithRows(items),
                // })
                DeviceEventEmitter.emit('showToast','显示网络数据');

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

    onSelect(projectModel){
        this.props.navigator.push({
            component:RepositoryDetail,
            params:{
                projectModel:projectModel,
                ...this.props,
            }
        })
    }

    /**
     * favoriteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item,isFavorite){
        if(isFavorite){
            favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item))
        }else{
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    renderRow(projectModel) {
        return <RepositoryCell
            //这里不能onSelect={(data)=>this.onSelect(data)}这样写
            onSelect={()=>this.onSelect(projectModel)}
            key={projectModel.item.id}
            projectModel={projectModel}
            onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
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
    }
})