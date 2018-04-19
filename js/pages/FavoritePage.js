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
import TrendingCell from '../common/TrendingCell';
import FavoriteDao from '../expand/dao/FavoriteDao';
import RepositoryDetail from'./RepositoryDetail';
import ProjectModel from '../model/ProjectModel';
import Utils from '../utils/Utils';
import ArrayUtils from '../utils/ArrayUtils';
import ActionUtils from '../utils/ActionUtils';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class FavoritePage extends Component {

    constructor(props){
        super(props);
        this.state=({
        })
    }

    render() {
        let content=
            <ScrollableTabView
                tabBarBackgroundColor='#2196f3'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={()=><ScrollableTabBar/>}
            >

                <FavoriteTab flag={FLAG_STORAGE.flag_popular} tabLabel='最热' {...this.props}/>
                <FavoriteTab flag={FLAG_STORAGE.flag_trending} tabLabel='趋势' {...this.props}/>

            </ScrollableTabView>;
        return <View style={styles.container}>
            <NavigationBar
                title='收藏'
                statusBar={{
                    backgroundColor: '#2196f3',
                }}

            />

            {content}

        </View>
    }
}

class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        this.favoriteDao=new FavoriteDao(this.props.flag);
        this.unFavoriteItems=[];
        this.state = ({
            result: '',
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2)=>row1 !== row2}),
            isLoading: false,
            favoriteKeys:[],
        })
    }

    componentDidMount() {
        this.loadData(true);
    }

    componentWillReceiveProps(nextProps){
        this.loadData(false);
    }

    getDataSource(items){
        return this.state.dataSource.cloneWithRows(items);
    }

    updateState(dic){
        if(!this){
         return;
        }

        this.setState(dic);
    }


    loadData(isShowLoading) {
        if(isShowLoading){
            this.setState({
                isLoading: true
            })
        }

        this.favoriteDao.getAllItems()
            .then(items=>{
                var resultData=[];
                for (let i=0,len=items.length;i<len;i++){
                    resultData.push(new ProjectModel(items[i],true));
                }
                this.updateState({
                    isLoading:false,
                    dataSource:this.getDataSource(resultData),
                })
            }).catch(e=>{
                this.updateState({
                    isLoading:false,
                })
        })
    }

    /**
     * favoriteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item,isFavorite){
        ArrayUtils.updateArray(this.unFavoriteItems,item);
        if(this.unFavoriteItems.length>0) {
            if(this.props.flag===FLAG_STORAGE.flag_popular){
                DeviceEventEmitter.emit('favoriteChanged_popular');
            }else{
                DeviceEventEmitter.emit('favoriteChanged_trending');
            }
        }
    }

    renderRow(projectModel) {
        let CellComponent=this.props.flag===FLAG_STORAGE.flag_popular?RepositoryCell:TrendingCell;
        let key=this.props.flag===FLAG_STORAGE.flag_popular?projectModel.item.id:projectModel.item.fullName;
        return <CellComponent
            //这里不能onSelect={(data)=>this.onSelect(data)}这样写
            // onSelect={()=>this.onSelect(projectModel)}
            onSelect={()=>ActionUtils.onSelectRepository({
                projectModel:projectModel,
                flag:this.props.flag,
                ...this.props
            })}
            key={key}
            projectModel={projectModel}
            onFavorite={(item,isFavorite)=>ActionUtils.onFavorite(this.favoriteDao,item,isFavorite,this.props.flag)}
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