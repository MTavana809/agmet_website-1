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
        stretchType: 'min-max'
            //statistics: [
            //        [0, 20, 4, 3]
            //    ] // min, max, avg, stddev
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


    // set initial variable and dimension on mosaic dataset
    const yearDefinition = new DimensionalDefinition({
        variableName: [],
        dimensionName: 'Year',
        values: [],
        isSlice: true
    });

    // create mosaicRule and set multidimensionalDefinition
    let mosaicRule = new MosaicRule({
        multidimensionalDefinition: yearDefinition
    });

    // create and add imagery layer to view
    const plantHeatStressLayer = new ImageryLayer({
        // title: [],
        url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agromet_Indicators/plantheatstress_test/ImageServer',
        mosaicRule: mosaicRule,
        renderer: countOfDayRenderer,
        opacity: 0.9,
        popupTemplate: {
            title: '{Raster.ServicePixelValue} plant heat stress day(s) in {Year}' // need to customize based on variable
                //content: [] //'{Raster.ServicePixelValue}'
        },
    });
    map.add(plantHeatStressLayer);

    // TEST add layer with drop down select box
    // set initial variable and dimension on mosaic dataset
    const yearDefinition_test = new DimensionalDefinition({
        variableName: 'UKCP18_interpolated_gridded_observed_1km',
        dimensionName: 'Year',
        values: [2017],
        isSlice: true
    });
    // create mosaicRule and set multidimensionalDefinition
    let mosaicRule_test = new MosaicRule({
        multidimensionalDefinition: yearDefinition_test
    });

    const plantHeatStressLayer_test = new ImageryLayer({
        title: [],
        url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agromet_Indicators/plantheatstress_test/ImageServer',
        mosaicRule: mosaicRule_test,
        opacity: 0.9
    });
    map.add(plantHeatStressLayer, 0);

    /******************************
     * leftDiv configs
     * ****************************/

    //listen to change events on indicatorSelect 
    const indicatorSelect = document.getElementById('indicatorSelect');

    indicatorSelect.addEventListener('change', function() {
        const chosenIndicator = indicatorSelect.value;
        changeIndicator(chosenIndicator);
    });

    function changeIndicator(chosenIndicator) {
        map.removeAll();
        switch (chosenIndicator) {
            case 'plantHeatStressLayer':
                map.add(plantHeatStressLayer);
                break;
            case 'plantHeatStressLayer_test':
                map.add(plantHeatStressLayer_test);
        }
    };

    //listen to change events on ensembleSelect
    // const ensembleSelect = document.getElementById('ensembleSelect');
    // ensembleSelect.addEventListener('change', function() {
    //     const chosenEnsemble = ensembleSelect.value;
    //     changeEnsemble(chosenEnsemble);
    // });

    // function changeEnsemble(chosenEnsemble) {

    //     const mosaicRuleClone = plantHeatStressLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
    //     const ensembleVariable = mosaicRuleClone.multidimensionalDefinition;
    //     switch (chosenEnsemble) {
    //         case 'ensemble 1':
    //             ensembleVariable.variableName = 'UKCP18_12KM_UK_corrected1km_ens01';
    //             mosaicRuleClone.multidimensionalDefinition = ensembleVariable;
    //             plantHeatStressLayer.mosaicRule = mosaicRuleClone;
    //             break;
    //         case 'ensemble 4':
    //             ensembleVariable.variableName = 'UKCP18_12KM_UK_corrected1km_ens04';
    //             mosaicRuleClone.multidimensionalDefinition = ensembleVariable;
    //             plantHeatStressLayer.mosaicRule = mosaicRuleClone;
    //             break;
    //         case 'ensemble 5':
    //             ensembleVariable.variableName = 'UKCP18_12KM_UK_corrected1km_ens05';
    //             mosaicRuleClone.multidimensionalDefinition = ensembleVariable;
    //             plantHeatStressLayer.mosaicRule = mosaicRuleClone;
    //             break;
    //     }

    // };

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
        steps: 119,
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
        const mosaicRuleClone = plantHeatStressLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const yearVariable = mosaicRuleClone.multidimensionalDefinition;
        yearVariable.values = yearSlider.get('values');
        mosaicRuleClone.multidimensionalDefinition = yearVariable;
        plantHeatStressLayer.mosaicRule = mosaicRuleClone;
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
        }, 1000)
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

    // const timeSlider = new TimeSlider({
    //     container: 'timeSlider',
    //     mode: 'instant',
    //     view: view,
    //     playRate: 300, // default is 1000 milliseconds
    //     fullTimeExtent: {
    //         start: new Date(1961, 0, 1),
    //         end: new Date(2080, 0, 1)
    //     },
    //     stops: {
    //         interval: {
    //             value: 1,
    //             unit: 'years'
    //         }
    //     }
    // });
    // view.ui.add(timeSlider, 'bottom');




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
    var legend = new Legend({
        view: view,
        layerInfos: [{
                layer: plantHeatStressLayer,
                title: 'Plant Heat Stress Days per Year'
            },
            {
                layer: plantHeatStressLayer_test,
                title: 'TEST Plant Heat Stress Days per Year'
            }
        ]
    });
    view.ui.add(legend, 'top-right');


    // histogram
    const histogram = new Histogram({

    })


});