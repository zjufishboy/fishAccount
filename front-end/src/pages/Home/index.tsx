import React, {useState,useEffect,createRef,} from "react";
import {OtherUtility,NetWorkUtility} from '../../utils/utils'
import "./index.css";
import { IStatus } from "../../type/IStatus";


const AppHome = () => {
    const [isErr, setIsErr] = useState(false);
    const [errInfo, setErrInfo] = useState("登录失败");
    const refusername = createRef<HTMLInputElement>();
    const refpassword = createRef<HTMLInputElement>();
    useEffect(() => {
      document.title = "鱼塘登录系统"
    }, []);
    const login = () => {
      let info = OtherUtility.getUrlParam();
      let username = refusername.current?.value;
      let password = refpassword.current?.value;
      let data={...info,username,password}
      NetWorkUtility.Login(data).then((res:IStatus) => {
            if (!res.status){
              setIsErr(true);
              setErrInfo(res.detail)
            }
            else {
              setIsErr(false);
              window.location.href = `${info.redirect_uri}/callback?code=${res.info?.data.code}`;
            }
          }
        );
    };
    const register = () => {
      let username = refusername.current?.value;
      let password = refpassword.current?.value;
      if(username && password)
        NetWorkUtility.AddUser(username,password)
          .then((res: IStatus) => {
              if (!res.status)
                setIsErr(true);
              else {
                setIsErr(false);
                alert("注册成功");
              }
            }
          );
        else
            alert("账户或密码为空")
    };
    return (
      <div className="AppOutSide">
        <div className="App">
          <input
            type="text"
            placeholder="用户名"
            ref={refusername}
            className="inputs"
          />
          <input
            type="password"
            placeholder="密码"
            ref={refpassword}
            className="inputs"
          />
          <div className="buttonOutSide">
            <button
              onClick={login}
              className="buttonLeft"
            >
              登录
            </button>
            <button
              onClick={register}
              className="buttonRight"
            >
              注册
            </button>
          </div>
          {isErr && (
            <div
              style={{
                fontSize: "0.14rem",
                color: "red",
              }}
            >
              {errInfo}
            </div>
          )}
        </div>
      </div>
    );
  };
export default AppHome