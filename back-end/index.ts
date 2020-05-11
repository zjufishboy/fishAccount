//鱼塘登录系统后端支持
import express =require('express');
import cors =require('cors');
import bodyParser =require('body-parser');
// import fetch from 'node-fetch';
import { IStatus } from './type/IStatus';
import { StorageUtility, OtherUtility} from './utils/utils';
//lib
const port =8000;
//config

const app=express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//prepare



app.get("/",(_req,res)=>{res.send("MyOAuth2.0:Server")})
//登录逻辑：查看是否存在用户，不存在则报错。用户存在，查询是否存在对应的app.存在对应的app则查询是否存在对应的有效token，存在则返回，不存在则申请一个
app.post("/login",async(req,res)=>{
    let {username,password,client_ID}=req.body;
    OtherUtility.myLog(`登录：${username}:${password}`)
    let result4User:IStatus=await StorageUtility.checkUser(username,password)
    if(!result4User.status){
        //用户不存在or查询出错
        result4User.detail="用户不存在或密码错误"
        OtherUtility.myLog(`报告：${result4User.detail}`)
        res.send(result4User)
        return ;
    }

    let result4App:IStatus=await StorageUtility.checkApp(client_ID)
    if(!result4App.status){
        //应用不存在or查询出错
        result4App.detail="应用不存在"
        OtherUtility.myLog(`报告：${result4App.detail}`)
        res.send(result4App)
        return ;
    }
    let result4Token:IStatus=await StorageUtility.checkTokenWithApp(client_ID,result4User?.info?.data.uid)
    if(!result4Token.status){
        //有效令牌不存在or查询出错
        //新建令牌
        let newToken = StorageUtility.createNewToken(client_ID,result4User?.info?.data.uid)
        let result4Insert=await StorageUtility.insertNewToken(newToken)
        if(!result4Insert.status){
            result4Insert.detail="创建新令牌出错"
            OtherUtility.myLog(`报告：${result4Insert.detail}`)
            res.send(result4Insert)
            return ;
        }
        else{
            let responseData:IStatus={...result4Insert};
            if(responseData.info)responseData.info.data={code:newToken.authCode}
            OtherUtility.myLog(`报告：${result4Insert.detail}:${responseData?.info?.data}`)
            res.send(responseData)
            return ;
        }
    }
    else{
        //有效令牌存在
        let responseData:IStatus={...result4Token};
        if(responseData.info)responseData.info.data={code:result4Token?.info?.data.authCode}
        OtherUtility.myLog(`报告：${result4Token.detail}:${responseData?.info?.data.code}`)
        res.send(responseData)
        return ;
    }
})

app.get("/allUser",async(_req,res)=>{
    let result4AllUser=await StorageUtility.allUserSelect();
    if(!result4AllUser.status){
        OtherUtility.myLog("查询全部用户：失败")
        OtherUtility.myLog(`原因:${result4AllUser.detail}`)
        res.send(result4AllUser)
    }
    else{
        OtherUtility.myLog(`查询全部用户：成功: ${result4AllUser?.info?.length}条记录`)
        res.send(result4AllUser)
    }
})

app.get("/allApp",async(_req,res)=>{
    let result4AllUser=await StorageUtility.allAppSelect();
    if(!result4AllUser.status){
        OtherUtility.myLog("查询全部应用：失败")
        OtherUtility.myLog(`原因:${result4AllUser.detail}`)
    }
    else{
        OtherUtility.myLog(`查询全部应用：成功`)
        res.send(result4AllUser)
    }
})

app.post("/addApp",async(req,res)=>{
    let {client_info,client_type}=req.body;
    //密钥由我们提供
    let client_secret=`${OtherUtility.createRandomString(8)}-${OtherUtility.createRandomString(4)}-${OtherUtility.createRandomString(4)}-${OtherUtility.createRandomString(4)}-${OtherUtility.createRandomString(12)}`;
    let newApp= await StorageUtility.createNewApp(client_secret,client_type,client_info);

    let result4AllUser=await StorageUtility.insertNewApp(newApp);
    if(!result4AllUser.status){
        OtherUtility.myLog("插入新的应用：失败")
        OtherUtility.myLog(`原因:${result4AllUser.detail}`)
    }
    else{
        OtherUtility.myLog(`插入新的应用：成功: ${result4AllUser?.info?.length}条记录`)
        result4AllUser.info=undefined;
        res.send(result4AllUser)
    }
})

app.get('/token',async(req,res)=>{
    let {client_ID,client_secret,authCode}=req.query
    let AppID=parseInt(client_ID.toString());
    let AuthCode=authCode.toString()
    let AppSecret=client_secret.toString()
    let result4App=await StorageUtility.checkAppSecret(AppID,AppSecret)
    if(!result4App.status){
        OtherUtility.myLog("验证应用密钥：失败")
        OtherUtility.myLog(`原因:${result4App.detail}`)
        result4App.detail='验证应用失败'
        res.send(result4App);
        return;
    }
    let result4Token=await StorageUtility.checkTokenWithAuthCode(AppID,AuthCode)
    if(!result4Token.status){
        OtherUtility.myLog("验证授权码：失败")
        OtherUtility.myLog(`原因:${result4Token.detail}`)
        result4Token.detail='验证授权码失败'
        res.send(result4Token)
        return;
    }
    let responseData:IStatus={...result4Token};
    if(responseData.info)responseData.info.data={token:result4Token?.info?.data.token}
    res.send(responseData);
    return;
})
app.post('/userInfo',async(req,res)=>{
    let {token}=req.body
    let Token=token.toString()

    let result4Token=await StorageUtility.checkToken(Token)
    if(!result4Token.status){
        OtherUtility.myLog("验证Token：失败")
        OtherUtility.myLog(`原因:${result4Token.detail}`)
        result4Token.detail='验证Token失败'
        res.send(result4Token)
        return;
    }
    let AppID:number=result4Token?.info?.data?.client_ID;
    let UserID:number=result4Token?.info?.data?.uid;
    let result4App= await StorageUtility.checkApp(AppID);
    if(!result4App.status){
        OtherUtility.myLog("查找App：失败")
        OtherUtility.myLog(`原因:${result4Token.detail}`)
        result4App.detail='查找App：失败"'
        res.send(result4App)
    }
    let AppType:string=result4App.info?.data?.client_type;
    if(!OtherUtility.checkType(AppType)||AppType[2]==='F'){
        OtherUtility.myLog("读取用户信息：失败")
        OtherUtility.myLog(`原因:权限未开启或权限信息错误:${AppType}`)
        result4App.detail='读取用户信息：失败'
        return(result4App)
    }
    let result4User=await StorageUtility.getUserInfo(UserID)
    if(!result4User.status){
        //用户不存在or查询出错
        result4User.detail="用户不存在"
        OtherUtility.myLog(`报告：${result4User.detail}:${UserID}`)
        res.send(result4User)
        return ;
    }
    let responseData:IStatus={...result4User};
    let UserName=result4User?.info?.data.username
    if(responseData.info){
        responseData.info.data={
            ID:UserID,
            userName:UserName}
        OtherUtility.myLog(`${UserID}${UserName}`)
    }
        
    res.send(responseData);
    return;
})

//route

app.listen(port,()=>{console.log(`serverB start to listen on port[${port}]`)})