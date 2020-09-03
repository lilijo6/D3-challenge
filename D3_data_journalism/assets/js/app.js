// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 100,
    left: 100
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

    // parse data and use + method to convert string to numeric value
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // create scales
    var xScale = d3.scaleLinear()
        // using extent to grab the range of the censusData
        .domain([d3.min(censusData, d => d.poverty) * 0.8, d3.max(censusData, d => d.poverty)])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d.healthcare) * 0.8, d3.max(censusData, d => d.healthcare)])
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


    //  Create Circles 
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("class", "stateCircle")
        // circlesGroup.append("text")
        //     .text(d => {
        //         console.log(d.abbr)
        //         return d.abbr
        //     })
        //     .attr("x", d => xScale(d.poverty))
        //     .attr("y", d => yLinearScale(d.healthcare))
        //     .attr("class", "stateText")

    // adding the State abbreviation to the circles
    var stateText = chartGroup.selectAll(".text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .classed("stateText", true)
        .attr("transform", `translate(-0.5,5)`)


    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}% <br>Healthcare: ${d.healthcare}%`);
        });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks in Healthcare (%)");


    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2 }, ${chartHeight + chartMargin.top + 30 })`)
        .attr("class", "aText")
        .text("In Poverty (%)");

}).catch(function(error) {
    console.log(error);
});