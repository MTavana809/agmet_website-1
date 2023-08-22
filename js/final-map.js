'use strict'; // https://javascript.info/strict-mode for explanation

require([
    'esri/Map',
    'esri/Basemap',
    'esri/geometry/Point',
    'esri/views/MapView',
    'esri/widgets/ScaleBar',
    'esri/widgets/Slider',
    'esri/widgets/Home',
    'esri/widgets/Legend',
    'esri/layers/ImageryLayer',
    'esri/layers/support/RasterFunction',
    'esri/layers/support/MosaicRule',
    'esri/layers/support/DimensionalDefinition',
    'esri/layers/MapImageLayer',
    'esri/renderers/RasterStretchRenderer',
    'esri/rest/support/AlgorithmicColorRamp', // moved from esri/tasks/support after 4.19 // bug after 4.21
    'esri/rest/support/MultipartColorRamp', // moved from esri/tasks/support after 4.19
    'esri/rest/support/ImageHistogramParameters', // moved from esri/tasks/support after 4.19
    'esri/popup/content/LineChartMediaInfo'
], (Map,
    Basemap,
    Point,
    MapView,
    ScaleBar,
    Slider,
    Home,
    Legend,
    ImageryLayer,
    RasterFunction,
    MosaicRule,
    DimensionalDefinition,
    MapImageLayer,
    RasterStretchRenderer,
    AlgorithmicColorRamp,
    MultipartColorRamp,
    ImageHistogramParameters,
    LineChartMediaInfo) => {

    // new basemap definition
    const basemap = new Basemap({
        portalItem: {
            id: '54140d826fe34135abb3b60c157170dc' // os_open_greyscale_no_labels
        }
    });

    // create map
    const map = new Map({
        basemap: basemap,
        layers: [] // add layers later
    });

    // create 2D view for the Map
    const view = new MapView({
        container: 'mapDiv',
        map: map,
        //extent: new Extent({xmin: -500, ymin: 7500, xmax: 656500, ymax: 1218500, spatialReference: 2770}) //,
        center: new Point({ x: 250000, y: 520000, spatialReference: 27700 }), // reprojected to allow OS basemap
        scale: 5500000
        //zoom: 6.5
    });

    
    // Create a logo element and add it to the map container
    const logoElement = document.createElement('a');
    logoElement.href = 'https://www.hutton.ac.uk/'; 
    logoElement.target = '_blank'; // Open the link in a new tab
    logoElement.style.position = 'absolute';
    logoElement.style.top = '10px'; 
    logoElement.style.right = '10px'; 
    logoElement.style.width = '100px'; 
    
    const logoImg = document.createElement('img');
    logoImg.src = 'img/logo.jpg'; 
    logoImg.style.width = '100%'; 
    
    logoElement.appendChild(logoImg);
    document.getElementById('mapDiv').appendChild(logoElement);

    /******************************
     * Renderers for Layers -- aka symbology
     * ****************************/

// create renderer for countOfDay

let colorRamp1 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#3288bd",
    toColor: "#66c2a5"
});
let colorRamp2 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#66c2a5",
    toColor: "#abdda4"
});
let colorRamp3 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#abdda4",
    toColor: "#e6f598"
});
let colorRamp4 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#e6f598",
    toColor: "#ffffbf"
});
let colorRamp5 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#ffffbf",
    toColor: "#fee08b"
});
let colorRamp6 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#fee08b",
    toColor: "#fdae61"
});
let colorRamp7 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#fdae61",
    toColor: "#f46d43"
});
let colorRamp8 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#f46d43",
    toColor: "#d53e4f"
});

let combineColorRamp = new MultipartColorRamp({
    colorRamps: [colorRamp1, colorRamp2, colorRamp3, colorRamp4, colorRamp5, colorRamp6,
        colorRamp7, colorRamp8]
});

// Esri color ramps - Heat Stress 

const colorRamp61 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#006837',
    toColor: '#1A9850'
});
const colorRamp62 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#1A9850',
    toColor: '#66BD63'
});
const colorRamp63 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#66BD63',
    toColor: '#A6D96A'
});
const colorRamp64 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#A6D96A',
    toColor: '#D9EF8B'
});
const colorRamp65 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#D9EF8B',
    toColor: '#FFFFBF'
});
const colorRamp66 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#FFFFBF',
    toColor: '#FEE08B'
});
const colorRamp67 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#FEE08B',
    toColor: '#FDAE61'
});
const colorRamp68 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#FDAE61',
    toColor: '#F46D43'
});
const colorRamp69 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#F46D43',
    toColor: '#D73027'
});
const colorRamp70 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: '#D73027',
    toColor: '#A50026'
});

const heatPlant = new MultipartColorRamp({
    colorRamps: [colorRamp61, colorRamp62, colorRamp63, colorRamp64, colorRamp65, colorRamp66,
        colorRamp67, colorRamp68, colorRamp69, colorRamp70]
});

let renderer = new RasterStretchRenderer({
    colorRamp: heatPlant,
    stretchType: 'min-max',
    statistics:[{
        max: 140,
        min: 0
    }],

});

 //color ramps - Rainfall

let colorRamp11 = new AlgorithmicColorRamp({
      algorithm: 'hsv',
      fromColor: "#c67718",
      toColor:  "#f29526"
});
let colorRamp12 = new AlgorithmicColorRamp({
      algorithm: 'hsv',
      fromColor: "#f29526",
      toColor: "#fbb664"
});
let colorRamp13 = new AlgorithmicColorRamp({
      algorithm: 'hsv',
      fromColor: "#fbb664",
      toColor:  "#fdcc92"
});
let colorRamp14 = new AlgorithmicColorRamp({
      algorithm: 'hsv',
      fromColor:  "#fdcc92",
      toColor:  "#ffe7c7"
});
let colorRamp15 = new AlgorithmicColorRamp({
    algorithm: 'hsv',
    fromColor:  "#ffe7c7",
    toColor:  "c6d8da"
});
let colorRamp16 = new AlgorithmicColorRamp({
    algorithm: 'hsv',
    fromColor:  "c6d8da",
    toColor:  "#8cc9ed"
});
let colorRamp17 = new AlgorithmicColorRamp({
    algorithm: 'hsv',
    fromColor:  "#8cc9ed",
    toColor:  "#50a7da"
});
let colorRamp18 = new AlgorithmicColorRamp({
    algorithm: 'hsv',
    fromColor:  "#50a7da",
    toColor:  "#007ac2"
});
let colorRamp19 = new AlgorithmicColorRamp({
    algorithm: 'hsv',
    fromColor:  "#007ac2",
    toColor:  "#00619b"
});
  
const colorRain = new MultipartColorRamp({
      colorRamps: [colorRamp11, colorRamp12, colorRamp13, colorRamp14, colorRamp15,
                   colorRamp16, colorRamp17,colorRamp18,colorRamp19]
    });
      
// create renderer for temperature

let colorRamp21 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#2166ac",
    toColor:  "#4393c3"
});
let colorRamp22 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:  "#4393c3",
    toColor: "#92c5de"
});
let colorRamp23 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#92c5de",
    toColor: "#d1e5f0"
});
let colorRamp24 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#d1e5f0",
    toColor: "#f7f7f7"
});
let colorRamp25 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#f7f7f7",
    toColor: "#fddbc7"
});
let colorRamp26 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#fddbc7",
    toColor: "#f4a582"
});
let colorRamp27 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#f4a582",
    toColor: "#d6604d"
});
let colorRamp28 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#d6604d",
    toColor: "#b2182b"
});

let colortemp = new MultipartColorRamp({
    colorRamps: [colorRamp21, colorRamp22, colorRamp23, colorRamp24, colorRamp25, colorRamp26,
        colorRamp27, colorRamp28]
});

// Esri color ramps - Esri Blue 2
let colorRamp41 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:"#ffffd9",
    toColor: "#a6d8f6"
});
let colorRamp42 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:"#a6d8f6",
    toColor: "#8cc9ed"
});
let colorRamp43 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:"#8cc9ed",
    toColor: "#6bb6e3"
});
let colorRamp44 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:"#6bb6e3",
    toColor: "#49a4d8"
});
let colorRamp45 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#49a4d8",
    toColor:  "#2891ce"
});
let colorRamp46 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:  "#2891ce",
    toColor: "#1480bf"
});
let colorRamp47 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#1480bf",
    toColor: "#006eaf"
});
let colorRamp48 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#006eaf",
    toColor: "#00619b"
});
let colorRamp49 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#00619b",
    toColor: "#10305e"
});

