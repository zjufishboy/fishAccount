import { ConfUtility } from "./utils"
import {IObject} from '../type/IObject'

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
    let realUrl=`${url}?${params.join("&")}`
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