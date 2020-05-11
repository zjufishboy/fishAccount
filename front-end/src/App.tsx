import React from "react";
import "./App.css";
import {Route,BrowserRouter as Router} from 'react-router-dom' 
import AppHome from "./pages/Home";
import AppManageUserList from "./pages/User";
import AppManageAppList from "./pages/App";
const App=()=>{
  return (
    <Router>
      <Route path="/" exact component={AppHome}/>
      <Route path="/manage" exact component={AppManageUserList}/>
      <Route path="/manage/user" exact component={AppManageUserList}/>
      <Route path="/manage/app" exact component={AppManageAppList}/>
    </Router>
  )
}
export default App;
