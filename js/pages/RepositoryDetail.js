/**
 * Created by chawei on 2018/3/22.
 */
import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    WebView,
    TouchableOpacity,
    Image,
} from 'react-native';
import NavigationBar from '../../NavigationBar';
import ViewUtils from '../utils/ViewUtils';
import FavoriteDao from '../expand/dao/FavoriteDao';

const TRENDING_URL = 'https://github.com/';
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url :
        TRENDING_URL + this.props.projectModel.item.fullName;
        let title = this.props.projectModel.item.name ? this.props.projectModel.item.name :
            this.props.projectModel.item.fullName;
        this.favoriteDao=new FavoriteDao(this.props.flag);
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        }
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url,
        })
    }

    setFavoriteState(isFavorite){
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png'),
        });
    }


    onRightButtonClick(){
        let projectModel=this.props.projectModel;
        projectModel.isFavorite=!projectModel.isFavorite;
        this.setFavoriteState(projectModel.isFavorite);
        let key=projectModel.item.fullName?projectModel.item.fullName:projectModel.item.id.toString();
        if(projectModel.isFavorite){
            this.favoriteDao.saveFavoriteItem(key,JSON.stringify(projectModel.item))
        }else{
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    renderRightButton() {
        return <TouchableOpacity
            onPress={()=>this.onRightButtonClick()}
        >
            <Image
                style={{width:22,height:22,marginRight:10}}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar title={this.state.title}
                               style={{backgroundColor: '#6495ed'}}
                               leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                               rightButton={this.renderRightButton()}
                />
                <WebView
                    ref={webView=>this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
        // justifyContent: 'center'
    },
    text: {
        fontSize: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    input: {
        height: 40,
        flex: 1,
        borderWidth: 1,
        margin: 10,
    },
    tips: {
        fontSize: 16,
    }
})