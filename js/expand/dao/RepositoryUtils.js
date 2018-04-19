/**
 * Created by chawei on 2018/3/29.
 */
import {
    AsyncStorage
} from 'react-native'
import DataRepository,{FLAG_STORAGE} from './DataRepository';
import Utils from '../../utils/Utils';


var itemMap=new Map();
export default class RepositoryUtils{

    constructor(aboutCommon){
        this.aboutCommon=aboutCommon;
        this.dataRepository=new DataRepository(FLAG_STORAGE.flag_my);

    }

    /**
     * 更新数据
     * @param key
     * @param value
     */
    updateData(key,value){
        itemMap.set(key,value);
        var arr=[];
        for(var value of itemMap.values()){
            arr.push(value);
        }
        this.aboutCommon.onNotifyDataChanged(arr);
    }

    /**
     * 获取指定url下的数据
     * @param url
     */
    fetchRepository(url){
        this.dataRepository.fetchNetRepository(url)
            .then(result=>{
                if(result){
                    this.updateData(url,result);
                    if(Utils.checkDate(result.update_date)){
                        return this.dataRepository.fetchNetRepository(url);
                    }
                }
            }).then((item)=>{
                if(item){
                    this.updateData(url,item);
                }
        }).catch(e=>{

        })
    }

    /**
     * 批量获取urls对应的数据
     * @param urls
     */
    fetchRepositories(urls){
        for(let i=0,len=urls.length;i<len;i++) {
            var url=urls[i];
            this.fetchRepository(url);
        }
    }
}