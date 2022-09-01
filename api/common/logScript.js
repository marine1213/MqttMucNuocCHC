// description="debug"
  logF=(functionObj,paramObj,param2)=>{console.log(`${functionObj.name}(${JSON.stringify(paramObj)})`); functionObj(paramObj,param2);};
  logE=(information,error)=>{if(information)console.log(information);if(error)console.error(error)}
  logO=(information,error)=>{logE(information,error);return information;}

  tryLoop=(arr,arrFunction)=>{var kIdx=-1;try{arr.forEach((k,idx)=>arrFunction(k,kIdx=idx))}catch(e){logE('errIdx='+kIdx,e.stack)}}
  elmLoop=(elmScope,elmClass,arrFunction)=>{tryLoop(Array.from(elmScope.getElementsByClassName(elmClass)),(k,idx)=>arrFunction(k,idx))}
//=================================================