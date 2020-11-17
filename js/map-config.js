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
    'esri/widgets/Expand',
    'esri/widgets/Swipe',
    'esri/layers/ImageryLayer',
    'esri/layers/support/RasterFunction',
    'esri/layers/support/MosaicRule',
    'esri/layers/support/DimensionalDefinition',
    'esri/renderers/RasterStretchRenderer',
    'esri/tasks/support/AlgorithmicColorRamp',
    'esri/tasks/support/MultipartColorRamp',
    'esri/smartMapping/symbology/support/colorRamps',
    'esri/renderers/RasterColormapRenderer',
    'esri/symbols/support/symbolUtils'
], function(Map,
    Basemap,
    Point,
    MapView,
    ScaleBar,
    Slider,
    Home,
    Legend,
    Expand,
    Swipe,
    ImageryLayer,
    RasterFunction,
    MosaicRule,
    DimensionalDefinition,
    RasterStretchRenderer,
    AlgorithmicColorRamp,
    MultipartColorRamp,
    colorRamps,
    RasterColormapRenderer,
    symbolUtils) {

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
    //const colorRamp = colorRamps.byName('Red and Green 9');
    // const flowerFieldRamp = colorRamps.byName("Flower Field");
    // console.log(flowerFieldRamp.colors);
    // returns the colors of the Flower Field color ramp
    // const colorRamp = colorRamps.byName("Red and Green 9");
    // console.log(colorRamp.colors);


    // const flowerColorRamp = new MultipartColorRamp({
    //     colorRamps: [flowerFieldRamp.colors[0], flowerFieldRamp.colors[1], flowerFieldRamp.colors[2], flowerFieldRamp.colors[3], flowerFieldRamp.colors[4], flowerFieldRamp.colors[5], flowerFieldRamp.colors[6], flowerFieldRamp.colors[7], flowerFieldRamp.colors[8], flowerFieldRamp.colors[9]]
    // });
    // console.log(combineColorRamp);
    // console.log(flowerColorRamp);

    // const flowerColorRampRenderer = new RasterColormapRenderer({
    //     colorMapInfos: []
    // });

    const countOfDayRenderer = new RasterStretchRenderer({
        colorRamp: combineColorRamp, //flowerColorRamp
        stretchType: 'min-max',
        //statistics: [
        //  [1, 60, 5, 5]
        //   ] // min, max, avg, stddev
    });

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

    // create and add imagery layer to view
    const indicatorLayer = new ImageryLayer({
        title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
        url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/agrometIndicators_esriStats/ImageServer',
        mosaicRule: mosaicRule,
        renderer: countOfDayRenderer,
        renderingRule: serviceRasterFunction,
        popupTemplate: indicatorLayerPopupTemplate,
        opacity: 0.8
    });
    map.add(indicatorLayer);

    // create and SECOND add imagery layer to view for SWIPE
    const indicatorLayer2 = new ImageryLayer({
        title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
        url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/agrometIndicators_esriStats/ImageServer',
        mosaicRule: {
            multidimensionalDefinition: [{
                variableName: 'accumulatedfrost_degreedays',
                dimensionName: 'Year',
                values: [1961],
                isSlice: true
            }]
        },
        renderer: countOfDayRenderer,
        renderingRule: serviceRasterFunction,
        popupTemplate: {
            title: '',
            content: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C',
            fieldInfos: [{
                fieldName: 'Raster.ItemPixelValue',
                format: {
                    places: 0,
                    digitSeparator: true
                }
            }]
        },
        opacity: 0.8
    });
    map.add(indicatorLayer2);

    /******************************
     * Swipe
     *******************************/
    const swipe = new Swipe({
        view: view,
        leadingLayers: [indicatorLayer],
        trailingLayers: [indicatorLayer2],
        direction: 'horizontal',
        position: 50
    });
    view.ui.add(swipe);

    /******************************
     * selectorDiv configs
     * ****************************/
    //listen to change events on indicatorSelect and change multidimensional variable
    const indicatorSelect = document.getElementById('indicatorSelect');
    const indicatorSelect2 = document.getElementById('indicatorSelect2');
    const descriptorDiv = document.getElementById('descriptorDiv');

    indicatorSelect.addEventListener('change', function() {
        const chosenIndicator = indicatorSelect.value;
        changeIndicator(chosenIndicator);
        changeDescriptors(chosenIndicator);
        stopAnimation();
    });

    indicatorSelect2.addEventListener('change', function() {
        const chosenIndicator = indicatorSelect2.value;
        changeIndicator(chosenIndicator);
        changeDescriptors(chosenIndicator);
        stopAnimation();
    });

    function changeIndicator(chosenIndicator) {
        //close popupTemplate if open
        if (view.popup.visible) {
            view.popup.close()
        };

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

        //swipe configs
        swipe.leadingLayers.splice(0, indicatorLayer);
    };

    function changeIndicator(chosenIndicator) {
        //close popupTemplate if open
        if (view.popup.visible) {
            view.popup.close()
        };

        // change mosaicRule of layer as clone and reassign
        const mosaicRuleClone = indicatorLayer2.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const indicatorVariable = mosaicRuleClone.multidimensionalDefinition[0];
        indicatorVariable.values = yearSlider.get('values');
        indicatorVariable.variableName = chosenIndicator;
        mosaicRuleClone.multidimensionalDefinition = [indicatorVariable];
        indicatorLayer2.mosaicRule = mosaicRuleClone;

        // change renderingRule (raster function) of layer as clone and reassign 
        const renderingRuleClone = indicatorLayer2.renderingRule.clone();
        renderingRuleClone.functionName = chosenIndicator;
        indicatorLayer2.renderingRule = renderingRuleClone;

        //swipe configs
        swipe.trailingLayers.splice(0, indicatorLayer2);
    };

    // change popupTemplate of layer as clone and reassign
    // change title of layer for Legend display
    // change description in descriptorDiv
    function changeDescriptors(chosenIndicator) {
        const popupTemplateClone = indicatorLayer.popupTemplate.clone();
        let popupCloneContent = popupTemplateClone.content;

        switch (chosenIndicator) {
            case 'accumulatedfrost_degreedays':
                indicatorLayer.title = 'Accumulated Frost (degree days): sum of degree days where Tmin < 0\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C'
                descriptorDiv.innerHTML = '<h2>Accumulated Frost (degree days)</h2><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQXxjIExlTtbSZ1oTG2pOpYswkrrwuAsyFsWg&usqp=CAU"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>'
                break;
            case 'airfrost_count':
                indicatorLayer.title = 'Air Frost (count of days): count of days when Tmin < 0\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C'
                descriptorDiv.innerHTML = '<h2>Air Frost (count of days)</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>'
                break;
            case 'cold_spell_n':
                indicatorLayer.title = 'Cold Spell (count of days): Max count of consecutive days when Tmax < avgTmax (baseline year) - 3\u00B0C (min 6 days)'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when the maximum temperature is less than the average maximum temperature in a baseline year minus 3\u00B0C'
                descriptorDiv.innerHTML = '<h2>Cold Spell (count of days)</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>        <p>Vestibulum auctor, ipsum vitae fermentum vulputate, mi leo convallis justo, quis elementum sem dui eu nulla. Vestibulum a turpis a sapien facilisis faucibus. In eget nibh luctus, rhoncus lectus et, imperdiet purus. Aliquam sodales sem ut molestieconsequat. In ornare metus porttitor lacinia imperdiet. Donec cursus convallis magna, ut scelerisque magna facilisis eget. Aliquam rutrum, metus ut aliquet vestibulum, lectus lorem gravida nibh, at pulvinar diam risus et sapien. Vivamus necrhoncus erat, a viverra enim. Morbi eu fringilla elit. Nam sed convallis ex, sit amet mattis massa. Ut dui elit, semper id suscipit vitae, rhoncus ac ipsum. Etiam purus risus, vestibulum aliquet ipsum at, interdum consequat risus. Vivamusin quam ut turpis tempor semper. Sed lectus urna, elementum vel sodales a, aliquet eget purus. Suspendisse eget ultrices erat.</p>'
                break;
            case 'dry_count':
                indicatorLayer.title = 'Dry Count (count of days): count of days when P < 0.2 mm'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when precipitation is less than 0.2 mm '
                descriptorDiv.innerHTML = ''
                break;
            case 'dry_spell_n':
                indicatorLayer.title = 'Dry Spell (count of days): max consecutive count P < 0.2 mm'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when precipitation is less than 0.2 mm'
                descriptorDiv.innerHTML = ''
                break;
            case 'end_growingseason':
                indicatorLayer.title = 'End of Growing Season (day of year): day when 5 consecutive days Tavg < 5.6\u00B0C from 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when average temperature for five consecutive days is less than 5.6\u00B0C from 1 July'
                descriptorDiv.innerHTML = ''
                break;
            case 'first_airfrost_doy':
                indicatorLayer.title = 'First Airfrost (day of year): first day when Tmin < 0\u00B0C from 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C from 1 July'
                descriptorDiv.innerHTML = ''
                break;
            case 'first_grassfrost_doy':
                indicatorLayer.title = 'First Grassfrost (day of year): first day when Tmin < 5\u00B0C from 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C from 1 July'
                descriptorDiv.innerHTML = ''
                break;
            case 'grassfrost_count':
                indicatorLayer.title = 'Grassfrost (count of days): count of days when Tmin < 5\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'growing_degreedays':
                indicatorLayer.title = 'Growing (degree days): sum Tavg > 5.6\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'growing_season':
                indicatorLayer.title = 'Growing Season (count of days): beginning when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'growseason_length':
                indicatorLayer.title = 'Grow Season Length (count of days): days when Tavg > 5.6\u00B0C between start and end of growing season'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C between the start and the end of growing season'
                descriptorDiv.innerHTML = ''
                break;
            case 'growseason_range':
                indicatorLayer.title = 'Grow Season Range (count of days): days between start and end of growing season'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> calculated from the count of days between the start and end of the growing season'
                descriptorDiv.innerHTML = ''
                break;
            case 'heating_degreedays':
                indicatorLayer.title = 'Heating (degree days): Sum of 15.5\u00B0C minus Tavg where Tavg < 15.5\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> representing the sum of 15.5\u00B0C minus the average temperature where the average temperature is less than 15.5\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'heatwave_n':
                indicatorLayer.title = 'Heatwave (count of days): Max count of consecutive days when Tmax > avgTmax (baseline year) + 3\u00B0C (min 6 days)'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than the average temperature in a baseline year plus 3\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'last_airfrost_doy':
                indicatorLayer.title = 'Last Airfrost (day of year): last day when Tmin < 0\u00B0C before 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C before 1 July'
                descriptorDiv.innerHTML = ''
                break;
            case 'last_grassfrost_doy':
                indicatorLayer.title = 'Last Grassfrost (day of year): last day when Tmin < 5\u00B0C before 1 July'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C before 1 July'
                descriptorDiv.innerHTML = ''
                break;
            case 'p_intensity':
                indicatorLayer.title = 'P Intensity (index): P > 0.2 / count days P > 0.2mm'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>'
                descriptorDiv.innerHTML = ''
                break;
            case 'p_seasonality':
                indicatorLayer.title = 'P Seasonality (index): S = winter P - summer P / annual total P'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>: index of precipitation seasonality in <b>{Year}</b>'
                descriptorDiv.innerHTML = ''
                break;
            case 'personheatstress_count':
                indicatorLayer.title = 'Person Heat Stress (count of days): count of days when Tmax > 32\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 32\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'plantheatstress_count':
                indicatorLayer.title = 'Plant Heat Stress (count of days): count of days when Tmax > 25\u00B0C';
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 25\u00B0C'
                descriptorDiv.innerHTML = '<h2>Plant Heat Stress</h2><img src="http://www.parkwestinc.com/wp-content/uploads/2017/07/193092-131-A181B66B-copy.jpg"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat. Sed    vitae tellus sit amet dui bibendum porta in sed tellus. Nunc porttitor mollis luctus. Duis ut luctus urna. Vivamus at fermentum eros. Nullam a pulvinar tortor, eu bibendum libero. Integer nec consectetur eros, et dapibus lectus. Nulla sem    nulla, auctor eget lobortis feugiat, ornare sit amet nisl. Donec dolor turpis, feugiat sodales tellus a, vulputate ultrices felis. Quisque lobortis eu turpis molestie fermentum.</p><p>Vestibulum auctor, ipsum vitae fermentum vulputate, mi leo convallis justo, quis elementum sem dui eu nulla. Vestibulum a turpis a sapien facilisis faucibus. In eget nibh luctus, rhoncus lectus et, imperdiet purus. Aliquam sodales sem ut molestie    consequat. In ornare metus porttitor lacinia imperdiet. Donec cursus convallis magna, ut scelerisque magna facilisis eget. Aliquam rutrum, metus ut aliquet vestibulum, lectus lorem gravida nibh, at pulvinar diam risus et sapien. Vivamus nec    rhoncus erat, a viverra enim. Morbi eu fringilla elit. Nam sed convallis ex, sit amet mattis massa. Ut dui elit, semper id suscipit vitae, rhoncus ac ipsum. Etiam purus risus, vestibulum aliquet ipsum at, interdum consequat risus. Vivamus    in quam ut turpis tempor semper. Sed lectus urna, elementum vel sodales a, aliquet eget purus. Suspendisse eget ultrices erat.</p><p>Quisque mattis vulputate metus, et mattis eros lacinia at. Aliquam ac viverra mauris. Duis sit amet sollicitudin elit. Aenean pulvinar convallis felis, quis euismod velit cursus suscipit. Pellentesque mattis molestie imperdiet. Vivamus et risus    quis leo interdum euismod. In augue tortor, pretium vel pharetra ut, accumsan non nulla. Proin ac felis molestie, rutrum enim eu, gravida orci. Etiam rhoncus sit amet ligula dapibus fermentum. Vivamus sagittis id purus vitae semper. Curabitur auctor euismod tortor a aliquam. Sed nisi leo, rutrum et dui in, facilisis convallis risus. Duis ut turpis nunc. Donec facilisis hendrerit est, et dictum justo laoreet eu. Aliquam erat volutpat.</p>'
                break;
            case 'start_fieldops_doy':
                indicatorLayer.title = 'Start FieldOps (day of year): day when Tavg from 1 Jan > 200\u00B0C';
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the sum of the daily average temperatures from 1 Jan is greater than 200\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'start_grow_doy':
                indicatorLayer.title = 'Start Grow (day of year): day when 5 consecutve days Tavg > 5.6\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when five consecutive days have an average temperature greater than 5.6\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'tempgrowingperiod_length':
                indicatorLayer.title = 'Temp Growing Period (count of days): count of days between average 5 day temp > 5\u00B0C and average 5 day temp < 5\u00B0C where average daily temp greater than 5\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> between when the average five-day temperature is greater than 5\u00B0C and when the average five-day temperature is less than 5\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'thermaltime_sum':
                indicatorLayer.title = 'Thermal Time (degree days): sum of day degrees for period from 5th of 5 day period where Tavg greater than 5\u00B0C to end point where Tavg less than 5\u00B0C'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> for the period from fifth day of a five-day period where the average temperater is greater than 5\u00B0C to the end point when the average temperature is less than 5\u00B0C'
                descriptorDiv.innerHTML = ''
                break;
            case 'wet_count':
                indicatorLayer.title = 'Wet Count (count of days): days when P >= 0.2 mm'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total wet days in <b>{Year}</b> when precipitation is greater than or equal to 0.2 mm'
                descriptorDiv.innerHTML = ''
                break;
            case 'wet_spell_n':
                indicatorLayer.title = 'Wet Spell (count of days): max consecutive count P > 0.2 mm'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum consecutive count of precipitation is greater than 0.2 mm'
                break;
            case 'wettestweek_doy':
                indicatorLayer.title = 'Wettest Week (day of year): mid-week date when maximum 7d value of P occurs'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the maximum seven-day value of precipitation occurs'
                descriptorDiv.innerHTML = ''
                break;
            case 'wettestweek_mm':
                indicatorLayer.title = 'Wettest Week (mm): Maximum amount of P (7 consecutive days)'
                popupCloneContent = '<b>{Raster.ItemPixelValue}</b> mm of precipitation in <b>{Year}</b> calculated from the maximum amount of precipitation in seven consecutive days'
                descriptorDiv.innerHTML = ''
                break;
        };
        popupTemplateClone.content = popupCloneContent;
        indicatorLayer.popupTemplate = popupTemplateClone;;
    }

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
            // mode: 'position',
            // values: [1970, 1980, 1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070],
            mode: 'count',
            values: 119,
            labelsVisible: false,
        }]
    });

    // when the user changes the yearSlider's value, change the year to reflect data
    yearSlider.on(['thumb-change', 'thumb-drag'], function(event) {
        //close popupTemplate if open
        if (view.popup.visible) {
            view.popup.close()
        };
        stopAnimation();
        updateYearDef(event.value);
        updateYearDef2(event.value);
    });

    // read all other values when year updates
    function updateYearDef() {
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const yearVariable = mosaicRuleClone.multidimensionalDefinition[0];
        yearVariable.values = yearSlider.get('values');
        mosaicRuleClone.multidimensionalDefinition = [yearVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;
    };

    function updateYearDef2() {
        const mosaicRuleClone = indicatorLayer2.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const yearVariable = mosaicRuleClone.multidimensionalDefinition[0];
        yearVariable.values = yearSlider.get('values');
        mosaicRuleClone.multidimensionalDefinition = [yearVariable];
        indicatorLayer2.mosaicRule = mosaicRuleClone;
    };

    // set var for play button 
    const playButton = document.getElementById('playButton');

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
                updateYearDef2(year);
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
            title: ['Plant Heat Stress: count of days when Tmax > 25\u00B0C']
        }]
    });

    // create and add legend to view 
    const legend2 = new Legend({
        view: view,
        layerInfos: [{
            layer: indicatorLayer2,
            title: ['Plant Heat Stress: count of days when Tmax > 25\u00B0C']
        }]
    });

    view.ui.add(legend, 'top-left');
    view.ui.add(legend2, 'top-right');

    /******************************
     * Expand descriptorDiv
     *******************************/
    const descriptorDivExpand = new Expand({
        view: view,
        content: descriptorDiv,
        expandIconClass: 'esri-icon-description',
        group: 'top-left',
        expanded: false
    });
    view.ui.add(descriptorDivExpand, 'bottom-left');

    // delay descriptorDiv load 
    function initialSetup() {
        if (document.getElementById('descriptorDiv') != null) {
            setTimeout(function() {
                document.getElementById('descriptorDiv').style.display = 'block';
            }, 1000);
        }
    };
    initialSetup();

    //move expand button to more like modal box
    // programmatically make selectors 
    const selectorExpressions = [
        ['accumulatedfrost_degreedays', 'Accumulated Frost (degree days)'],
        ['airfrost_count', 'Air Frost (count of days)'],
        ['cold_spell_n', 'Cold Spell (count of days)'],
        ['dry_count', 'Dry Count (count of days)'],
        ['dry_spell_n', 'Dry Spell (count of days)'],
        ['end_growingseason', 'End of Growing Season (day of year)'],
        ['first_airfrost_doy', 'First Airfrost (day of year)'],
        ['first_grassfrost_doy', 'First Grassfrost (day of year)'],
        ['grassfrost_count', 'Grassfrost Count (count of days)'],
        ['growing_degreedays', 'Growing (degree days)'],
        ['growing_season', 'Growing Season (count of days)'],
        ['growseason_length', 'Grow Season Length (count of days)'],
        ['growseason_range', 'Grow Season Range (count of days)'],
        ['heating_degreedays', 'Heating (degree days)'],
        ['heatwave_n', 'Heatwave (count of days)'],
        ['last_airfrost_doy', 'Last Airfrost (day of year)'],
        ['last_grassfrost_doy', 'Last Grassfrost (day of year)'],
        ['p_intensity', 'P Intensity (index)'],
        ['p_seasonality', 'P Seasonality (index)'],
        ['personheatstress_count', 'Person Heat Stress (count of days)'],
        ['plantheatstress_count', 'Plant Heat Stress (count of days)'],
        ['start_fieldops_doy', 'Start FieldOps (day of year)'],
        ['start_grow_doy', 'Start Grow (day of year)'],
        ['tempgrowingperiod_length', 'Temp Growing Period (count of days)'],
        ['thermaltime_sum', 'Thermal Time (degree days)'],
        ['wet_count', 'Wet Count (count of days)'],
        ['wet_spell_n', 'Wet Spell (count of days)'],
        ['wettestweek_doy', 'Wettest Week (day of year)'],
        ['wettestweek_mm', 'Wettest Week (mm)']
    ]

    // selectDivs configs
    const selectDivLeft = document.createElement('selectDivLeft');
    const selectDivRight = document.createElement('selectDivRight');

    selectDivLeft.setAttribute('style', 'padding: 0 10px 10px 10px;background-color:white;');
    selectDivLeft.setAttribute('class', 'esri-widget');
    selectDivLeft.innerHTML = '<p>Select Agrometeorological Indicator on the LEFT:<p>';
    selectDivRight.setAttribute('style', 'padding: 0 10px 10px 10px;background-color:white;');
    selectDivRight.setAttribute('class', 'esri-widget');
    selectDivRight.innerHTML = '<p>Select Agrometeorological Indicator on the RIGHT:<p>';

    const selectFilterLeft = document.createElement('select');
    selectFilterLeft.setAttribute('class', 'esri-widget');

    const selectFilterRight = document.createElement('select');
    selectFilterRight.setAttribute('class', 'esri-widget');

    selectDivLeft.appendChild(selectFilterLeft);
    selectDivRight.appendChild(selectFilterRight);

    selectorExpressions.forEach(function(value) {
        let option = document.createElement('option');
        option.value = value[0];
        option.innerHTML = value[1];

        selectFilterRight.appendChild(option);
        let optionClone = option.cloneNode(true);
        selectFilterLeft.appendChild(optionClone);

    });

    view.ui.add(selectDivLeft, 'bottom-left');
    view.ui.add(selectDivRight, 'bottom-right');
});