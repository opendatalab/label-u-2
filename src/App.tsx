import React, { useState} from 'react';
import './App.css';
// import 'antd/dist/antd.css';
import { Button, Input  } from 'antd'
import commonController from "./utils/common";
import { data } from './utils/data';
import Family from './components/family';

import Test from './components/test';

const App = ()=>{
  const [currentDatas, setCurrentDatas] = useState(data);
  const [nickname, setNickName] = useState('');
  // const [c, setC] = useState(0)
  const changeInput = (event : any)=>{
    let nickname = event.target.value;
    setNickName(nickname);
    // if (nickname === '') {
    //   console.log(1);
    // }else{
    //   console.log(2);
    // };
  }
  // useEffect(()=>{
  //
  // },[])
  const searchDatas = ()=>{
    // console.log(nickname)
    const result = commonController.dfs(nickname.trim() , data);
    if (result) {
      setCurrentDatas(result);
    }else{
      setCurrentDatas([]);
    }
  }

  const deleteBranch = (id  : number)=>{
    let newDatas = commonController.bfs(id , data);
    // console.log(newDatas)
    setCurrentDatas(newDatas);
    if (newDatas && newDatas.length > 0) {
      setCurrentDatas(Object.assign([],newDatas));
    }else{
      setCurrentDatas([]);
    }
  }
  return (
    <div>
      <Test></Test>
      {/*<div className = 'outerFrame'>*/}
      {/*  <div className = "searchRow">*/}
      {/*    <Input placeholder = '请输入称呼'*/}
      {/*           style = {{flex : '1',width : '400px', height : '40px', marginRight : '20px'}}*/}
      {/*        onChange = {commonController.debounce(changeInput,1000)}*/}
      {/*    ></Input>*/}
      {/*    <Button type = 'primary' size = {'large'} onClick={commonController.debounce(searchDatas,1000)}>查询</Button>*/}
      {/*  </div>*/}
      {/*  <Family datas = {currentDatas} deleteBranch={deleteBranch} key = {new Date().getTime()}></Family>*/}
      {/*</div>*/}
    </div>
  );
}

export default App;
