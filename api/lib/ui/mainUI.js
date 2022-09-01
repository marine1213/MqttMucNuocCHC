var obMain={}, obMainKeyList=['e','content','tieude','searchBar'];
var obMainIdList=['idMain','idMainContainer','idMainTieude','idMainSearch'];
initMainUI=()=>{initElm(obMain,obMainKeyList,obMainIdList);}

mainElmsHideOnSmall=()=>{var scrWidth=obView.vw()-obSidebar.e.offsetWidth; var kList=['contents'];
	[300].map((w,wInd)=>{obMain[kList[wInd]].display=(scrWidth)<w?'none':'block'})}
mainElmsUnhideOnSmall=()=>{['contents'].map((elm)=>{obMain[elm].display='block'})}


mainPopulateContent=(p)=>{setMainTitle(p);setMainList(p);}
setMainTitle=(p)=>{obMain.tieude.children[0].innerHTML=obSidebar.data[p.g].i[p.i]};
setMainList=(p)=>{
	var obSdp=obSidebar.data[p.g],mfc=mainData.filter; [mfc.sidebarSearchTerm,mfc.sidebarSearchTx]=[obSdp.c[p.i],obSdp.i[p.i]];
	getDonvi=(clickState)=>(clickState=='mine'||clickState=='mygroup')?mainData.user.madonvi:((clickState=='Duan')?'NAOC':clickState);
	mainData.view.state=getDonvi(obSdp.c[p.i]);
	if(uiReady) {logF(updateListDulieu);logF(uiSetPermission);mainData.temp = {list:[], type:''}}
};

uiSetPermission=()=>{var maquyen=mainData.user.maquyen; uiAuthorizing(bitSelect(maquyen,3),bitSelect(maquyen,2),bitSelect(maquyen,1),bitSelect(maquyen,0));}
uiAuthorizing=(addingRight,edittingRight,pheduyetRight,nhanvienRight)=>{
	obDulieu.plusc[addingRight==1?'remove':'add']("hidden");
	elmLoop(obDulieu.list,'dulieuEditCtrl',e=>e.classList[edittingRight==1?'remove':'add']('hidden'));
	elmLoop(obDulieu.list,'nhanvienCtrl',e=>e.classList[nhanvienRight==1?'remove':'add']('hidden'));
	elmLoop(obDulieu.list,'pheduyetCtrl',e=>e.classList[pheduyetRight==1?'remove':'add']('hidden'));
}
bitSelect=(input,challenge)=>((input>>challenge)&1);
var lockMainSearch=false;
mainSearch=(p)=>{ lockMainSearch=true;if((mainData.filter.mainSearchTerm=p.elm.value).length<10)
		setTimeout(()=>{mainSearchTrigger(()=>{sidebarItemClick(obSidebar.active);lockMainSearch=false})},2000);else{mainSearchTrigger(()=>{sidebarItemClick(obSidebar.active);lockMainSearch=false})}}



		