import React, { useState, useEffect, createRef, } from "react";
import { NetWorkUtility } from '../../utils/utils'
import "./index.css";
import { IAppInfo } from "../../type/IAppInfo";
const AppManageAppList = () => {
    const [data, setData] = useState([])
    const [focus, setFocus] = useState(0)
    const [addStatus, setAddStatus] = useState(false)
    const refInfo = createRef<HTMLInputElement>();
    const refType = createRef<HTMLInputElement>();
    useEffect(() => {
        document.title = "鱼塘登录系统-管理应用"
        updateData()
    }, [])
    const updateData = () => {
        NetWorkUtility.AllApp().then((res: any) => { setData(res.info.data) })
    }
    const coverUserSingle = (app:IAppInfo,index:number) => (
        <div 
            style={{ width: "90%", height: 30, display: "flex", flexDirection: "row", backgroundColor: "white" }} 
            key={index}>
            <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                {app.client_ID}
            </div>
            <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                {app.client_secret}
            </div>
            <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                {app.client_info}
            </div>
            <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                {app.client_type}
            </div>
        </div>
    )
    const registerApp=()=>{
        let AppInfo=refInfo.current?.value||"";
        let AppType=refType.current?.value||"";
        NetWorkUtility.AddApp(AppInfo,AppType).then((res)=>{
            NetWorkUtility.AllApp().then((res: any) => { setData(res.info.data) })
        })
    }
    return (
        <div className="AppOutSide" style={{ fontSize: 10,boxShadow: "rgba(0,0,0,.2) 0 1px 5px 0px"}}>
            <div className="centerStyle" style={{ width: "90%", height: 30, backgroundColor: "white"}}>
                <div className="centerStyle" style={{ width: "25%", height: "100%" }}>应用ID</div>
                <div className="centerStyle" style={{ width: "25%", height: "100%" }}>应用密钥</div>
                <div className="centerStyle" style={{ width: "25%", height: "100%" }}>应用信息</div>
                <div className="centerStyle" style={{ width: "25%", height: "100%" }}>权限信息</div>
            </div>
            {data && data.map(coverUserSingle)}
            {addStatus && 
            <div className="centerStyle" style={{ width: "90%", height: 30, backgroundColor: "white"}}>
                <input 
                    className="centerStyle inputInfo" 
                    style={{ width: "25%", height: "100%" }} 
                    disabled/>
                <input 
                    className="centerStyle inputInfo" 
                    style={{ width: "25%", height: "100%" }} 
                    disabled/>
                <input 
                    className="centerStyle inputInfo" 
                    style={{ width: "25%", height: "100%" }} 
                    placeholder={focus===2?"":"填写信息"} 
                    onFocus={()=>{setFocus(2)}} 
                    onBlur={()=>{setFocus(0)}} 
                    ref={refInfo}/>
                <input 
                    className="centerStyle inputInfo" 
                    style={{ width: "25%", height: "100%" }} 
                    placeholder={focus===3?"":"填写权限"} 
                    onFocus={()=>{setFocus(3)}} 
                    onBlur={()=>{setFocus(0)}} 
                    ref={refType}/>
            </div>
            }
            <div className="centerStyle" style={{ width: "20%", marginTop:20}}>
                {addStatus || <button className="buttonAdd" onClick={()=>{setAddStatus(true)}}>添加</button>}
                {addStatus && <button className="buttonAddLeft" onClick={()=>{registerApp()}}>提交</button>}
                {addStatus && <button className="buttonAddRight" onClick={()=>{setAddStatus(false)}}>取消</button>}
            </div>
            
        </div>
    )
}
export default AppManageAppList;