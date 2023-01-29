// const gaugeElm = document.getElementsByClassName("gauge")[0];

var gauge=(function(){
  var publicData = {};

  publicData.setCode=(gaugeElm,code)=>{
    let gaugeValue = gaugeElm.getElementsByClassName("gauge__valueTx");
    gaugeValue[0].innerHTML = code;
    gaugeValue[1].style.display ='block';
    
    let percentage = 15;
    switch(code){
      case 15: percentage=100; break;
      case 14: percentage=95; break;
      case 13: percentage=90; break;
      case 12: percentage=85; break;
      case 11: percentage=80; break;
      case 10: percentage=75; break;
      case 9: percentage=70; break;
      case 8: percentage=65; break;
      case 7: percentage=60; break;
      case 6: percentage=55; break;
      case 5: percentage=50; break;
      case 4: percentage=45; break;
      case 3: percentage=40; break;
      case 2.5: percentage=37; break;
      case 2: percentage=35; break;
      case 1: percentage=30; break;
      case 0.5: percentage=27; break;
      case 0: percentage=25; break;
      default:  percentage=15; 
        gaugeValue[1].style.display ='none';
        gaugeValue[0].innerHTML = 'DRY';
    }
    setGaugeValue(gaugeElm,percentage);
  }

  publicData.noSignal=(gaugeElm)=>{
    let gaugeFill = gaugeElm.getElementsByClassName("gauge__fill")[0].style;
    gaugeFill.background = '#22333333';
  }

  setGaugeValue=(gaugeElm,percentage)=>{
    let gaugeFill = gaugeElm.getElementsByClassName("gauge__fill")[0].style;
    gaugeFill.height = `${percentage}%`;
    gaugeFill.top = `${100-percentage}%`;
    if(percentage>24)
      gaugeFill.background = '#ecf542';
    if (percentage > 39)
      gaugeFill.background = '#f55442';
    if(percentage<25)
      gaugeFill.background = '#4bf542';
  }
  return publicData;
})();
