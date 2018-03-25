/**
 * Created by chawei on 2018/3/22.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    WebView,
    DeviceEventEmitter,
} from 'react-native';
import NavigationBar from '../../NavigationBar';
import ViewUtils from '../utils/ViewUtils';

const TRENDING_URL='https://github.com/';
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        let item=this.props.projectModel.item;
        this.url=item.html_url?item.html_url:
        TRENDING_URL+item.fullName;
        let title=item.name?item.name:
            item.fullName;
        this.state = {
            url: this.url,
            title: title,
            canGoBack: false,
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
            url:e.url,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar title={this.state.title}
                              style={{backgroundColor:'#6495ed'}}
                               leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
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