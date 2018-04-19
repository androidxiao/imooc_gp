/**
 * Created by chawei on 2018/3/19.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    Dimensions,
    PixelRatio,
Platform
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../../utils/ViewUtils';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import FavoriteDao from'../../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../../expand/dao/DataRepository';
import Utils from '../../utils/Utils';
import ProjectModel from '../../model/ProjectModel';
import RepositoryCell from '../../common/RepositoryCell';
import RepositoryDetail from '../../pages/RepositoryDetail';
import RepositoryUtils from '../../expand/dao/RepositoryUtils';

export var FLAG_ABOUNT={flag_about:'about',flag_about_me:'about_me'};
export default class AboutCommon{

    constructor(props,updateState,flag_about,config) {
        this.props=props;
        this.updateState=updateState;
        this.flag_about=flag_about;
        this.repositories=[];
        this.config=config;
        this.favoriteKeys=null;
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_my);
        this.repositoryUtils=new RepositoryUtils(this);
    }

    componentDidMount(){
        if(this.flag_about===FLAG_ABOUNT.flag_about) {
            this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl);
        }else {
            var urls=[];
            var items=this.config.items;
            for(let i=0,l=items.length;i<l;i++) {
                urls.push(this.config.info.url+items[i]);
            }
            this.repositoryUtils.fetchRepositories(urls);
        }
    }

    /**
     * 通知数据发生改变
     * @param items 改变的数据
     */
    onNotifyDataChanged(items){
        this.updateFavorite(items);
    }

    /**
     * 更新项目的用户收藏状态
     * @param repositories
     */
    async updateFavorite(repositories){
        if(repositories){
            this.repositories=repositories;
        }
        if(!this.repositories){
            return;
        }
        if(!this.favoriteKeys){
           this.favoriteKeys= await this.favoriteDao.getFavoriteKeys();
        }

        let projectModel = [];
        for (let i = 0, len = this.repositories.length; i < len; i++) {
            var data=this.repositories[i];
            projectModel.push({
                isFavorite: Utils.checkFavorite(this.repositories[i], this.favoriteKeys?this.favoriteKeys:[]),
                item:data.item?data.item:data,
            });
        }
        this.updateState({
            projectModel:projectModel
        })
    }

    /**
     * 创建项目视图
     * @param projectModels
     * @returns {*}
     */
    renderRepository(projectModels){
        if(!projectModels||projectModels.length===0){
            return null;
        }

        let views=[];
        for(let i=0,l=projectModels.length;i<l;i++) {
            let projectModel=projectModels[i];
            views.push(
                this.renderRow(projectModel)
            )
        }
        return views;
    }

    renderRow(projectModel) {
        return <RepositoryCell
            //这里不能onSelect={(data)=>this.onSelect(data)}这样写
            onSelect={()=>this.onSelect(projectModel)}
            key={projectModel.item.id}
            projectModel={projectModel}
            onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}
        />
    }

    onSelect(projectModel) {
        this.props.navigator.push({
            title:projectModel.item.full_name,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                flag:FLAG_STORAGE.flag_popular,
                ...this.props,
            }
        })
    }

    /**
     * favoriteIcon的单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
        } else {
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

     getParallaxRenderConfig(params) {
        let config = {};
        config.renderBackground = () => (
            <View key="background">
                <Image source={{
                    uri: params.avatar.replace('http', 'https'),
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        );
        config.renderForeground = () => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={ styles.avatar } source={{
                    uri: params.avatar.replace('http', 'https'),
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE
                }}
                       resizeMode="cover"/>
                <Text style={ styles.sectionSpeakerText }>
                    {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                    {params.description}
                </Text>
            </View>
        );

        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}> {params.name}</Text>
            </View>
        );

        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(()=>this.props.navigator.pop())}
            </View>
        );

        return config;
    }


     render(contentView,params) {
        let renderConfig = this.getParallaxRenderConfig(params);
        return <ParallaxScrollView
            headerBackgroundColor="#333"
            backgroundColor='#2196f3'
            stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
            parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
            backgroundSpeed={10}
            {...renderConfig}
            style={GlobalStyles.root_container}
        >
            {contentView}
        </ParallaxScrollView>
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems:'center',
        paddingTop:(Platform.OS==='ios')?20:0,
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 0,
        right: 10,
        left:0,
        right:0,
        top:0,
        flexDirection:'row',
        paddingRight:8,
        alignItems:'center',
        paddingTop:(Platform.OS==='ios')?20:0,
        justifyContent:'space-between'
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    }
});
