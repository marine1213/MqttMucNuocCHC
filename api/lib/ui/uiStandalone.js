itemStateSelected=(p)=>{
	var cont=p.elm.parentElement.parentElement.nextElementSibling;
	var contc=cont.classList,cont1c=cont.children[1].classList,cont0c=cont.children[0].classList;
	var lastState = contc.contains('hidden')?0:cont0c.contains('hidden')?3:2;
	var state = (lastState==p.state)?0:p.state,cList=[contc,cont0c,cont1c],sList=null;
	switch(state){
		case 0: sList=[true];break;case 2: sList=[false,false,true];break;case 3: sList=[false,true,false];break;
		default: alert('wrong item state'); throw 'wrong item state';
	}
	sList.map((s,sInd)=>{cList[sInd].toggle('hidden',s);});
}