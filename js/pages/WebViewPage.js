/**
 * Created by chawei on 2018/3/14.
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
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtils from '../utils/ViewUtils';

export default class WebViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.url,
            title: this.props.title,
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
            title: e.title,
        })
    }

    render() {
        return (
            <View style={GlobalStyles.root_container}>
                <NavigationBar title={this.state.title}
                               style={{backgroundColor: '#6495ed'}}
                               leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                />
                <WebView
                    ref={webView=>this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                />
            </View>
        )
    }
}
