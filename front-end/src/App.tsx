import React, {useState,useEffect,createRef,} from "react";
import {OtherUtility,NetWorkUtility} from './utils/utils'
import "./App.css";
import { IStatus } from "./type/IStatus";
import {Route,BrowserRouter as Router} from 'react-router-dom' 
import { IUserInfo } from "./type/IUserInfo";


const AppHome = () => {
  const [isErr, setIsErr] = useState(false);
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
          if (!res.status)
            setIsErr(true);
          else {
            setIsErr(false);
            window.location.href = `${info.redirect_uri}/callback?code=${res.info}`;
          }
        }
      );
  };
  const register = () => {
    let info = OtherUtility.getUrlParam();
    let username = refusername.current?.value;
    let password = refpassword.current?.value;
    let data={...info,username,password}
    NetWorkUtility.Register(data)
      .then((res: IStatus) => {
          if (!res.status)
            setIsErr(true);
          else {
            setIsErr(false);
            window.location.href = `${info.redirect_uri}/callback?code=${res.info}`;
          }
        }
      );
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
            登录错误
          </div>
        )}
      </div>
    </div>
  );
};

const AppManage=()=>{
  const [data,setData]=useState([])
  useEffect( ()=>{
    updateData()
  },[])
  const updateData=()=>{
    NetWorkUtility.AllUser().then((res:any)=>{setData(res.info.data)})
  }
  const coverUserSingle=(user:IUserInfo)=>(
    <div style={{width:"90%",height:30,display:"flex",flexDirection:"row",backgroundColor:"white"}}>
      <div className="centerStyle" style={{width:"25%",height:"100%"}}>
        {user.uid}
      </div>
      <div className="centerStyle" style={{width:"25%",height:"100%"}}>
        {user.username}
      </div>
      <div className="centerStyle" style={{width:"25%",height:"100%"}}>
        {user.password}
      </div>
      <div className="centerStyle" style={{width:"25%",height:"100%"}}>
        {user.signature}
      </div>
    </div>
  )
  return (
    <div className="AppOutSide" style={{fontSize:10}}>
      <div className="centerStyle" style={{width:"90%",height:30,backgroundColor:"white",boxShadow:"rgba(0,0,0,.2) 0 1px 5px 0px"}}>
        <div className="centerStyle"  style={{width:"25%",height:"100%"}}>
          用户ID
        </div>
        <div className="centerStyle"  style={{width:"25%",height:"100%"}}>
          用户名
        </div>
        <div className="centerStyle"  style={{width:"25%",height:"100%"}}>
          密码
        </div>
        <div className="centerStyle"  style={{width:"25%",height:"100%"}}>
          签名
        </div>
      </div>
      {data&&data.map(coverUserSingle)}
    </div>
  )
}

const App=()=>{
  return (
    <Router>
      <Route path="/" exact component={AppHome}/>
      <Route path="/manage" exact component={AppManage}/>
    </Router>
  )
}
export default App;
