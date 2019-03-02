

const loaderOptions = {
  url: 'https://jsdev.arcgis.com/4.11/'
}

const poiRenderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
    style: "diamond",
    // color: [0, 171, 189],
    color: "#40F99B" ,
    // color: [106,255,0],
    // color: [0, 162, 180],
    size: "17px",  // pixels
    outline: {  // autocasts as new SimpleLineSymbol()
      color: [ 0, 0, 0 ],
      width: 1.5 // points
    }
  },
  visualVariables: [{
    type: "size",
    field: "raw_visit_counts",
    legendOptions: {title: "Visit Counts"},
    minSize: 4,
    maxSize: 30,
    minDataValue: 2000,
    maxDataValue: 8000
  }]

}

const highlightOptions = {
  color: "#ffffff",
  fillOpacity: 0.17
}



export {loaderOptions, poiRenderer, highlightOptions}