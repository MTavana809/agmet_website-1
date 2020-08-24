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
    // create server-defined raster function
    let serviceRasterFunction = new RasterFunction({
        functionName: 'plantheatstress_count'
    });

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

    // Set up popup template
    let indicatorLayerPopupTemplate = {
        title: '',
        content: '<b>{Raster.ItemPixelValue}</b> Plant Heat Stress Day(s) in <b>{Year}</b> '
    };

    // create and add imagery layer to view
    const indicatorLayer = new ImageryLayer({
        title: ['Plant Heat Stress: count of days when Tmax > 25\u00B0C'], //The legend automatically updates when a layer's renderer, opacity, or title is changed
        url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/agmetInds_netcdf/ImageServer',
        mosaicRule: mosaicRule,
        //renderer: countOfDayRenderer,
        renderingRule: serviceRasterFunction,
        opacity: 0.7,
        popupTemplate: indicatorLayerPopupTemplate
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
        // change mosaicRule of layer as clone and reassign
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const indicatorVariable = mosaicRuleClone.multidimensionalDefinition[0];
        indicatorVariable.values = yearSlider.get('values');
        indicatorVariable.variableName = chosenIndicator;
        mosaicRuleClone.multidimensionalDefinition = [indicatorVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;

        // change renderingRule (raster function) of layer as clone and reassign 
        const renderingRuleClone = indicatorLayer.renderingRule.clone();
        renderingRuleClone.functionName = chosenIndicator;
        indicatorLayer.renderingRule = renderingRuleClone;

        // change popupTemplate of layer as clone and reassign
        // change title of layer 
        const popupTemplateClone = indicatorLayer.popupTemplate.clone();
        let popupCloneContent = popupTemplateClone.content;
        switch (chosenIndicator) {
            case 'accumulatedfrost_degreedays':
                indicatorLayer.title = 'Accumulated Frost: sum of degree days where Tmin < 0'
                console.log(legend.layerInfos[0].title)
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> Accumulated Frost in <b>{Year}</b> '
                break;
            case 'airfrost_count':
                indicatorLayer.title = 'Air Frost: days when Tmin < 0'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> Air Frost days per year in <b>{Year}</b>'
                break;
            case 'cold_spell_n':
                indicatorLayer.title = 'Cold Spell: Max count of consecutive days when Tmax < avgTmax (baseline year) - 3 degrees C (min 6 days)'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> Cold Spells days per year in <b>{Year}</b>'
                break;
            case 'dry_count':
                indicatorLayer.title = 'Dry Count: days when P < 0.2'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> Dry Count days per year in <b>{Year}</b>'
                break;
            case 'dry_spell_n':
                indicatorLayer.title = 'Dry Spell: max consecutive count P < 0.2mm'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> Dry Spell count of days in <b>{Year}</b>'
                break;
            case 'end_growingseason':
                indicatorLayer.title = 'End of Growing Season: day when 5 consecutive days Tavg < 5.6 from 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day when growing season ends in <b>{Year}</b>'
                break;
            case 'first_airfrost_doy':
                indicatorLayer.title = 'First Airfrost: first day when Tmin < 0 from 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day when first airfrost in <b>{Year}</b>'
                break;
            case 'first_grassfrost_doy':
                indicatorLayer.title = 'First Grassfrost: first day when Tmin < 5 from 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day when first grassfrost in <b>{Year}</b>'
                break;
            case 'grassfrost_count':
                indicatorLayer.title = 'Grassfrost Count: days when Tmin < 5'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> grassfrost days in <b>{Year}</b>'
                break;
            case 'growing_degreedays':
                indicatorLayer.title = 'Growing Degree Days: sum Tavg > 5.6'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> growing degree days in <b>{Year}</b>'
                break;
            case 'growing_season':
                indicatorLayer.title = 'Growing Season: beginning when the temperature on five consecutive days exceeds some threshold, taken here to be 5oC, and ending when the temperature on five consecutive days is below that threshold'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> count of growing days in <b>{Year}</b>'
                break;
            case 'growseason_length':
                indicatorLayer.title = 'Grow Season Length: days when Tavg > 5.6 between start and end of growing season'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> grow season days in <b>{Year}</b>'
                break;
                // case 'growseason_range':
                //     indicatorLayer.title = ''
                //     popupCloneContent = ''
                //     break;
            case 'heating_degreedays':
                indicatorLayer.title = 'Heating Degree Days: Sum of 15.5 degrees – Tavg where Tavg < 15.5 degrees'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> heating degree days in <b>{Year}</b>'
                break;
            case 'heatwave_n':
                indicatorLayer.title = 'Heatwave: Max count of consecutive days when Tmax > avgTmax (baseline year) + 3 degrees C (min 6 days)'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> heatwave days in <b>{Year}</b>'
                break;
            case 'last_airfrost_doy':
                indicatorLayer.title = 'Last Airfrost: last day when Tmin < 0 before 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day when last airfrost in <b>{Year}</b>'
                break;
            case 'last_grassfrost_doy':
                indicatorLayer.title = 'Last Grassfrost: last day when Tmin < 5 before 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day when last grassfrost in <b>{Year}</b>'
                break;
            case 'p_intensity':
                indicatorLayer.title = 'P Intensity: P > 0.2 / count days P > 0.2mm'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> index of P Intensity in <b>{Year}</b>'
                break;
            case 'p_seasonality':
                indicatorLayer.title = 'P Seasonality: S = winter P - summer P / annual total P'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> index of P Seasonality in <b>{Year}</b>'
                break;
            case 'personheatstress_count':
                indicatorLayer.title = 'Person Heat Stress: days when Tmax > 32'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> count of person heat stress days in <b>{Year}</b>'
                break;
            case 'plantheatstress_count':
                indicatorLayer.title = 'Plant Heat Stress: count of days when Tmax > 25\u00B0C';
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> count of plant heat stress days in <b>{Year}</b>';
                break;
            case 'start_fieldops_doy':
                indicatorLayer.title = 'Start FieldOps Day of Year: day when Tavg from 1 Jan > 200\u00B0C';
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day when start fieldops in <b>{Year}</b>'
                break;
            case 'start_grow_doy':
                indicatorLayer.title = 'Start Grow Day of Year: day when 5 consecutve days Tavg > 5.6'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day when start grow in <b>{Year}</b>'
                break;
            case 'tempgrowingperiod_length':
                indicatorLayer.title = 'Temp Growing Period: count of days between average 5 day temp > 5 degrees and avergae 5 day temp < 5 degrees where avgerage daily temp greater than 5 degrees'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day when start grow in <b>{Year}</b>'
                break;
            case 'thermaltime_sum':
                indicatorLayer.title = 'Thermal Time: days when P >= 0.2'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> degree days of thermal time in <b>{Year}</b>'
                break;
            case 'wet_count':
                indicatorLayer.title = 'Wet Count: days when P >= 0.2'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> count of wet days in <b>{Year}</b>'
                break;
            case 'wet_spell_n':
                indicatorLayer.title = 'Wet Spell: max consecutive count P > 0.2mm'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> days of wet spell in <b>{Year}</b>'
                break;
            case 'wettestweek_doy':
                indicatorLayer.title = 'Wettest Week Day of Year: mid-week date when maximum 7d value of P occurs'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> day of year where wettest week in <b>{Year}</b>'
                break;
            case 'wettestweek_mm':
                indicatorLayer.title = 'Wettest Week (mm): Maximum amount of P (7 consecutive days)'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> mm of rain when wettest week in <b>{Year}</b>'
                break;
        };
        popupTemplateClone.content = popupCloneContent;
        indicatorLayer.popupTemplate = popupTemplateClone;
    };

    /************************************
     * Year Slider
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
            }, 700) // speed of playback, milliseconds
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
    // add elements in order
    view.ui.add([scaleBar, home], 'bottom-right');

    // create and add legend to view 
    const legend = new Legend({
        view: view,
        layerInfos: [{
            layer: indicatorLayer,
            title: ['Observed 1961-2017, modelled 2018-2080 (ensemble mean)']
        }]
    });
    view.ui.add(legend, 'top-right');

});