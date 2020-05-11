import React, { useState, useEffect, } from "react";
import {NetWorkUtility } from '../../utils/utils'
import "./index.css";
import { IUserInfo } from "../../type/IUserInfo";
const AppManageUserList = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        document.title = "鱼塘登录系统-管理用户"
        updateData()
    }, [])
    const updateData = () => {
        NetWorkUtility.AllUser().then((res: any) => { setData(res.info.data) })
    }
    const coverUserSingle = (user: IUserInfo) => (
        <div style={{ width: "90%", height: 30, display: "flex", flexDirection: "row", backgroundColor: "white" }}>
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
        </div>
    )
}
export default AppManageUserList