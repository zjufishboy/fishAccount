import React, { useState, useEffect, createRef, } from "react";
import {NetWorkUtility } from '../../utils/utils'
import "./index.css";
import { IUserInfo } from "../../type/IUserInfo";
const AppManageUserList = () => {
    const [data, setData] = useState([])
    const [focus, setFocus] = useState(0)
    const [addStatus, setAddStatus] = useState(false)
    const refName = createRef<HTMLInputElement>();
    const refPassword = createRef<HTMLInputElement>();
    useEffect(() => {
        document.title = "鱼塘登录系统-管理用户"
        updateData()
    }, [])
    const updateData = () => {
        NetWorkUtility.AllUser().then((res: any) => { setData(res.info.data) })
    }
    const coverUserSingle = (user: IUserInfo,index:number) => (
        <div style={{ width: "90%", height: 30, display: "flex", flexDirection: "row", backgroundColor: "white" }} key={index}>
            <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                {user.uid}
            </div>
            <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                {user.username}
            </div>
            <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                {user.password}
            </div>
            <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                {user.signature}
            </div>
        </div>
    )
    const registerUser=()=>{
        let UserName=refName.current?.value||"";
        let PassWord=refPassword.current?.value||"";
        NetWorkUtility.AddUser(UserName,PassWord).then((res)=>{
            NetWorkUtility.AllUser().then((res: any) => { setData(res.info.data) })
        })
    }
    return (
        <div className="AppOutSide" style={{ fontSize: 10 }}>
            <div className="centerStyle" style={{ width: "90%", height: 30, backgroundColor: "white", boxShadow: "rgba(0,0,0,.2) 0 1px 5px 0px" }}>
                <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                    用户ID
          </div>
                <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                    用户名
          </div>
                <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                    密码
          </div>
                <div className="centerStyle" style={{ width: "25%", height: "100%" }}>
                    签名
          </div>
            </div>
            {data && data.map(coverUserSingle)}
            {addStatus && 
            <div className="centerStyle" style={{ width: "90%", height: 30, backgroundColor: "white"}}>
                <input 
                    className="centerStyle inputInfo" 
                    style={{ width: "25%", height: "100%" }} 
                    placeholder={"用户ID自动生成"} 
                    disabled/>
                <input 
                    className="centerStyle inputInfo" 
                    style={{ width: "25%", height: "100%" }} 
                    placeholder={focus===2?"":"用户名"} 
                    type="text"
                    onFocus={()=>{setFocus(2)}} 
                    onBlur={()=>{setFocus(0)}} 
                    ref={refName}/>
                <input 
                    className="centerStyle inputInfo" 
                    type="password"
                    style={{ width: "25%", height: "100%" }} 
                    placeholder={focus===3?"":"填写密码"} 
                    onFocus={()=>{setFocus(3)}} 
                    onBlur={()=>{setFocus(0)}} 
                    ref={refPassword}/>
                <input 
                    className="centerStyle inputInfo" 
                    style={{ width: "25%", height: "100%" }} 
                    placeholder={"签名自动生成，未开放修改"} 
                    disabled/>
            </div>
            }
            <div className="centerStyle" style={{ width: "20%", marginTop:20}}>
                {addStatus || <button className="buttonAdd" onClick={()=>{setAddStatus(true)}}>添加</button>}
                {addStatus && <button className="buttonAddLeft" onClick={()=>{registerUser()}}>提交</button>}
                {addStatus && <button className="buttonAddRight" onClick={()=>{setAddStatus(false)}}>取消</button>}
            </div>
        </div>
    )
}
export default AppManageUserList