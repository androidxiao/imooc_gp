/**
 * Created by chawei on 2018/3/19.
 */
import {
    AsyncStorage,
} from 'react-native';
import GitHubTrending from 'GitHubTrending';
export var FLAG_STORAGE={flag_popular:'pupular',flag_trending:'trending'};

export default class DataRepository {
    constructor(flag){
        this.flag=flag;
        if(flag===FLAG_STORAGE.flag_trending){
            this.trending=new GitHubTrending();
        }else if(flag===FLAG_STORAGE.flag_popular){

        }
    }
    fetchRepository(url) {
        return new Promise((resolve, reject)=> {
            //获取本地的数据
            this.fetchLocalRepository(url)
                .then(result=>{
                    if(result){
                        resolve(result);
                    }else{
                        this.fetchNetRepository(url)
                            .then(result=>{
                                resolve(result);
                            }).catch(e=>{
                                resolve(e)
                        })
                    }
                }).catch(e=>{
                    this.fetchNetRepository(url)
                        .then(result=>{
                            resolve(result);
                        }).catch(e=>{
                            resolve(e);
                    })
            })
        })
    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(url,(error,result)=>{
                if(!error){
                    try {
                        resolve(JSON.parse(result));
                    }catch (e){
                        reject(e);
                    }
                }else{
                    reject(error);
                }
            })
        })
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject)=> {
            if(this.flag===FLAG_STORAGE.flag_trending){
                this.trending.fetchTrending(url)
                    .then(result=>{
                        if(!result){
                            reject(new Error('responseData is null'));
                            return;
                        }
                        this.saveRepository(url,result);
                        resolve(result);
                    })
            }else if(this.flag==FLAG_STORAGE.flag_popular){
            fetch(url)
                .then(response=>response.json())
                .then(result=> {
                    if(!result){
                        reject(new Error('responseData is null'));
                        return;
                    }
                    resolve(result.items);
                    this.saveRepository(url,result.items);
                }).catch(error=> {
                reject(error);
            })
        }})
    }

    saveRepository(url,items,callBack){
        if(!url||!items){
            return;
        }
        let wrapData={items:items,update_date:new Date().getTime()};
        AsyncStorage.setItem(url,JSON.stringify(wrapData),callBack);
    }

    /**
     * 判断数据是否过时
     * @param longTime 数据的时间戳
     * @returns {boolean}
     */
    checkDate(longTime){
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