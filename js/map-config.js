'use strict'; // https://javascript.info/strict-mode for explanation

require([
    'esri/Map',
    'esri/Basemap',
    'esri/geometry/Point',
    'esri/views/MapView',
    'esri/widgets/Expand',
    'esri/widgets/ScaleBar',
    'esri/widgets/Slider',
    'esri/widgets/Home',
    'esri/widgets/Legend',
    'esri/widgets/TimeSlider',
    'esri/widgets/Histogram',
    'esri/layers/FeatureLayer',
    'esri/layers/ImageryLayer',
    'esri/layers/support/RasterFunction',
    'esri/layers/support/MosaicRule',
    'esri/layers/support/DimensionalDefinition',
    'esri/layers/support/LabelClass',
    'esri/core/watchUtils',
    'esri/renderers/RasterStretchRenderer',
    'esri/tasks/support/AlgorithmicColorRamp',
    'esri/tasks/support/MultipartColorRamp'
], function(Map,
    Basemap,
    Point,
    MapView,
    Expand,
    ScaleBar,
    Slider,
    Home,
    Legend,
    TimeSlider,
    Histogram,
    FeatureLayer,
    ImageryLayer,
    RasterFunction,
    MosaicRule,
    DimensionalDefinition,
    LabelClass,
    watchUtils,
    RasterStretchRenderer,
    AlgorithmicColorRamp,
    MultipartColorRamp) {

    // new basemap definition 
    const basemap = new Basemap({
        portalItem: {
            id: '54140d826fe34135abb3b60c157170dc' // os_open_greyscale_no_labels
        }
    });

    // create map
    const map = new Map({
        basemap: basemap,
        layers: []
    });

    // create 2D view for the Map
    const view = new MapView({
        container: 'mapDiv',
        map: map,
        center: new Point({ x: 260000, y: 785000, spatialReference: 27700 }), // reprojected to allow OS basemap
        zoom: 8
    });

    // create renderer for countOfDay
    const colorRamp1 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [0, 104, 55, 1],
        toColor: [26, 152, 80, 1]
    });
    const colorRamp2 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [26, 152, 80, 1],
        toColor: [102, 189, 99, 1]
    });
    const colorRamp3 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [102, 189, 99, 1],
        toColor: [166, 217, 106, 1]
    });
    const colorRamp4 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [166, 217, 106, 1],
        toColor: [217, 239, 139, 1]
    });
    const colorRamp5 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [217, 239, 139, 1],
        toColor: [255, 255, 191, 1]
    });
    const colorRamp6 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [255, 255, 191, 1],
        toColor: [254, 224, 139, 1]
    });
    const colorRamp7 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [254, 224, 139, 1],
        toColor: [253, 174, 97, 1]
    });
    const colorRamp8 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [253, 174, 97, 1],
        toColor: [244, 109, 67, 1]
    });
    const colorRamp9 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [244, 109, 67, 1],
        toColor: [215, 48, 39, 1]
    });
    const colorRamp10 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [215, 48, 39, 1],
        toColor: [165, 0, 38, 1]
    });


    const combineColorRamp = new MultipartColorRamp({
        colorRamps: [colorRamp1, colorRamp2, colorRamp3, colorRamp4, colorRamp5, colorRamp6,
            colorRamp7, colorRamp8, colorRamp9, colorRamp10
        ]
    });

    const countOfDayRenderer = new RasterStretchRenderer({
        colorRamp: combineColorRamp,
        stretchType: 'min-max',
        statistics: [
                [1, 60, 5, 5]
            ] // min, max, avg, stddev
    });

    //const colorRamp = colorRamps.byName('Red and Green 9');
    // const continuousColors = colorRamp.colors;
    // const countOfDaysRenderer = new RasterStretchRenderer({
    //     colorRamp: colorRamps.byName("Red and Green 9"),
    //     stretchType: 'standard-deviation'
    // });

    // create renderer for doy
    // create renderer for degree days
    // create renderer for mm
    // create renderer for count 
    // create renderer for index
    // create renderer for degrees


    /******************************
     * Layer rules
     * ****************************/
    // set initial variable and dimension on mosaic dataset
    const yearDefinition = new DimensionalDefinition({
        variableName: 'plantheatstress_count',
        dimensionName: 'Year',
        values: [1961],
        isSlice: true
    });

    // create mosaicRule and set multidimensionalDefinition
    let mosaicRule = new MosaicRule({
        multidimensionalDefinition: [yearDefinition]
    });

    // create and add imagery layer to view
    const indicatorLayer = new ImageryLayer({
        // title: [], The legend automatically updates when a layer's renderer, opacity, or title is changed
        url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/agmetInds_netcdf/ImageServer',
        mosaicRule: mosaicRule,
        renderer: countOfDayRenderer,
        opacity: 0.7,
        popupTemplate: {
            //title: '{Raster.ServicePixelValue} plant heat stress day(s) in {Year}' // need to customize based on variable
            content: '{expression/pixelvalue} plant heat stress day(s) in {Year}',
            expressionInfos: [{
                    name: 'pixelvalue',
                    expression: 'Round(($Raster.ServicePixelValue), 2)'
                }] //'{Raster.ServicePixelValue}'
        },
    });
    map.add(indicatorLayer);


    /******************************
     * leftDiv configs
     * ****************************/

    //listen to change events on indicatorSelect and change multidimensional variable
    const indicatorSelect = document.getElementById('indicatorSelect');

    indicatorSelect.addEventListener('change', function() {
        const chosenIndicator = indicatorSelect.value;
        changeIndicator(chosenIndicator);
    });

    function changeIndicator(chosenIndicator) {
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const indicatorVariable = mosaicRuleClone.multidimensionalDefinition[0];
        indicatorVariable.values = yearSlider.get('values');
        indicatorVariable.variableName = chosenIndicator;
        mosaicRuleClone.multidimensionalDefinition = [indicatorVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;
        //   legend.layerInfos.title = [chosenIndicator];
    };


    /************************************
     * Slider
     *************************************/
    const yearSlider = new Slider({
        container: 'yearSlider',
        min: 1961,
        max: 2080,
        values: [1961],
        precision: 0,
        snapOnClickEnabled: true,
        visibleElements: {
            labels: true,
            rangeLabels: true
        },
        // steps: 119,
        tickConfigs: [{
            mode: 'count',
            values: 119,
            labelsVisible: false,
        }]
    });

    // when the user changes the yearSlider's value, change the year to reflect data
    yearSlider.on(['thumb-change', 'thumb-drag'], function(event) {
        stopAnimation();
        updateYearDef(event.value);
    });

    function updateYearDef(value) {
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const yearVariable = mosaicRuleClone.multidimensionalDefinition[0];
        yearVariable.values = yearSlider.get('values');
        mosaicRuleClone.multidimensionalDefinition = [yearVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;
    };

    // set vars for play button 
    const playButton = document.getElementById('playButton');
    let animation = null;

    // When user drags the slider:
    //  - stops the animation
    //  - set the visualized year to the slider.
    function inputHandler(event) {
        stopAnimation();
        updateYearDef(event.value);
    };

    // Toggle animation on/off when user
    // clicks on the play button
    playButton.addEventListener('click', function() {
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
                year += 1;
                if (year > yearSlider.max) {
                    year = yearSlider.min;
                }
                yearSlider.values = [year];
                updateYearDef(year);
            }, 5000) // speed of playback, milliseconds
        playButton.classList.add('toggled');
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
    view.ui.move('zoom', 'bottom-right');

    // create  and add scale bar to view
    const scaleBar = new ScaleBar({
        view: view,
        unit: 'dual' // The scale bar displays both metric and non-metric units.
    });

    // create and add home button to view 
    const home = new Home({
        view: view
    });

    view.ui.add([scaleBar, home], 'bottom-right');

    // create and add legend to view 

    const legend = new Legend({
        view: view,
        layerInfos: [{
            layer: indicatorLayer,
            title: ['Plant Heat Stress: count of days when Tmax > 25\u00B0C']
        }]
    });
    view.ui.add(legend, 'top-left');

});