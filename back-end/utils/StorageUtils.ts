//这里是和数据库交互相关的模块
import mongodb = require("mongodb");
import { ConfUtility, OtherUtility } from "./utils";
import { IObject } from '../type/IObject'
import { IStatus } from '../type/IStatus'
import { IUserInfo } from "../type/IUserInfo";
import { IAppInfo } from "../type/IAppInfo";
import { IToken } from "../type/IToken";
const MongoClient = mongodb.MongoClient;



const mySelect = (target: IObject, cName: string) => {
    let res: IStatus= {status:false,detail:"未知错误"}
    return new Promise((resolve:(res:IStatus)=>void, _reject) => {
        MongoClient.connect(ConfUtility.getMongodbUrl(), { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                res.detail = "连接错误"
                resolve(res)
            }
            let database = client.db(ConfUtility.dbName);
            database.collection(cName).find(target).toArray((err, result) => {
                if (err) {
                    res.detail = "查询错误"
                    resolve(res)
                }
                if (result.length == 0) {
                    res.status = false;
                    res.detail = "查无数据"
                }
                else {
                    res.status = true;
                    res.detail="查询成功"
                    res.info = {data:result[0],length:result.length};
                }
                resolve(res)
            });
        });
    })
}
const mySelectAll = (cName: string) => {
    let res: IStatus= {status:false,detail:"未知错误"}
    return new Promise((resolve:(res:IStatus)=>void, _reject) => {
        MongoClient.connect(ConfUtility.getMongodbUrl(), { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                res.detail = "连接错误"
                resolve(res)
            }
            let database = client.db(ConfUtility.dbName);
            database.collection(cName).find().toArray((err, result) => {
                if (err) {
                    res.detail = "查询错误"
                    resolve(res)
                }
                if (result.length == 0) {
                    res.status = false;
                    res.detail = "查无数据"
                }
                else {
                    res.status = true;
                    res.detail="查询成功"
                    res.info = {data:result,length:result.length};
                }
                resolve(res)
            });
        });
    })
}

const myInsert = (target: IObject, cName: string) => {
    let res: IStatus= {status:false,detail:"未知错误"}
    return new Promise((resolve:(res:IStatus)=>void, _reject) => {
        MongoClient.connect(ConfUtility.getMongodbUrl(), { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                res.detail = "连接错误"
                resolve(res)
            }
            let database = client.db(ConfUtility.dbName);
            database.collection(cName).insertOne(target, (err, _result) => {
                if (err) {
                    res.detail = "插入错误"
                    resolve(res)
                }
                res.status = true;
                res.detail = "插入成功"
                res.info={data:target}
                resolve(res)
            })
        });
    })
}




//密码单向加密
//TODO:未实现加密效果。
export const dealWithPassword = (password: string) => password




//核查用户是否存在
export const checkUser = (username: string, password: string) => {
    return mySelect({ username, password }, "User")
}
//核查应用是否存在
export const checkAppSecret = (AppID: number, AppSecret: string) => {
    return mySelect({ client_ID: AppID, client_secret: AppSecret }, "App")
}
export const checkApp = (AppID: number) => {
    return mySelect({ client_ID: AppID }, "App")
}
//核查令牌是否存在且有效
export const checkToken = (Token: string) => {
    let option = {
        token: Token,
        token_time: {
            $gte: new Date(),
        },
    }
    return mySelect(option, "Token")
}
//核查该用户是否有该应用的有效令牌
export const checkTokenWithApp = (AppID: number, userID: number) => {
    let option = {
        client_ID: AppID,
        uid: userID,
        token_time: {
            $gte: new Date(),
        },
    }
    return mySelect(option, "Token")
}
export const checkTokenWithAuthCode = (AppID: number, authCode: string) => {
    let option = {
        client_ID: AppID,
        authCode:authCode,
        token_time: {
            $gte: new Date(),
        },
    }
    return mySelect(option, "Token")
}

//插入新的Token
export const insertNewToken = (newToken:IToken) => {
    return myInsert(newToken,"Token")
}
export const insertNewUser = (userInfo:IUserInfo) => {
    return myInsert(userInfo,"User")
}
export const insertNewApp = (AppInfo:IAppInfo) => {
    return myInsert(AppInfo,"App")
}

export const createNewToken=(AppID:number,UserID:number)=>{
    let authCode = OtherUtility.createRandomString(12);
    let token = OtherUtility.createRandomString(32);
    let curDate = new Date();
    let newToken:IToken = {
      client_ID:AppID,
      uid:UserID,
      authCode,
      token_time: new Date(
        curDate.getTime() +
        3600000
      ),
      token,
    };
    return newToken;
}
export const createNewUser=async(username:string,password:string)=>{
    let res:IStatus=await mySelect({},"User");
    let newUser:IUserInfo={
        username,
        password,
        uid:res.info?.length||0+1,
        signature:"the signature"
    }
    return newUser
}
export const createNewApp=async(AppSecret:string,AppType:string,AppInfo:string)=>{
    let res:IStatus=await mySelectAll("App");
    let newID=(res.info?.length?res.info.length:0)+1;
    OtherUtility.myLog(`新建应用：${newID}`)
    let newApp:IAppInfo={
        client_ID:newID,
        client_info:AppInfo,
        client_secret:AppSecret,
        client_type:AppType
    }
    return newApp;
}
export const allUserSelect=()=>{
    return mySelectAll("User")
}
export const allAppSelect=()=>{
    return mySelectAll("App")
}
export const getUserInfo=(UserID:number)=>{
    return mySelect({uid:UserID},"User")
}