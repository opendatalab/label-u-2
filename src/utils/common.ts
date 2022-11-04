const commonController = {
  debounce(fn : any, delayTime : number){
    let timer : any = null //借助闭包
    return function(event : any) {
      if(timer || timer === 0){              // 进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。
        clearTimeout(timer)  // 所以要取消当前的计时，重新开始计时
        timer = setTimeout(()=>fn(event),delayTime)
      }else{
        timer = setTimeout(()=>fn(event),delayTime) // 进入该分支说明当前并没有在计时，那么就开始一个计时
      }
    }
  },
  bfs(id : number, datas : any[]){
    let node, curTree = [...datas];
    let parentIndexes : any = {};
    node = curTree.shift()
    while(node){
      if (node.id === id) {
        let result = commonController.deleteChild(node, id, parentIndexes);
        if (!result) {
          datas.splice(0, datas.length);
          break;
        }
      }

      if (node) {
        if (node.children && node.children.length > 0) {
          commonController.addParentIndex(node.children, node, parentIndexes);
          curTree.push(...node.children);
        }
      }

      node = curTree.shift();
    }
    return datas;
  },
  addParentIndex (children : any[], parent : any, parentIndexes : any) {
    for (let child of children) {
      parentIndexes[child['id']] = parent;
    }
  },
  deleteChild (parentNode : any, id : number, parentIndexes : any) {
    let newParentNode = parentIndexes[id];
    if (!newParentNode) {
      return false;
    }
    for (let childIndex = 0; childIndex < newParentNode.children.length; childIndex++) {
      let child = newParentNode.children[childIndex];
      if (child.id === id) {
        newParentNode.children.splice(childIndex, 1);
        break;
      }
    }
    return true;
  },
  dfs(name : string, datas : any[]){
    for (let data of datas) {
      if (data.name === name) {
        return [data]
      }
      if (data['children'] && data['children'].length > 0) {
        const res : any= commonController.dfs(name, data.children);
        if (res) return res;
      }
    }
    return null;
  }
}
export default commonController;
