

function setGaugeValue(value) {
  const gauge = document.querySelector(".gauge");

  let gaugeFill = gauge.querySelector(".gauge__fill").style;
  gaugeFill.height = `${
    value
  }%`;
  if(value>10)
    gaugeFill.background = '#ecf542';
  if (value > 30)
    gaugeFill.background = '#f55442';
  if(value<11)
    gaugeFill.background = '#4bf542';
}

// setGaugeValue(gaugeElement, 0.3);