let colorBG = new MultipartColorRamp({
    colorRamps: [colorRamp41, colorRamp42, colorRamp43, colorRamp44, colorRamp45, colorRamp46,
        colorRamp47, colorRamp48, colorRamp49]
});

// Esri color ramps - Esri Blue3
let colorRamp512 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#ecb356",
    toColor: "#edf8b1"
});
let colorRamp511 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#edf8b1",
    toColor: "#ffffd9"
});
let colorRamp51 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:"#ffffd9",
    toColor: "#a6d8f6"
});
let colorRamp52 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:"#a6d8f6",
    toColor: "#8cc9ed"
});
let colorRamp53 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:"#8cc9ed",
    toColor: "#6bb6e3"
});
let colorRamp54 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:"#6bb6e3",
    toColor: "#49a4d8"
});
let colorRamp55 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#49a4d8",
    toColor:  "#2891ce"
});
let colorRamp56 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:  "#2891ce",
    toColor: "#1480bf"
});
let colorRamp57 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#1480bf",
    toColor: "#006eaf"
});
let colorRamp58 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#006eaf",
    toColor: "#00619b"
});
let colorRamp59 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#00619b",
    toColor: "#10305e"
});

let colorBY = new MultipartColorRamp({
    colorRamps: [colorRamp512, colorRamp511,colorRamp51, colorRamp52, colorRamp53, colorRamp54, colorRamp55, colorRamp56,
        colorRamp57, colorRamp58, colorRamp59]
});
      

    /******************************
     * Layer rules
     * ****************************/
    // create server-defined raster function
    let serviceRasterFunction = new RasterFunction({
        functionName: 'plantheatstress_count'
    });
    
    // set initial variable and dimension on mosaic dataset
    const yearDefinition = new DimensionalDefinition({
        variableName: 'plantheatstress_count',
        dimensionName: 'Year',
        values: [2021], // yearSlider start
        isSlice: true
    });

    // create mosaicRule and set multidimensionalDefinition
    let mosaicRule = new MosaicRule({
        multidimensionalDefinition: [yearDefinition]
    });

    // Set up popup template
    let indicatorLayerPopupTemplate = {
        title: '',
        content: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 25\u00B0C',
        fieldInfos: [{
            fieldName: 'Raster.ItemPixelValue',
            format: {
                places: 0,
                digitSeparator: true
            }
        }]
    };

    // remove dockability
    view.popup = {
        dockOptions: {
            buttonEnabled: false
        }
    };

    //function to close popupTemplate if open
    const closePopup = () => {
        if (view.popup.visible) {
            view.popup.close()
        }
    };

    // // set the histogram parameters to request
    // // data for the current view extent and resolution
    // var params = new ImageHistogramParameters({
    //     geometry: view.extent
    // });

    // create and add imagery layer to view

// Adding Ensembles

let map1 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Mean/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate 
  };

  let map2 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_15/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate 
  };
  
  let map3 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_13/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };
  

  let map4 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_12/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map5 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_11/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map6 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_10/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map7 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_9/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map8 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_8/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map9 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_7/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map10 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_6/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map11 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_5/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map12 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_4/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map13 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/Ensemble_1/ImageServer',
    mosaicRule: mosaicRule,
    renderer: renderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  // Initialize the indicator layer with the default selected map
let selectedMap = map1;
let indicatorLayer = new ImageryLayer(selectedMap);
map.add(indicatorLayer);

// Add Selector Title
const title = document.createElement('p');
title.textContent = 'Select Ensemble:';
title.style.margin = '0 10px 10px 10px';

// Add Selector Container
const selectorContainer = document.createElement('div');
selectorContainer.setAttribute('id', 'selectDiv');
selectorContainer.setAttribute('class', 'esri-widget');
selectorContainer.setAttribute('style', 'padding: 0 10px 10px 10px;background-color:white;');
selectorContainer.setAttribute('title', 'Select Agrometeorological Indicator to display on the map');
selectorContainer.appendChild(title);

// Add Selector
const selector = document.createElement('select');
const layerOptions = [
  { value: 'map1', text: 'Mean of Ensembles' },
  { value: 'map2', text: 'Ensemble 15- 1.1°C warmer, 9% wetter' },
  { value: 'map3', text: 'Ensemble 13- 2.0°C warmer, 2.5 % drier' },
  { value: 'map4', text: 'Ensemble 12- 3.8°C warmer, 3% drier' },
  { value: 'map5', text: 'Ensemble 11- 2.6°C warmer, 7% wetter' },
  { value: 'map6', text: 'Ensemble 10- 1.9°C warmer, 1% drier' },
  { value: 'map7', text: 'Ensemble 9- 1.9°C warmer, 2% wetter' },
  { value: 'map8', text: 'Ensemble 8- 1.9°C warmer, 7% wetter' },
  { value: 'map9', text: 'Ensemble 7- 1.6°C warmer, 1% drier' },
  { value: 'map10', text: 'Ensemble 6- 2.0°C warmer, 2% wetter' },
  { value: 'map11', text: 'Ensemble 5- 2.1°C warmer, 3% drier' },
  { value: 'map12', text: 'Ensemble 4- 2.2°C warmer, 1% drier' },
  { value: 'map13', text: 'Ensemble 1- 2.1°C warmer, 1% wetter' },
];
layerOptions.forEach(option => {
  const optionElement = document.createElement('option');
  optionElement.value = option.value;
  optionElement.text = option.text;
  selector.add(optionElement);
});

// Add the same class and style attributes as selectDiv
selector.setAttribute('class', 'esri-widget');
selector.setAttribute('style', 'background-color:white;');
selector.setAttribute('style', 'width: 280px;')

