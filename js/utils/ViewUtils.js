/**
 * Created by chawei on 2018/3/20.
 */
import React, {Component} from 'react';
import {
    Image,
    TouchableOpacity,
    StyleSheet,
View,
Text
} from 'react-native';

export default class ViewUtils {
    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param icon 左侧图标
     * @param text 显示的文本
     * @param tintStyles 图标着色
     * @param expandableIcon 右侧的图标
     * @returns {{}}
     */
    static getSettingItem(callBack, icon, text, tintStyles, expandableIcon) {
        return <TouchableOpacity
            onPress={callBack}>
            <View style={styles.setting_item_container}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={icon}
                           resizeMode='stretch'
                           style={[{width: 16, height: 16, marginRight: 10}, tintStyles]}
                    />
                    <Text>{text}</Text>
                </View>
                <Image source={expandableIcon ? expandableIcon : require('../../res/images/ic_tiaozhuan.png')}
                       style={[{
                           marginRight: 10,
                           height: 22,
                           width: 22,
                       }, tintStyles]}
                />
            </View>

        </TouchableOpacity>
    }



    static getLeftButton(callBack) {
        return <TouchableOpacity
            onPress={callBack}>
            <Image style={{width: 22, height: 22, margin: 5}}
                   source={require('../../res/images/ic_arrow_back_white_36pt.png')}/>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }
})