import React, {useState} from "react";
import { CloseCircleOutlined } from '@ant-design/icons';
interface IProps {
  name : string,
  deleteBranch : any,
  id : number
}
const Parent = (props : IProps)=>{
  const { id, name, deleteBranch} = props;
  const [isShowClose, setIsShowClose] = useState(false);
  const setShowClose = ()=>{
    setIsShowClose(!isShowClose);
  }
  return (<div className='parent' onMouseEnter={setShowClose}
       onMouseLeave={setShowClose}>{ name }
    {isShowClose && <div className = 'rightCorner'>
      <CloseCircleOutlined style = {{color : 'red'}}
      onClick = {()=>deleteBranch(id)}></CloseCircleOutlined>
    </div>}
  </div>)
}
export default Parent;
