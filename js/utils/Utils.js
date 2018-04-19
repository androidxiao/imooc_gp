/**
 * Created by chawei on 2018/3/20.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

export default class Utils {
    /**
     * 检查该Item 有没有被收藏过
     * @param item
     * @param items
     * @returns {boolean}
     */
   static checkFavorite(item,items){
       for(let i=0,len=items.length;i<len;i++) {
           let id=item.id?item.id.toString():item.fullName;
           if(id===items[i]){
               return true;
           }
       }
       return false;
   }


    /**
     * 判断数据是否过时
     * @param longTime 项目更新时间
     * @returns {boolean} true 不需要更新 false 需要更新
     */
    static checkDate(longTime){
        // return false;//这里可以测试数据过时操作
        let cDate=new Date();//当前时间
        let tDate=new Date();//目标时间
        tDate.setTime(longTime);
        if(cDate.getMonth()!==tDate.getMonth()){
            return false;
        }
        if(cDate.getDay()!==tDate.getDate()){
            return false;
        }
        if(cDate.getHours()-tDate.getHours()>4){
            return false;
        }
        return true;
    }
}