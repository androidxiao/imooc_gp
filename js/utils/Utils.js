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
           if(item.id.toString()===items[i]){
               return true;
           }
       }
       return false;
   }
}