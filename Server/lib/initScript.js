  	// description="Materialize Init"
	initScriptMaterialize=()=>{logF(initFab);M.Collapsible.init(document.querySelectorAll('.collapsible'), {});}
  initScriptUI=()=>{logF(initMainUI);logF(initOverlay);logF(initSideBar);logF(initDulieuUI);}
  	
  	var uiReady = false, staffListReady = false;
  	//Credit to:https://stackoverflow.com/questions/8835413/difference-between-load-vs-domcontentloaded
  	document.addEventListener("DOMContentLoaded", ()=>{
  		logF(checkLocalStorage);
  		logF(initFirebaseApp,{callback:()=>{logF(checkAccessToken);logF(onInitUploadEvent,'.fileUploadInitOnce');logF(initScriptMaterialize);logF(initScriptUI);logF(dataToMem);uiReady=true;setTimeout(()=>{logF(updateListDulieu);},2000);}});
  	});
