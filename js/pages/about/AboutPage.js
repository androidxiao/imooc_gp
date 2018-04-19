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
Platform,
Linking
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../../utils/ViewUtils';
import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import AboutCommon,{FLAG_ABOUNT} from '../../pages/about/AboutCommon';
import WebViewPage from '../WebViewPage';
import config from '../../../res/data/config.json';

export default class AboutPage extends Component {

    constructor(props) {
        super(props);
        this.aboutCommon = new AboutCommon(props, (dic)=>this.updateState(dic), FLAG_ABOUNT.flag_about, config);
        this.state=({
            projectModel:[]
        })
    }

    componentDidMount(){
        this.aboutCommon.componentDidMount();
    }

    updateState(dic){
        this.setState(dic);
    }

    onClick(tab){
        let TargetComponent,params={...this.props,menuType:tab};
        switch (tab){
            case MORE_MENU.About_Author:
                break;
            case MORE_MENU.WebSite:
                TargetComponent=WebViewPage;
                params.url='https://www.baidu.com';
                params.title='百度首页';
                break;
            case MORE_MENU.Feedback:
                let url='mailto://zhawei1206@163.com'
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
        }
        if(TargetComponent) {
            this.props.navigator.push({
                component:TargetComponent,
                params:params,
            })
        }
    }

     render() {
         let contentView=<View style={{backgroundColor:'white'}}>
             {this.aboutCommon.renderRepository(this.state.projectModel)}
             {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.WebSite),require('../../../res/images/ic_computer.png'),MORE_MENU.WebSite,{tintColor:'#2196f3'},null)}
             <View style={GlobalStyles.line}/>
             {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.About_Author),require('../my/images/ic_insert_emoticon.png'),MORE_MENU.About_Author,{tintColor:'#2196f3'},null)}
             <View style={GlobalStyles.line}/>
             {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Feedback),require('../../../res/images/ic_feedback.png'),MORE_MENU.Feedback,{tintColor:'#2196f3'},null)}
             {/*当是最后一个item时,一个View无法显示line,如果要显示,需要再追加一个View*/}
             <View style={GlobalStyles.line}/>
             <View style={GlobalStyles.line}/>
         </View>
         return this.aboutCommon.render(contentView,{
             'name': 'GitHub Popular',
             'description': '这是一个用来查看GitHub最受欢迎的内容',
             'avatar': 'http://e.hiphotos.baidu.com/image/pic/item/4a36acaf2edda3ccd03c4d220de93901203f92dc.jpg',
             'backgroundImg': 'http://e.hiphotos.baidu.com/image/pic/item/4a36acaf2edda3ccd03c4d220de93901203f92dc.jpg'
         });
     }
}
