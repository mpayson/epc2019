const getMonthFromTime = (time) => {
  switch(time) {
    // case 1:
    //   return "Feb 2018"
    // case 2:
    //   return "Mar 2018"
    // case 3:
    //   return "Apr 2018"
    // case 4:
    //   return "May 2018"
    // case 5:
    //   return "Jun 2018"
    // case 6:
    //   return "Jul 2018"
    // case 7:
    //   return "Aug 2018"
    case 0:
      return "Sep 2018"
    case 1:
      return "Oct 2018"
    case 2:
      return "Nov 2018"
    case 3:
      return "Dec 2018"
    case 4:
      return "Jan 2019"
    default:
      return "Jan 2019"
  }
}

const sumStops = [
  // {"value":5,"color":[124,61,88,255],"label":"\u003c 5"},
  // {"value":10,"color":[195,51,129,255],"label":null},
  // {"value":15,"color":[232,79,166,255],"label":"15"},
  // {"value":20,"color":[236,144,198,255],"label":null},
  // {"value":25,"color":[255,240,255,255],"label":"\u003e 25"}
  {"value":25,"color":[214,193,215,255],"label":"\u003c 25"},
  {"value":20,"color":[215,181,216,255],"label":null},
  {"value":15,"color":[223,101,176,255],"label":"15"},
  {"value":10,"color":[221,28,119,200],"label":null},
  {"value":5,"color":[152,0,67,200],"label":"\u003e 5"}
  // {"value":24,"color":[255,229,240,255],"label":"\u003c 24"},
  // {"value":16,"color":[215,181,216,255],"label":null},
  // {"value":12,"color":[223,101,176,255],"label":"12"},
  // {"value":8,"color":[203,26,109,255],"label":null},
  // {"value":4,"color":[113,18,60,255],"label":"\u003e 4"}
]

const getTimeOpcStops = (v, gap) => {
  let steps = [];
  if(v - gap >= 0) {
    steps.push({
      opacity: 0.0,
      value: v - gap,
      // label: timeStrFromQuarter(v - gap)
    })
  }
  steps.push({
    opacity: 1,
    value: v,
    // label: timeStrFromQuarter(v)
  })
  if(v + gap <= 12){
    steps.push({
      opacity: 0.0,
      value: v + gap,
      // label: timeStrFromQuarter(v + gap)
    })
  }
  return {
    type: 'opacity',
    field: 'time',
    stops: steps,
    legendOptions: {showLegend: false}
  }
}

const getBlockCountRenderer = (time=12) => {
  const defaultRenderer = {
    type: "simple",
    symbol: {type: "simple-fill", outline: {width: 0.1, color: [255,255,255,0.2]}, size: 4, color: 'rgba(255,255,255,0)'},
    visualVariables: [{
      type: "color",
      field: "count_",
      stops: sumStops,
      legendOptions: {title: "Visit Counts"}
    }],
  }
  if(!time) return defaultRenderer;
  const opcVV = getTimeOpcStops(time, 1);
  defaultRenderer.visualVariables.push(opcVV);
  return defaultRenderer;
}

// IIf( condition, trueValue, falseValue ) 
const getBlockDenseRenderer = (mapView) => {
  return {
    type: "dot-density",
    referenceDotValue: 35,
    outline: null,
    referenceScale: mapView.scale,
    legendOptions: {
      unit: "visits"
    },
    attributes: [{
      // field: "THHGRPL13",
      valueExpression: '100 * IIf($feature.TLIFENAME == "Next Wave", $feature.count_, 0)',
      label: "Next Wave",
      color: "#E3458F" //dark pink
    }, {
      // field: "THHGRPL2",
      valueExpression: '100 * IIf($feature.TLIFENAME == "Upscale Avenues", $feature.count_, 0)',
      label: "Upscale Avenues",
      color: "#C04CFD" // purple
      // color: "#5E2BFF" // dark blue
    }, {
      // field: "THHGRPL7",
      valueExpression: '100 * IIf($feature.TLIFENAME == "Ethnic Enclaves", $feature.count_, 0)',
      label: "Ethnic Enclaves",
      color: "#EF8354" //orange
    }, {
      // field: "THHGRPL11",
      // valueExpression: '100 * IIf($feature.TLIFENAME == "Midtown Singles", $feature.count_, 0)',
      // label: "Midtown Singles",
      valueExpression: '100 * IIf(IndexOf(["Upscale Avenues", "Ethnic Enclaves", "Next Wave"], $feature.TLIFENAME) < 0, $feature.count_, 0)',
      label: "Other",
      // color: "#40F99B" // green
      color: "#5E2BFF" // dark blue
    }]
  }
}

const getTimeFilter = (time=12) => {
  return {
    where: `time = ${Math.round(time)}`
  }
}

const getBlockHlFilter = (highlight=null) => {
  const where = highlight
    ? `safegraph_place_id = 'sum' OR safegraph_place_id = '${highlight}'`
    : `safegraph_place_id = 'sum'`;
  return {
    where
  }
}

const getBlockTimeHlFilter = (highlight, time) => {
  const where = `${getTimeFilter(time).where} AND (${getBlockHlFilter(highlight).where})`
  return {
    where: where
  }
}

const getBlockHlEffect = (highlight=null) => {

  if(!highlight) return null;

  return {
    filter: {
      where: `safegraph_place_id = '${highlight}'`
    },
    insideEffect: "contrast(1.5)",
    outsideEffect: "grayscale(0.5) opacity(60%) contrast(30%)"
    // outsideEffect: "contrast(10%) grayscale(0.8) opacity(1%)"
  }
}

const hideFilter = {
  where: `safegraph_place_id = 'note here'`
}

export{getMonthFromTime, getBlockCountRenderer, getBlockDenseRenderer,
getTimeFilter, getBlockHlFilter, getBlockHlEffect, getBlockTimeHlFilter, hideFilter}