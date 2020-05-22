import { ConfUtility } from "./utils"
import {IObject} from '../type/IObject'
import { checkType, checkPassword } from "./OtherUtils"

export const myFetch = (way:"POST"|"GET",url: string, data?: IObject) => {
    let requestInit:RequestInit = {
        headers: {
            "Content-Type":"application/json",
        },
        method: way,
        mode: "cors",
        body: data?JSON.stringify(data):null
    }
    return fetch(url,requestInit)
}

export const myPost=(url:string,data:IObject)=>{
    return myFetch("POST",url,data)
}
export const myGet=(url:string,data:IObject)=>{
    const params=[]
    for(let key in data){
        params.push(`${key}=${data[key]}`)
    }
    let realUrl=`${url}${params.length===0?"":"?"}${params.join("&")}`
    return myFetch("GET",realUrl)
}

export const Login=(data:IObject)=>{
    return myPost(ConfUtility.getPathLogin(),data).then((res) => res.json())
}
export const Register=(data:IObject)=>{
    return myPost(ConfUtility.getPathRegister(),data).then((res) => res.json())
}
export const AllUser=()=>{
    return myGet(ConfUtility.getPathAllUser(),{}).then(res=>res.json())
}
export const AllApp=()=>{
    return myGet(ConfUtility.getPathAllApp(),{}).then(res=>res.json())
}
export const AddApp=(client_info:string,client_type:string)=>{
    let checkResult=checkType(client_type);
    if(!checkResult){
        alert("权限信息错误");
        return new Promise((resolve,reject)=>{});
    }
    else{
        return myPost(ConfUtility.getPathAddApp(),{client_info,client_type}).then(res=>res.json());
    }

}
export const AddUser=(userName:string,password:string)=>{
    //检测密码长度
    let checkResult=checkPassword(password);
    if(!checkResult){
        alert("密码长度应超过六个英文字符");
        return new Promise((resolve,reject)=>{});
    }
    else{
        return myPost(ConfUtility.getPathAddUser(),{userName,password}).then(res=>res.json());
    }

}