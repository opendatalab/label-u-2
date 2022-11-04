import React, { useCallback, useState } from 'react';

// const click = ()=>{
//
// }
console.log(1)
const Test = ()=>{
  const click = ()=>{
      console.log(2)
  }
  return (<div onClick={click}>test</div>)
}
export default Test;