selectorContainer.appendChild(selector);
view.ui.add(selectorContainer, 'top-left');

  

     // Listen to the value change event of the selector
    selector.addEventListener('change', function() {
         // Update year definition with the selected year and indicator
        let selectedIndicator = selectFilter.value;
        let selectedYear = parseInt(yearSlider.value);
         yearDefinition.values = [selectedYear];
    
         // Update the selected map based on the selector's value
        if (this.value === 'map1') {
        selectedMap = map1;
        } else if (this.value === 'map2') {
        selectedMap = map2;
        } else if(this.value === 'map3') {
            selectedMap = map3;
        } else if (this.value === 'map4') {
            selectedMap = map4;
        } else if (this.value === 'map5') {
            selectedMap = map5;
        } else if (this.value === 'map6') {
            selectedMap = map6;
        } else if (this.value === 'map7') {
            selectedMap = map7;
        } else if (this.value === 'map8') {
            selectedMap = map8;
        } else if (this.value === 'map9') {
            selectedMap = map9;
        } else if (this.value === 'map10') {
            selectedMap = map10;
        } else if (this.value === 'map11') {
            selectedMap = map11;
        } else if (this.value === 'map12') {
            selectedMap = map12;
        } else if (this.value === 'map13') {
            selectedMap = map13;
        }

         // Update the indicator layer with the selected map
        console.log('Selected map:', selectedMap);
        indicatorLayer.url = selectedMap.url;
        indicatorLayer.renderer = selectedMap.renderer;
        indicatorLayer.renderingRule = selectedMap.renderingRule;
        indicatorLayer.opacity = selectedMap.opacity;
        indicatorLayer.popupTemplate = selectedMap.popupTemplate;
        console.log('Indicator layer:', indicatorLayer);

         // Update the indicator dropdown to the selected indicator
        selectFilter.value = yearDefinition.variableName;


         // Create a new mosaic rule with the updated year definition
        mosaicRule = new MosaicRule({
          multidimensionalDefinition: [yearDefinition]
        });

         // Update the indicator layer mosaic rule with the new mosaic rule
        indicatorLayer.mosaicRule = mosaicRule;

        changeIndicator(selectedIndicator);
        changeDescriptors(selectedIndicator);
        stopAnimation();
        closePopup();

    });
  
  
  
       // // request for histograms for the specified parameters
    // indicatorLayer.computeHistograms(params).then(function(results) {
    //         // results are returned and process it as needed.
    //         console.log("histograms and stats", results);
    //     })
    //     .catch(function(err) {
    //         console.log("err", err)
    //     });

    // // request for histograms and statistics for the specified parameters
    // indicatorLayer.computeStatisticsHistograms(params).then(function(results) {
    //         // results are returned and process it as needed.
    //         console.log("histograms and stats", results);
    //     })
    //     .catch(function(err) {
    //         console.log("err", err)
    //     });

    /******************************
     * programmatically make selectors
     *******************************/
     const indicators = {
        'accumulatedfrost_degreedays': {
            desc: 'Accumulated Frost (degree days)',
            html: '<br> The Accumulated Frost Days Indicator is the sum of degree days when the minimum temperature per day is below zero. It thus accumulates the amount of cold temperature per day when the minimum temperature is below zero. It shows where cold temperatures are more likely to be experienced for longer. <br><br><b>Calculation:</b> <i> ∑ of day degrees where Tmin < 0.0 °C', 
            legend: 'Accumulated Frost (degree days): sum of degree days where Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C',
            read: '<b>How to Read the Map: </b> </br> The Accumulated Frost Days Indicator is the sum of degree days when the minimum temperature per day is below zero.'
        },
        'airfrost_count': {
            desc: 'Air Frost (count of days)',
            html: '<br> The Air Frost Indictor is the count of the number of days when the minimum temperature is below zero. This is when we might expect to experience a frost in the air, so is the number of days when air frost is likely to occur. <br><br><b>Calculation:</b> <i> Days when Tmin < 0.0 °C ',
            legend: 'Air Frost (count of days): count of days when Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'end_growingseason': {
            desc: 'End of Growing Season (day of year)',
             html: '<br> The End of Growing Season Indicator is the date when there has been five consecutive days when the average temperature is less than 5.6°C (starting from 1st July). It tells us approximately when grass may be expected to stop growing. Whilst warmer temperatures may follow these consecutive days and grass is still able to grow, it is a useful indication of when crop growth ends and also when trafficability (on soil) issues may arise and livestock may start to be housed. <br><br><b>Calculation:</b> <i> Day when 5 consecutive days Tavg < 5.6 °C (from July 1st) ', 
            legend: 'End of Growing Season (day of year): day when 5 consecutive days Tavg < 5.6\u00B0C from 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when average temperature for five consecutive days is less than 5.6\u00B0C from 1 July',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'first_airfrost_doy': {
            desc: 'First Autumn Air Frost(day of year)',
             html: '<br> The First Autumn Air Frost Indicator is the first day after the 1st July when the minimum temperature falls below freezing (0.0°C). It tells us the first day in autumn when there is likely to be an air frost. It can be seen as an indicator of when field operations may cease and crops are vulnerable to damage. A later day in the year also indicates an extension to the growing season and is associated with higher minimum temperatures. A delay in the first autumn air frost may also impact on the timing and rate of biological processes. <br><br><b>Calculation:</b> <i> Day when Tmin < 0.0 °C (from July 1st)',
            legend: 'First Autumn Air Frost: Low (early, 1st July); High (late, 31st December). first day when Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C from 1 July',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'first_grassfrost_doy': {
            desc: 'First Autumn Grass Frost (day of year) ',
             html: '<br> The First Autumn Grass Frost Indictor is the first day after the 1st July when the temperature is less than 5°C. An air temperature below 5°C means there is a risk of grass frost occurring. <br><br><b>Calculation:</b> <i> Day when Tmin < 5.0 oC (from July 1st)',
            legend: 'First Autumn Grass Frost: Low (early, 1st July); High (late, 31st December). first day when Tmin < 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C from 1 July',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'grassfrost_count': {
            desc: 'Grassfrost Count (count of days)',
             html: '<br> The Grass Frost Indicator is the number of days in a year when minimum temperature is less than 5.0°C and represents the total number of days when grass frost may occur. <br><br><b>Calculation:</b> <i> Count of days per year when Tmin < 5.0°C  ',
            legend: 'Grassfrost (count of days): count of days when Tmin < 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'growing_degreedays': {
            desc: 'Growing Degree Days',
             html: '<br> The Growing Degree Days Indicator represents thermal time accumulation in degree days and is the count of above days when the average temperature is above 5.6°C. It tells us how quickly thermal time is accumulated, and thus how more rapidly plants and insects may progress through their development stages (phenology). <br><br><b>Calculation:</b> <i> ∑ Tavg > 5.6 °C ',
            legend: 'Growing (degree days): sum Tavg > 5.6\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'growing_season': {
            desc: 'Growing Season (count of days)',
             html: '<br> The Growing Season Indicator is the count of the number of days in a year when temperature is above 5°C, start from the first period in the year when there are 5 consecutive days above 5°C and ending when there are 5 consecutive days below 5°C. It gives a general representation of how many days in a year plant growth and other biological activity may occur. It is one of three ways of representing the growing season period: see also growing Season Length and Growing Season Range. <br><br><b>Calculation:</b> <i> beginning when the temperature on five consecutive days exceeds 5°C, and ending when the temperature on five consecutive days is below 5°C ', 
            legend: 'Growing Season (count of days): beginning when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'growseason_length': {
            desc: 'Growing Season Length (count of days)',
             html: '<br> The Growing Season Length Indicator is the count of the number of days when daily average temperature is above 5.6°C between the Start and End of the Growing Season (these are two other types of Indicators). Days when average temperatures are above 5.6°C are ones where grass is likely to grow. It is different from the Growing Season Range in that it covers individual days when average temperature is above 5.6°C and thus all the days when grass may grow. However, it does not take account if days when grass may not grow due to stresses such as water or nitrogen limitations. <br><br><b>Calculation:</b> <i> Days when Tavg > 5.6 °C between Start and End of Growing Season. ', 
            legend: 'Growing Season Length (count of days): days when Tavg > 5.6\u00B0C between start and end of growing season',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C between the start and the end of growing season',
            read: '<b>How to Read the Map: </b> </br> '
        },
       'growseason_range': {
            desc: 'Growing Season Range (count of days)',
             html: '<br> The Growing Season Range Indicator is the count of days between the Start and End of Growing Season, thus is derived from these other two Indicators. It tells us how the growing season range has and may change.It is different from the Growing Season Length indicator in that it does not include all days when the temperature is above 5.6°C. (e.g. when less that the consecutive 5 days).   <br><br><b>Calculation:</b> <i> count of days between the start and end of the growing season. Start of Growing Season: Day when 5 consecutive days Tavg > 5.6 °C (from Jan 1st). End of Growing Season: Day when 5 consecutive days Tavg < 5.6 °C (from July 1st). ',
            legend: 'Growing Season Range (count of days): days between start and end of growing season',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> calculated from the count of days between the start and end of the growing season',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'heating_degreedays': {
            desc: 'Building Heating Requirement (Degree Days) ',
             html: '<br> Building Heating Requirement (Degree Days) Indicator is the sum of temperatures below a threshold, in this case the sum of 15.5°C minus the average temperature when this is less than 15.5°C. In other words, it accumulates thermal time below the 15.5°C threshold. It is used to provide information about the requirement to heat buildings. This information tells us when the need to use energy for heating buildings increases or decreases (fewer degree days = less heating requirement). <br><br><b>Calculation:</b> <i> ∑ 15.5 °C - Tavg where Tavg < 15.5 °C ', 
            legend: 'Building Heating Requirement (Degree Days): Sum of 15.5\u00B0C minus Tavg where Tavg < 15.5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> representing the sum of 15.5\u00B0C minus the average temperature where the average temperature is less than 15.5\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        //'heatwave_n': {
           // desc: 'Number of Heatwave Days (count of days)',
             //html: '<br> The Heat Wave Length Indicator is the maximum count in a year of the number of days when the daily maximum temperature is above the long-term average maximum temperature (estimated from the 1960-1990 period) and an additional 3°C for at least 6 consecutive days. It represents the longest period in a year when the maximum temperature is at least 3°C above the historical long-term average for at least 6 consecutive days.  <br><br><b>Calculation:</b> <i> Maximum count of consecutive days when Tmax >Avg Tmax (baseline year) + 3.0 oC (minimum 6 days) ', 
            //legend: 'Heatwave (count of days): Max count of consecutive days when Tmax > avgTmax (baseline year) + 3\u00B0C (min 6 days)',
            //popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than the average temperature in a baseline year plus 3\u00B0C'
        //},
        'last_airfrost_doy': {
            desc: 'Last Spring Air Frost (day of year)',
             html: '<br> The Last Spring Air Frost is the last day from 1st January, but before the 1st July, when the minimum temperature is below zero. It tells us the day of year on which the last air frost may occur in spring. Earlier dates imply the opportunity for the growing season to start sooner and avoid risk of frost damage. <br><br><b>Calculation:</b> <i> The last day when Tmin < 0.0 oC (from Jan 1st) and before 1st July.  ',
            legend: 'Last Spring Air Frost: Low (early, 1st January); High (late, 1st July). last day when Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C before 1 July',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'last_grassfrost_doy': {
            desc: 'Last Spring Grass Frost (day of year)',
             html: '<br> The Last Spring Grass Frost is the last day from 1st January, but before the 1st July, when the minimum air temperature is below 5.0°C. It tells us the day of year on which the last grass frost may occur in spring. Earlier dates imply the opportunity for the growing season to start sooner and avoid risk of frost damage. <br><br><b>Calculation:</b> <i> The last day when Tmin < 5.0 °C (from Jan 1st) and before the 1st July. ',
            legend: 'Last Spring Grassfrost: Low (early, 1st January); High (late, 1st July). last day when Tmin < 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C before 1 July',
            read: '<b>How to Read the Map: </b> </br> '
        }, 
        'max_anntemp': {
            desc: 'Highest Daily Maximum Temperature (\u00B0C)',
            html: 'This is the highest maximum daily air temperature of any one day in a year. <br><br><b>Calculation:</b> <i>The highest maximum temperature (\u00B0C).</i> <br>The map shows the highest maximum daily temperature for any one day in a year. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.</br>',
            legend: 'Highest Daily Maximum Temperature (\u00B0C): highest temperature per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_jantemp': {
            desc: 'Maximum Daily Temperature in January',
            hideaway: 'Maximum Daily Temperature in January (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in January. <br> The map shows the highest maximum daily temperature in January. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in January (\u00B0C): highest temperature in January per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in January in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_febtemp': {
            desc: 'Maximum Daily Temperature in February',
            hideaway: 'Maximum Daily Temperature in February (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in February. <br> The map shows the highest maximum daily temperature in February. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in February (\u00B0C): highest temperature in February per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in February in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_martemp': {
            desc: 'Maximum Daily Temperature in March',
            hideaway: 'Maximum Daily Temperature in March (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in March. <br> The map shows the highest maximum daily temperature in March. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in March (\u00B0C): highest temperature in March per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in March in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_aprtemp': {
            desc: 'Maximum Daily Temperature in April',
            hideaway: 'Maximum Daily Temperature in April (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in April. <br> The map shows the highest maximum daily temperature in April. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in April (\u00B0C): highest temperature in April per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in April in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_maytemp': {
            desc: 'Maximum Daily Temperature in May',
            hideaway: 'Maximum Daily Temperature in May (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in May. <br> The map shows the highest maximum daily temperature in May. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in May (\u00B0C): highest temperature in May per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in May in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_juntemp': {
            desc: 'Maximum Daily Temperature in June',
            hideaway: 'Maximum Daily Temperature in June (\u00B0C)',
            html: '-<br> This is the highest maximum daily air temperature in June. <br> The map shows the highest maximum daily temperature in June. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in June (\u00B0C): highest temperature in June per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in June in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_jultemp': {
            desc: 'Maximum Daily Temperature in July',
            hideaway: 'Maximum Daily Temperature in July (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in July. <br> The map shows the highest maximum daily temperature in July. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in July (\u00B0C): highest temperature in July per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in July in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_augtemp': {
            desc: 'Maximum Daily Temperature in August',
            hideaway: 'Maximum Daily Temperature in August (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in August. <br> The map shows the highest maximum daily temperature in August. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in August (\u00B0C): highest temperature in August per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in August in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_septemp': {
            desc: 'Maximum Daily Temperature in September',
            hideaway: 'Maximum Daily Temperature in September (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in September. <br> The map shows the highest maximum daily temperature in September. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in September (\u00B0C): highest temperature in September per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in September in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_octtemp': {
            desc: 'Maximum Daily Temperature in October',
            hideaway: 'Maximum Daily Temperature in October (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in October. <br> The map shows the highest maximum daily temperature in October. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in October (\u00B0C): highest temperature in October per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in October in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_novtemp': {
            desc: 'Maximum Daily Temperature in November',
            hideaway: 'Maximum Daily Temperature in November (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in November. <br> The map shows the highest maximum daily temperature in November. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in November (\u00B0C): highest temperature in November per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in November in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'max_dectemp': {
            desc: 'Maximum Daily Temperature in December',
            hideaway: 'Maximum Daily Temperature in December (\u00B0C)',
            html: '<br> This is the highest maximum daily air temperature in December. <br> The map shows the highest maximum daily temperature in December. Darker red shows the highest maximum temperature and ??? shows the lower values of maximum daily temperature.',
            legend: 'Maximum Daily Temperature in December (\u00B0C): highest temperature in December per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in December in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_anntemp': {
            desc: 'Lowest Daily Minimum Temperature (\u00B0C)',
            html: '<br>This is the lowest minimum air temperature of any one day in a year. <br><br><b>Calculation:</b> <i>The lowest minimum temperature (\u00B0C).</i> <br> The map shows the lowest minimum daily temperature for any one day of year. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature (\u00B0C): lowest temperature per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_jantemp': {
            desc: 'Lowest Daily Minimum Temperature in January',
            hideaway: 'Lowest Daily Minimum Temperature in January (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in January. <br> The map shows the lowest minimum daily temperature for any one day in January. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in January (\u00B0C): lowest temperature in January per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in January in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_febtemp': {
            desc: 'Lowest Daily Minimum Temperature in February',
            hideaway: 'Lowest Daily Minimum Temperature in February (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in February. <br> The map shows the lowest minimum daily temperature for any one day in February. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in February (\u00B0C): lowest temperature in February per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in February in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_martemp': {
            desc: 'Lowest Daily Minimum Temperature in March',
            hideaway: 'Lowest Daily Minimum Temperature in March (\u00B0C)',
            html:'<br> This is the lowest (coldest) minimum air temperature in March. <br> The map shows the lowest minimum daily temperature for any one day in March. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in March (\u00B0C): lowest temperature in March per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in March in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_aprtemp': {
            desc: 'Lowest Daily Minimum Temperature in April',
            hideaway: 'Lowest Daily Minimum Temperature in April (\u00B0C)',
            html:'<br> This is the lowest (coldest) minimum air temperature in April. <br> The map shows the lowest minimum daily temperature for any one day in April. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in April (\u00B0C): lowest temperature in April per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in April in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_maytemp': {
            desc: 'Lowest Daily Minimum Temperature in May',
            hideaway: 'Lowest Daily Minimum Temperature in May (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in May. <br> The map shows the lowest minimum daily temperature for any one day in May. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in May (\u00B0C): lowest temperature in May per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in May in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_juntemp': {
            desc: 'Lowest Daily Minimum Temperature in June',
            hideaway: 'Lowest Daily Minimum Temperature in June (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in June. <br> The map shows the lowest minimum daily temperature for any one day in June. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in June (\u00B0C): lowest temperature in June per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in June in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_jultemp': {
            desc: 'Lowest Daily Minimum Temperature in July',
            hideaway: 'Lowest Daily Minimum Temperature in July (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in July. <br> The map shows the lowest minimum daily temperature for any one day in July. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in July (\u00B0C): lowest temperature in July per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in July in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_augtemp': {
            desc: 'Lowest Daily Minimum Temperature in August',
            hideaway: 'Lowest Daily Minimum Temperature in August (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in August. <br> The map shows the lowest minimum daily temperature for any one day in August. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in August (\u00B0C): lowest temperature in August per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in August in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_septemp': {
            desc: 'Lowest Daily Minimum Temperature in September',
            hideaway: 'Lowest Daily Minimum Temperature in September (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in September. <br> The map shows the lowest minimum daily temperature for any one day in September. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in September (\u00B0C): lowest temperature in September per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in September in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_octtemp': {
            desc: 'Lowest Daily Minimum Temperature in October',
            hideaway: 'Lowest Daily Minimum Temperature in October (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in October. <br> The map shows the lowest minimum daily temperature for any one day in October. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in October (\u00B0C): lowest temperature in October per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in October in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_novtemp': {
            desc: 'Lowest Daily Minimum Temperature in November',
            hideaway: 'Lowest Daily Minimum Temperature in November (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in November. <br> The map shows the lowest minimum daily temperature for any one day in November. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in November (\u00B0C): lowest temperature in November per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in November in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'min_dectemp': {
            desc: 'Lowest Daily Minimum Temperature in December',
            hideaway: 'Lowest Daily Minimum Temperature in December (\u00B0C)',
            html: '<br> This is the lowest (coldest) minimum air temperature in December. <br> The map shows the lowest minimum daily temperature for any one day in December. Darker blue shows the lowest (coldest) minimum temperature and ??? shows the higher (warmer) values of minimum daily temperature.</br>',
            legend: 'Lowest Daily Minimum Temperature in December (\u00B0C): lowest temperature in December per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in December in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'p_heterogeneity': {
            desc: 'Precipitation Heterogeneity (index) ',
             html: '<br> The Precipitation Heterogeneity Index is a unitless Indicator and provides information about the erosivity of rainfall. It represents the ratio between average monthly rainfall and average annual rainfall, and is a useful indicator of rainfall strength and force and potential erosion risk. See also the Precipitation Intensity Index as an alternative representation of precipitation intensity and erosivity. <br><br><b>Calculation:</b> <i> Modified Fournier Index MFI= ∑i=112Pi2Pt with Pi being the monthly precipitation and Pt the annual precipitation ',
            legend: 'Precipitation Heterogeneity (index): P > 0.2 / count days P > 0.2mm',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'p_intensity': {
            desc: 'Precipitation Intensity (index)',
             html: '<br> The Precipitation Intensity Indicator is an index calculated by estimating the sum of rainfall when it is above 0.2mm per day and dividing this by the count of the number of days when rainfall is greater than 0.2mm. It does not have any units and provides information about the intensity and erosivity of rainfall, which is more intense where there are high values (due to monthly precipitation concentration and total annual amounts). Unsurprisingly this Indicator often tends to match spatially with rainfall total amounts and elevation. The maps show this, with upland areas often having higher indicator values. <br><br><b>Calculation:</b> <i> ∑P > 0.2mm /Count days P > 0.2mm ',
            legend: 'Precipitation Intensity (index): P > 0.2 / count days P > 0.2mm',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
       'p_seasonality': {
            desc: 'Precipitation Seasonality (index)',
             html: '<br> The Precipitation Seasonality Indicator tells us whether more rain falls in the winter or summer periods. This is for rainfall only, hence snow in the winter is not included. The maps show that overall more rain falls in the summer than the winter (in quantity, not the number of rain days). <br><br><b>Calculation:</b> <i> S = winter P - summer P / annual total P ',
            legend: 'Precipitation Seasonality (index): S = winter P - summer P / annual total P',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation seasonality in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'personheatstress_count': {
            desc: 'Person Heat Stress (count of days)',
             html: '<br> The Person Heat Stress Indicator is the count of the number of days per year when the maximum temperature is over 32°C, which is considered an amount of heat at which people may experience heat stress. <br><br><b>Calculation:</b> <i> count of days when Tmax > 32°C', 
            legend: 'Person Heat Stress (count of days): count of days when Tmax > 32\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 32\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'plantheatstress_count': {
            desc: 'Plant Heat Stress (count of days)',
             html: '<br> The Plant Heat Stress Indicator is the count of the number of days in a year when the maximum temperature is above 25°C. This value is considered as indicator of when crops in general may experience heat stress that may affect growth and implies additional water requirements. The actual level of heat stress will vary between crops and availability of water and canopy cooling by transpiration. <br><br><b>Calculation:</b> <i> count of days when Tmax > 25°C ', 
            legend: 'Plant Heat Stress (count of days): count of days when Tmax > 25\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 25\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_annualtotal': {
            desc: 'Rainfall Annual Total (mm)',
             html: '<br> This is the total amount of precipitation in a year. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall per year. ', 
            legend: 'Rainfall Annual Total (mm): sum of rainfall per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_springtotal': {
            desc: 'Rainfall Total in Spring (mm)',
             html: '<br> This is the total amount of precipitation in Spring. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall in March, April and May per year', 
            legend: 'Rainfall Total in Spring (mm): sum of rainfall in March, April and May per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Spring in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_summertotal': {
            desc: 'Rainfall Total in Summer (mm)',
             html: '<br> This is the total amount of precipitation in Summer. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall in June, July and August per year ', 
            legend: 'Rainfall Total in Summer (mm): sum of rainfall in June, July and August per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Summer in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_autumntotal': {
            desc: 'Rainfall Total in Autumn (mm)',
             html: '<br> This is the total amount of precipitation in Autumn. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall in September, October and November per year ', 
            legend: 'Rainfall Total in Autumn (mm): sum of rainfall in September, October and November per year',
            popup:  '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Autumn in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_wintertotal': {
            desc: 'Rainfall Total in Winter (mm)',
             html: '<br> This is the total amount of precipitation in Winter. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall in December (from the year before), January and February ', 
            legend: 'Rainfall Total in Winter (mm): sum of rainfall in December, January and February per year',
            popup:  '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Winter in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_jantotal': {
            desc: '&nbsp;&nbsp;-- rainfall in January',
            hideaway: 'Rainfall Total in January (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for January.', 
            legend: 'Rainfall Total in January (mm): sum of rainfall in January',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in January in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_febtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in February',
            hideaway: 'Rainfall Total in February (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for February.', 
            legend: 'Rainfall Total in February (mm): sum of rainfall in February',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in February in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_martotal': {
            desc: '&nbsp;&nbsp;-- rainfall in March',
            hideaway: 'Rainfall Total in March (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for March.', 
            legend: 'Rainfall Total in March (mm): sum of rainfall in March',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in March in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_aprtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in April',
            hideaway: 'Rainfall Total in April (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for April.', 
            legend: 'Rainfall Total in April (mm): sum of rainfall in April',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in April in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_maytotal': {
            desc: '&nbsp;&nbsp;-- rainfall in May',
            hideaway: 'Rainfall Total in May (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for May.', 
            legend: 'Rainfall Total in May (mm): sum of rainfall in May',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in May in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_juntotal': {
            desc: '&nbsp;&nbsp;-- rainfall in June',
            hideaway: 'Rainfall Total in June (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for June.', 
            legend: 'Rainfall Total in June (mm): sum of rainfall in June',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in June in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_jultotal': {
            desc: '&nbsp;&nbsp;-- rainfall in July',
            hideaway: 'Rainfall Total in July (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for July.', 
            legend: 'Rainfall Total in July (mm): sum of rainfall in July',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in July in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_augtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in August',
            hideaway: 'Rainfall Total in August (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for August.', 
            legend: 'Rainfall Total in August (mm): sum of rainfall in August',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in August in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_septotal': {
            desc: '&nbsp;&nbsp;-- rainfall in September',
            hideaway: 'Rainfall Total in September (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for September.', 
            legend: 'Rainfall Total in September (mm): sum of rainfall in September',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in September in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_octtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in October',
            hideaway: 'Rainfall Total in October (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for October.', 
            legend: 'Rainfall Total in October (mm): sum of rainfall in October',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in October in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_novtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in November',
            hideaway: 'Rainfall Total in November (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for November.', 
            legend: 'Rainfall Total in November (mm): sum of rainfall in November',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in November in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'rfall_dectotal': {
            desc: '&nbsp;&nbsp;-- rainfall in December',
            hideaway: 'Rainfall Total in December (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for December.', 
            legend: 'Rainfall Total in December (mm): sum of rainfall in December',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in December in <b>{Year}</b>',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'start_fieldops_doy': {
            desc: 'Start of Field Operations (day of year) ',
             html: '<br> The Start of Field Operations Indicator shows when management activities may be possible near the start of a year. It is based on the ‘Tsum 200’ often used by farmers as a ‘rule of thumb’ for this purpose. It is the time taken to accumulate ‘thermal time’ to 200 day degrees. However, it does not take into account the actual soil water status and other factors such as trafficability that will determine when machinery and livestock can access fields. <br><br><b>Calculation:</b> <i> Day when ∑Tavg from Jan 1st > 200\u00B0C ',
            legend: 'Start FieldOps: Low (early, 1st January); High: 250 (late, 7th September). day when Tavg from 1 Jan > 200\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the sum of the daily average temperatures from 1 Jan is greater than 200\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'start_grow_doy': {
            desc: 'Start of Growing Season (day of year) ',
             html: '<br> The Start of the Growing Season Indicator shows approximately when in late winter or spring grass may start to grow (when the average temperature is above 5.6°C for 5 consecutive days). In actual terms colder periods may follow these 5 days, stopping growth again, but as an Indicator it is useful in providing evidence of changes in the start of plant growth and thus when and what crop management options may be possible. <br><br><b>Calculation:</b> <i> Day when 5 consecutive days Tavg > 5.6\u00B0C (from Jan 1st) ',
            legend: 'Start Growing (day of year): day when 5 consecutive days Tavg > 5.6\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when five consecutive days have an average temperature greater than 5.6\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'thermaltime_sum': {
            desc: 'Thermal Time (degree days)',
             html: '<br> The Thermal Time Indicator shows the accumulation of thermal time from the fifth day in a five day period when daily mean temperature is above 5°C (e.g. in the spring) and when the mean temperature is less than 5°C. Thermal time accumulation is a good indicator of the heat energy input into biotic systems and determines how quickly plants and insects progress through their growth stages (phenology). <br><br><b>Calculation:</b> <i> ∑day degrees for period from 5th of 5 day period where Tavg > 5°C to end point where Tavg less than 5°C ',
            legend: 'Thermal Time (degree days): sum of day degrees for period from 5th of 5 day period where Tavg greater than 5\u00B0C to end point where Tavg less than 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> for the period from fifth day of a five-day period where the average temperater is greater than 5\u00B0C to the end point when the average temperature is less than 5\u00B0C',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'wet_spell_n': {
            desc: 'Wet Spell (count of days)',
             html: '<br> The Wet Spell Indicator is the highest count of the number of consecutive days per year when precipitation is greater than 0.2mm. It shows how long the longest continuous period is when there is rainfall every day in a year. <br><br><b>Calculation:</b> <i> Maximum consecutive count of days when P > 0.2 mm ',
            legend: 'Wet Spell (count of days): max consecutive count P > 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum consecutive count of precipitation is greater than 0.2 mm',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'wettestweek_doy': {
            desc: 'Wettest Week (day of year)',
             html: '<br> The Wettest Week Indicator shows the day of year when the wettest week occurs. It is the mid-week date when the largest rainfall occurs in a seven day period. <br><br><b>Calculation:</b> <i> Mid-week date when maximum 7 day value of P occurs',
            legend: 'Wettest Week (day of year): mid-week date when maximum 7d value of P occurs',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the maximum seven-day value of precipitation occurs',
            read: '<b>How to Read the Map: </b> </br> '
        },
        'wettestweek_mm': {
            desc: 'Wettest Week Rainfall Total (mm)',
            html: '<br> The Wettest Week Amount Indicator shows the maximum amount of rainfall in the Wettest Week (see Wettest Week Indicator). <br> <b>Calculation:</b> <i>Maximum amount of P (7 consecutive days) in the Wettest Week<i>',
            legend: 'Wettest Week (mm): Maximum amount of P (7 consecutive days)',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of precipitation in <b>{Year}</b> calculated from the maximum amount of precipitation in seven consecutive days',
            read: '<b>How to Read the Map: </b> </br> '
        }
    };

    const selectorExpression = [
        [`accumulatedfrost_degreedays`, indicators.accumulatedfrost_degreedays.desc],
        [`airfrost_count`, indicators.airfrost_count.desc],
        [`end_growingseason`, indicators.end_growingseason.desc],
        [`first_airfrost_doy`, indicators.first_airfrost_doy.desc],
        [`first_grassfrost_doy`, indicators.first_grassfrost_doy.desc],
        [`grassfrost_count`, indicators.grassfrost_count.desc],
        [`growing_degreedays`, indicators.growing_degreedays.desc],
        [`growing_season`, indicators.growing_season.desc],
        [`growseason_length`, indicators.growseason_length.desc],
        [`growseason_range`, indicators.growseason_range.desc],
        [`heating_degreedays`, indicators.heating_degreedays.desc],
        //[`heatwave_n`, indicators.heatwave_n.desc],
        [`last_airfrost_doy`, indicators.last_airfrost_doy.desc],
        [`last_grassfrost_doy`, indicators.last_grassfrost_doy.desc],
        [`max_anntemp`, indicators.max_anntemp.desc],
        [`max_jantemp`, indicators.max_jantemp.desc],
        [`max_febtemp`, indicators.max_febtemp.desc],
        [`max_martemp`, indicators.max_martemp.desc],
        [`max_aprtemp`, indicators.max_aprtemp.desc],
        [`max_maytemp`, indicators.max_maytemp.desc],
        [`max_juntemp`, indicators.max_juntemp.desc],
        [`max_jultemp`, indicators.max_jultemp.desc],
        [`max_augtemp`, indicators.max_augtemp.desc],
        [`max_septemp`, indicators.max_septemp.desc],
        [`max_octtemp`, indicators.max_octtemp.desc],
        [`max_novtemp`, indicators.max_novtemp.desc],
        [`max_dectemp`, indicators.max_dectemp.desc],
        [`min_anntemp`, indicators.min_anntemp.desc],
        [`min_jantemp`, indicators.min_jantemp.desc],
        [`min_febtemp`, indicators.min_febtemp.desc],
        [`min_martemp`, indicators.min_martemp.desc],
        [`min_aprtemp`, indicators.min_aprtemp.desc],
        [`min_maytemp`, indicators.min_maytemp.desc],
        [`min_juntemp`, indicators.min_juntemp.desc],
        [`min_jultemp`, indicators.min_jultemp.desc],
        [`min_augtemp`, indicators.min_augtemp.desc],
        [`min_septemp`, indicators.min_septemp.desc],
        [`min_octtemp`, indicators.min_octtemp.desc],
        [`min_novtemp`, indicators.min_novtemp.desc],
        [`min_dectemp`, indicators.min_dectemp.desc],
        [`p_heterogeneity`, indicators.p_heterogeneity.desc],
        [`p_intensity`, indicators.p_intensity.desc],
        [`p_seasonality`, indicators.p_seasonality.desc],
        [`personheatstress_count`, indicators.personheatstress_count.desc],
        [`plantheatstress_count`, indicators.plantheatstress_count.desc],
        ['rfall_annualtotal', indicators.rfall_annualtotal.desc],
        [`rfall_jantotal`, indicators.rfall_jantotal.desc],
        [`rfall_febtotal`, indicators.rfall_febtotal.desc],
        [`rfall_martotal`, indicators.rfall_martotal.desc],
        [`rfall_aprtotal`, indicators.rfall_aprtotal.desc],
        [`rfall_maytotal`, indicators.rfall_maytotal.desc],
        [`rfall_juntotal`, indicators.rfall_juntotal.desc],
        [`rfall_jultotal`, indicators.rfall_jultotal.desc],
        [`rfall_augtotal`, indicators.rfall_augtotal.desc],
        [`rfall_septotal`, indicators.rfall_septotal.desc],
        [`rfall_octtotal`, indicators.rfall_octtotal.desc],
        [`rfall_novtotal`, indicators.rfall_novtotal.desc],
        [`rfall_dectotal`, indicators.rfall_dectotal.desc],
        [`rfall_springtotal`, indicators.rfall_springtotal.desc],
        [`rfall_summertotal`, indicators.rfall_summertotal.desc],
        [`rfall_autumntotal`, indicators.rfall_autumntotal.desc],
        [`rfall_wintertotal`, indicators.rfall_wintertotal.desc],
        [`start_fieldops_doy`, indicators.start_fieldops_doy.desc],
        [`start_grow_doy`, indicators.start_grow_doy.desc],
        [`thermaltime_sum`, indicators.thermaltime_sum.desc], //PROBLEM WITH STATS
        [`wet_spell_n`, indicators.wet_spell_n.desc],
        [`wettestweek_doy`, indicators.wettestweek_doy.desc],
        [`wettestweek_mm`, indicators.wettestweek_mm.desc]
    ];

    const colorRamps = {
        'accumulatedfrost_degreedays' : colorBG,
        'airfrost_count' : colorBG,
        'end_growingseason' : combineColorRamp,
        'first_airfrost_doy' : combineColorRamp,
        'first_grassfrost_doy' : combineColorRamp,
        'grassfrost_count' : colorBY,
        'growing_degreedays' : combineColorRamp,
        'growing_season': combineColorRamp,
        'growseason_length' : combineColorRamp,
        'growseason_range': combineColorRamp,
        'heating_degreedays': combineColorRamp,
        //'heatwave_n' : combineColorRamp,
        'last_airfrost_doy' : colorBY,
        'last_grassfrost_doy' : colorBY,
        'max_anntemp' : colortemp,
        'max_jantemp' : colortemp,
        'max_febtemp' : colortemp,
        'max_martemp' : colortemp,
        'max_aprtemp' : colortemp,
        'max_maytemp' : colortemp,
        'max_juntemp' : colortemp,
        'max_jultemp' : colortemp,
        'max_augtemp' : colortemp,
        'max_septemp' : colortemp,
        'max_octtemp' : colortemp,
        'max_novtemp' : colortemp,
        'max_dectemp' : colortemp,
        'min_anntemp' : colortemp,
        'min_jantemp' : colortemp,
        'min_febtemp' : colortemp,
        'min_martemp' : colortemp,
        'min_aprtemp' : colortemp,
        'min_maytemp' : colortemp,
        'min_juntemp' : colortemp,
        'min_jultemp' : colortemp,
        'min_augtemp' : colortemp,
        'min_septemp' : colortemp,
        'min_octtemp' : colortemp,
        'min_novtemp' : colortemp,
        'min_dectemp' : colortemp,
        'p_heterogeneity' : combineColorRamp,
        'p_intensity' : combineColorRamp,
        'p_seasonality' : combineColorRamp,
        'personheatstress_count' : combineColorRamp,
        'plantheatstress_count' : heatPlant,
        'rfall_annualtotal' : colorRain,
        'rfall_springtotal' : colorRain,
        'rfall_summertotal' : colorRain,
        'rfall_autumntotal' : colorRain,
        'rfall_wintertotal' : colorRain,
        'rfall_jantotal' : colorRain,
        'rfall_febtotal' : colorRain,
        'rfall_martotal' : colorRain,
        'rfall_aprtotal' : colorRain,
        'rfall_maytotal' : colorRain,
        'rfall_juntotal' : colorRain,
        'rfall_jultotal' : colorRain,
        'rfall_augtotal' : colorRain,
        'rfall_septotal' : colorRain,
        'rfall_octtotal' : colorRain,
        'rfall_novtotal' : colorRain,
        'rfall_dectotal' : colorRain,
        'start_fieldops_doy' : combineColorRamp,
        'start_grow_doy' : combineColorRamp,
        'thermaltime_sum' : combineColorRamp,
        'wet_spell_n' : colorBG,
        'wettestweek_doy' : colorRain,
        'wettestweek_mm' : colorRain
    };

    let minMaxValues  = {
        'accumulatedfrost_degreedays' : { min: 0, max: 1400},
        'airfrost_count' : { min: 0, max: 300},
        'end_growingseason' : { min: 160, max: 366},
        'first_airfrost_doy' : { min: 180, max: 366},
        'first_grassfrost_doy' : { min: 180, max: 366},
        'grassfrost_count' : { min: 0, max: 366},
        'growing_degreedays' : { min: 250, max: 6200},
        'growing_season': { min: 0, max: 366},
        'growseason_length' : { min: 0, max: 366},
        'growseason_range': { min: 0, max: 366},
        'heating_degreedays': { min: 500, max: 6000},
        //'heatwave_n' : { min: 20, max: 200},
        'last_airfrost_doy' : { min: 0, max: 183},
        'last_grassfrost_doy' : { min: 0, max: 183},
        'max_anntemp' : { min: 0, max: 55},
        'max_jantemp' : { min: -1, max: 25},
        'max_febtemp' : { min: -10, max: 25},
        'max_martemp' : { min: -5, max: 30},
        'max_aprtemp' : { min: -2, max: 35},
        'max_maytemp' : { min: 0, max: 40},
        'max_juntemp' : { min: 0, max: 40},
        'max_jultemp' : { min: 5, max: 45},
        'max_augtemp' : { min: 5, max: 45},
        'max_septemp' : { min: 0, max: 40},
        'max_octtemp' : { min: 0, max: 35},
        'max_novtemp' : { min: 0, max: 35},
        'max_dectemp' : { min: 0, max: 30},
        'min_anntemp' : { min: -30, max: 10},
        'min_jantemp' : { min: -30, max: 10},
        'min_febtemp' : { min: -30, max: 10},
        'min_martemp' : { min: -30, max: 10},
        'min_aprtemp' : { min: -20, max: 15},
        'min_maytemp' : { min: -20, max: 20},
        'min_juntemp' : { min: -20, max: 20},
        'min_jultemp' : { min: -15, max: 25},
        'min_augtemp' : { min: -15, max: 25},
        'min_septemp' : { min: -15, max: 25},
        'min_octtemp' : { min: -20, max: 20},
        'min_novtemp' : { min: -25, max: 20},
        'min_dectemp' : { min: -40, max: 15},
        'p_heterogeneity' : { min: 10, max: 750},
        'p_intensity' : { min: 0, max: 30},
        'p_seasonality' : { min: 0, max: 1},
        'personheatstress_count' : { min: 0, max: 50},
        'plantheatstress_count' : { min: 0, max: 140},
        'rfall_annualtotal' : { min: 150, max: 6800},
        'rfall_springtotal' : { min: 0, max: 2000},
        'rfall_summertotal' : { min: 0, max: 2000},
        'rfall_autumntotal' : { min: 0, max: 2400},
        'rfall_wintertotal' : { min: 0, max: 2800},
        'rfall_jantotal' : { min: 0, max: 1600},
        'rfall_febtotal' : { min: 0, max: 1600},
        'rfall_martotal' : { min: 0, max: 1600},
        'rfall_aprtotal' : { min: 0, max: 1000},
        'rfall_maytotal' : { min: 0, max: 1000},
        'rfall_juntotal' : { min: 0, max: 1000},
        'rfall_jultotal' : { min: 0, max: 1000},
        'rfall_augtotal' : { min: 0, max: 1200},
        'rfall_septotal' : { min: 0, max: 1200},
        'rfall_octtotal' : { min: 0, max: 1600},
        'rfall_novtotal' : { min: 0, max: 1600},
        'rfall_dectotal' : { min: 0, max: 1800},
        'start_fieldops_doy' : { min: 0, max: 330},
        'start_grow_doy' : { min: 0, max: 250},
        'thermaltime_sum' : { min: 0, max: 4800},
        'wet_spell_n' : { min: 0, max: 200},
        'wettestweek_doy' : { min: 0, max: 366},
        'wettestweek_mm' : { min: 0, max: 380},
    };

    // selectDivs configs
    const selectDiv = document.createElement('div');
    const selectDivs = [selectDiv];

    selectDivs.forEach(element => {
        element.setAttribute('id', 'selectDiv');
        element.setAttribute('class', 'esri-widget');
        element.setAttribute('style', 'padding: 0 10px 10px 10px;background-color:white;');
        element.setAttribute('title', `Select Agrometeorological Indicator to display on the map`) // tooltip
    });

    selectDiv.innerHTML = '<p>Select Agrometeorological Indicator:<p>';

    const selectFilter = document.createElement('select');
    const selectFilters = [selectFilter];

    selectFilters.forEach(element => {
        element.setAttribute('id', 'selectFilter');
        element.setAttribute('class', 'esri-widget');
        element.setAttribute('style', 'width: 280px;')
    })

    selectDiv.appendChild(selectFilter);

    // make options and add labels for each
    selectorExpression.forEach(element => {
        let option = document.createElement('option');
        option.value = element[0];
        option.innerHTML = element[1];

        selectFilter.appendChild(option);
    });

    // make plantheatstress_count selected
    selectFilter.value = 'plantheatstress_count';

    
    // add selectDivs to view
    view.ui.add(selectDiv, 'top-left');

    /******************************
     * selectorDiv configs
     * ****************************/
    //listen to change events on indicatorSelect and change multidimensional variable
    
    selectFilter.addEventListener('change', () => {
        let selectedIndicator = selectFilter.value;
        boxDiv.innerHTML = indicators[selectedIndicator].read;
        let selectedYear = parseInt(yearSlider.value);
        yearDefinition.values = [selectedYear];
        yearDefinition.variableName = selectedIndicator;
        changeIndicator(selectedIndicator);
        changeDescriptors(selectedIndicator);
        stopAnimation();
        closePopup();
    });

    function createRenderer(selectedIndicator) {
        let colorRamp = colorRamps[selectedIndicator];
        let min = minMaxValues[selectedIndicator].min;
        let max = minMaxValues[selectedIndicator].max;
    
        let renderer = new RasterStretchRenderer({
            colorRamp: colorRamp,
            stretchType: 'min-max',
        });
    
        renderer.statistics = [{
            min: min,
            max: max,
        }];
        return renderer;
    };
   
    function changeIndicator(selectedIndicator) {
        // change mosaicRule of layer as clone and reassign
        let mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        let indicatorVariable = mosaicRuleClone.multidimensionalDefinition[0];
        let renderer = createRenderer(selectedIndicator);

        indicatorVariable.values = yearSlider.get('values');
        indicatorVariable.variableName = selectedIndicator;

        mosaicRuleClone.multidimensionalDefinition = [indicatorVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;

        // change renderingRule (raster function) of layer as clone and reassign
        let renderingRuleClone = indicatorLayer.renderingRule.clone();
        renderingRuleClone.functionName = selectedIndicator;
        indicatorLayer.renderer = renderer;
        indicatorLayer.renderingRule = renderingRuleClone;
    };


// Create a paragraph element for the fixed title
const read = document.createElement('p');
read.textContent = 'How to Read the Map:';
read.style.margin = '0 10px 10px 10px';

// Create a container div for the selector and the box
const containerDiv = document.createElement('div');
containerDiv.setAttribute('style', 'display: flex; flex-direction: column;');

// Append the selectDiv to the containerDiv
containerDiv.appendChild(selectDiv);

// Create the box div
const boxDiv = document.createElement('div');
boxDiv.setAttribute('style', 'width: 280px; background-color: white; padding: 10px;');
boxDiv.setAttribute('read', 'How to Read the Map');
boxDiv.appendChild(read);

// Create a paragraph element for displaying the selected indicator
const selectedIndicatorText = document.createElement('p');
selectedIndicatorText.setAttribute('id', 'selectedIndicatorText');
boxDiv.appendChild(selectedIndicatorText);

// Append the boxDiv to the containerDiv
containerDiv.appendChild(boxDiv);

// Add the containerDiv to view
view.ui.add(containerDiv, 'top-left');


    function changeDescriptors(selectedIndicator) {
        // change title of layer for Legend display
        indicatorLayer.title = indicators[selectedIndicator].legend;

        // change innerHTML of hideaway div
        let hideaway = document.getElementById('hideaway');
        let HTML30yrmaps = `
        <div><p ><b>Ensemble Means for two Observed and two Future Projection Periods</b></p></div>
        <div id='imgGrid'>
            <div><p>1961-1990 Average</p><img src='img/${selectedIndicator}_avg1961_1990.png' alt=''></div>
            <div><p>1991-2018 Average</p><img src='img/${selectedIndicator}_avg1991_2020.png' alt=''></div>
            <div><p>2019-2050 Average</p><img src='img/${selectedIndicator}_avg2021_2050.png' alt=''></div>
            <div><p>2051-2080 Average</p><img src='img/${selectedIndicator}_avg2051_2080.png' alt=''></div>
        </div>`
        let htmlContent = indicators[selectedIndicator].html + HTML30yrmaps;

        if (indicators[selectedIndicator].desc.includes('--')) {
            hideaway.innerHTML = `<h2>${indicators[selectedIndicator].hideaway}</h2>${htmlContent}`
        } else {hideaway.innerHTML = `<h2>${indicators[selectedIndicator].desc}</h2>${htmlContent}`}
    
        // change popup contents
        let popupTemplateClone = indicatorLayer.popupTemplate.clone();
        popupTemplateClone.content = indicators[selectedIndicator].popup;
        indicatorLayer.popupTemplate = popupTemplateClone;
    };

    /************************************
     * Year Slider
     *************************************/
    const yearSlider = new Slider({
        container: 'yearSlider',
        min: 1961,
        max: 2079,
        values: [2021], // current value shown on load
        precision: 0,
        snapOnClickEnabled: true,
        visibleElements: {
            labels: true,
            rangeLabels: true
        },
        tickConfigs: [{
            mode: 'position',
            values: [1970, 1980, 1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080],
            // mode: 'count',
            // values: 100,
            labelsVisible: false,
        }]
    });

    // when the user changes the yearSlider's value, change the year to reflect data
    yearSlider.on(['thumb-change', 'thumb-drag'], event => {
        updateYearDef(event.value);
        stopAnimation();
        closePopup();
    });

    // read all other values when year updates
    function updateYearDef() {
        let mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        let yearVariable = mosaicRuleClone.multidimensionalDefinition[0];
        yearVariable.values = yearSlider.get('values');
        mosaicRuleClone.multidimensionalDefinition = [yearVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;
    };

    // set var for play button
    const playButton = document.getElementById('playButton');

    // Toggle animation on/off when user
    // clicks on the play button
    playButton.addEventListener('click', () => {
        closePopup();
        if (playButton.classList.contains('toggled')) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
    let timerId = 0;

    // Starts the animation that cycle through the years
    function startAnimation() {
        stopAnimation();
        timerId = setInterval(() => {
            let year = yearSlider.values[0];

            // // check if year has loaded on map  <- this doesnt actually do anything
            // if (indicatorLayer.mosaicRule.multidimensionalDefinition[0].values[0] == year && indicatorLayer.loaded
            //     // && indicatorLayer.load().then(function() {return true})
            // ) {
                year += 1;
                if (year > yearSlider.max) {
                    year = yearSlider.min;
                }
                yearSlider.values = [year];
                updateYearDef(year);
            // }

        }, 1400) // speed of playback, milliseconds
        playButton.classList.add('toggled'); // see .toggled in css
    };

    // Stops the animation
    function stopAnimation() {
        if (!timerId) {
            return;
        }
        clearTimeout(timerId);
        timerId = 0;
        playButton.classList.remove('toggled'); 
    };


    /******************************
     * Small ui widgets
     *******************************/
    // moves the zoom widget to other corner
    view.ui.move('zoom', 'bottom-left');

    // create  and add scale bar to view
    const scaleBar = new ScaleBar({
        view: view,
        unit: 'dual' // The scale bar displays both metric and non-metric units.
    });

    // create and add home button to view
    const home = new Home({
        view: view
    });

    // add elements in order
    view.ui.add(home, 'bottom-left');
    view.ui.add(scaleBar, 'bottom-right')

    // create and add legend to view
    let legend = new Legend({
        view: view,
        layerInfos: [{
            layer: indicatorLayer,
            title: [`Plant Heat Stress: count of days when Tmax > 25\u00B0C`] //starting title on load
        }]
    });
    view.ui.add(legend, 'top-left');

    //add tooltip to legend
    let legendTooltip = () => {
        let legendClass = document.getElementsByClassName('esri-legend')[0];
        legendClass.setAttribute('title', `Click anywhere on the map to get the data's pixel value`)
    };
    setTimeout(legendTooltip, 1000); // wait for page to load
});

//! https://ekenes.github.io/covid19viz/
//change slider to time-window and back again
// checkbox.addEventListener( "input", (event) => {
//     if(checkbox.checked){
//       updateSlider({ mode: "time-window" });
//     } else {
//       updateSlider({ mode: "instant" });
//     }
//   });

//   interface UpdateSliderParams {
//     mode?: "time-window" | "instant",
//     filter?: string
//   }