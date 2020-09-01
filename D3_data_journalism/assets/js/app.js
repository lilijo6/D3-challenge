// Copied from activity 6 Day 2
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);


// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(function(censusData) {

    console.log(censusData);

    //Copied from activity 8 Day 3
    // // create date parser
    // var dateParser = d3.timeParse("%d-%b");

    // parse data and use + method to convert string to numeric value
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // create scales
    var xScale = d3.scaleLinear()
        // using extent to grab the range of the censusData
        .domain([d3.min(censusData, d => d.poverty) - 3, d3.max(censusData, d => d.poverty)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([chartHeight, 0]);

    // create axes
    var xAxis = d3.axisBottom(xScale).ticks(10);
    var yAxis = d3.axisLeft(yLinearScale).ticks(10);

    // append axes (set x to the bottom of the chart)
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // Step 5: Create Circles Activity 9 Day 3
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    //Add the text for the State in the middle of the circle
    var texts = chartGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('.stateCircle', d => d.radius * 0.4 + 'px')
        .attr('fill-opacity', 0)
        .attr('fill', 'white')
        .text(d => d.abbr)
        // // Transitions copied from https://bl.ocks.org/d3noob/899a0b2490318a96f9ebd40a5a84e4a7

    // var svg = d3.select("body") // Select the body element
    //     .append("svg") // Append an SVG element to the body
    //     .attr("width", 960) // make it 960 pixels wide
    //     .attr("height", 500) // make it 500 pixels high
    //     .append("circle") // append a circle to the svg
    //     .style("fill", "blue") // fill the circle with 'blue'
    //     .attr("r", 20) // set the radius to 10 pixels
    //     .attr('cx', 40) // position the circle at 40 on the x axis
    //     .attr('cy', 250) // position the circle at 250 on the y axis
    //     // 1st transition  
    //     .transition() // apply a transition
    //     .duration(4000) // apply it over 4000 milliseconds
    //     .attr('cx', 920) // new horizontal position at 920 on x axis
    //     // 2nd transition
    //     .transition() // apply a transition
    //     .duration(4000) // apply it over 4000 milliseconds
    //     .attr('r', 40) // new radius of 40 pixels
    //     // 3rd transition
    //     .transition() // apply a transition
    //     .duration(4000) // apply it over 4000 milliseconds
    //     .style('fill', "red");
})