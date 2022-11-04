import React, { useState, useEffect } from 'react';
import '../../App.css';
// import { CloseCircleOutlined } from '@ant-design/icons';
import Parent from '../parent'
// import commonController from "../../utils/common";
interface IProps {
  datas : any,
  deleteBranch : any
}
const Family = (props : IProps)=>{
  const {  deleteBranch } = props;
  // const [currentDatas, setCurrentDatas] = useState(datas);

  const loopData : any = (datas : any[])=>{
    let result = [];
    for (let dataIndex = 0; dataIndex < datas.length; dataIndex++) {
      let currentData = datas[dataIndex];
      // if (!currentData.delete) {
        result.push(showDatas(currentData));
      // }
    }
    return result;
  }
  const showDatas = (currentBranch : any)=>{
    let children = currentBranch['children'];
    if (children.length > 0) {
      let childrenNewNode = loopData(currentBranch['children']);
      let parent = (<div className={'displayFlex flexDirectionColumn singleBranch '} key = { currentBranch['id'] +  new Date().getTime() + 'wrapper'}>
        <Parent name = { currentBranch['name'] } deleteBranch = {deleteBranch}
        id = { currentBranch['id'] }  key = { currentBranch['id'] + new Date().getTime() + '' }></Parent>
        <div  key = { new Date().getTime() + 'wrapperChild'} className='displayFlex flexDirectionRow son'>{childrenNewNode}</div>
      </div>)
      return parent;
    }else{
      return (
          <div className={'displayFlex flexDirectionColumn singleBranch '} key = { currentBranch['id'] +  new Date().getTime() + 'wrapperUnit'}>
            <Parent name = { currentBranch['name'] }  deleteBranch = {deleteBranch}
                    id = { currentBranch['id'] }   key = { `${currentBranch['id']}  ${new Date().getTime()} 2`}></Parent>
          </div>
          )
    }
  };
  const [showNewDatas, setShowNewDatas] = useState<any>(undefined);
  useEffect(()=>{
    let newDatas = loopData(props.datas);
    setShowNewDatas(newDatas);
  },[props.datas]);
  return (<div className='displayFlex flexDirectionRow showWholeData'>
    { showNewDatas }
  </div>)
}
export default Family;
