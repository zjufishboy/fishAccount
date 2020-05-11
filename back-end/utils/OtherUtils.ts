//这里是其他的一些通用模块

import { ConfUtility } from "./utils"
import stringRandom from 'string-random';

//创建随机固定长度的字符串
export const createRandomString=(length:number)=>stringRandom(length)

export const myLog=(data:any)=>{
    if(ConfUtility.env==="debug"){
        console.log(data);
    }
    else{
        //写入日志文件
        console.log(data)
    }
}

export const checkType=(type:string)=>{
    if(type.length!==3)
        return false;
    for(let chr of type)
        if(chr!=='T'&&chr!=='F')
            return false;
    return true;
}