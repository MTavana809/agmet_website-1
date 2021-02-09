/******************************
 * d3 chartDiv configs
 *******************************/

require('d3@6.5.0/dist/d3.min.js'), (d3) => {


    console.log(d3.range(100));
    // set the dimensions and margins of the graph
    const margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 40
        },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = select("#chartDiv")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv("https://raw.githubusercontent.com/HuttonLandSystems/agmet_website/master/data/plantheatstress_count_2018.csv", function(data) {

        // X axis: scale and draw:
        const x = scaleLinear()
            .domain([0, 122]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price }) 
            //make csv of essential stats of each indicator 
            .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom(x));

        // set the parameters for the histogram
        const histogram = _histogram()
            .value(function(d) {
                return d.plantheatstress_count;
            }) // I need to give the vector of value
            .domain(x.domain()) // then the domain of the graphic
            .thresholds(x.ticks(70)); // then the numbers of bins

        // And apply this function to data to get the bins
        const bins = histogram(data);

        // Y axis: scale and draw:
        const y = scaleLinear()
            .range([height, 0]);
        y.domain([0, _max(bins, function(d) {
            return d.length;
        })]); // d3.hist has to be called before the Y axis obviously
        svg.append("g")
            .call(axisLeft(y));

        // append the bar rectangles to the svg element
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) {
                return "translate(" + x(d.x0) + "," + y(d.length) + ")";
            })
            .attr("width", function(d) {
                return x(d.x1) - x(d.x0) - 1;
            })
            .attr("height", function(d) {
                return height - y(d.length);
            })
            .style("fill", "#69b3a2");

        const dataSum = d3.sum(data, function(d) {
            return d.score;
        });

        svg.append("line")
            .attr("y1", y2(1)) // x1 and y1 are first endpoint
            .attr("y2", height)
            .attr("x1", x(dataSum / data.length)) //x2 and y2 are second endpoint
            .attr("x2", x(dataSum / data.length))
            .style("stroke", "black")




    });
}