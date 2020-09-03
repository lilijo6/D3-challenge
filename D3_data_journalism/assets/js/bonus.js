// Copied from activity 6 Day 2
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 80,
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

//Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8, d3.max(censusData, d => d[chosenXAxis]) * 1.2])
        .range([0, chartWidth]);

    return xLinearScale;
}

//function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

//function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {

    // create scales
    var ylinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8, d3.max(censusData, d => d[chosenYAxis]) * 1.2])
        .range([chartHeight, 0]);

    return ylinearScale;
}

//function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

//function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

//function used for updating circles group with new tooltip

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel = "";
    var ylabel = "";
    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty:";
    } else if (chosenXAxis === "age") {
        xlabel = "Median age: ";
    } else {
        xlable = "Houshold Income:";
    }



    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare (%)";
    } else if (chosenYAxis === "smokes") {
        ylabel = "Smokes(%): ";
    } else {
        ylable = "Obese (%)";
    }

    //  Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}%`);
        });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}
// Load data 
d3.csv("assets/data/data.csv").then(function(censusData) {
    // console.log(censusData);

    // parse data and use + method to convert string to numeric value
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
    });

    //creating the scale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis)
        .classed("y-axis", true);



    // Create Circles 
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("class", "stateCircle");
    // circlesGroup.append("text")
    //     .text(d => d.abbr)
    //     .attr("class", "stateText")

    // // adding the State abbreviation to the circles
    // var stateText = chartGroup.selectAll(".text")
    //     .data(censusData)
    //     .enter()
    //     .append("text")
    //     .text(d => d.abbr)
    //     .attr("x", d => xLinearScale((d[chosenXAxis]))
    //     .attr("y", d => yLinearScale((d[chosenYAxis]))
    //     .classed("stateText", true)
    //     .attr("transform", `translate(-0.5,5)`);



    //Create a label group for x axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    // Create x axes labels
    var povertyLabel = xlabelsGroup.append("text")
        .attr("y", 20)
        .attr("x", 0)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("y", 40)
        .attr("x", 0)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("y", 60)
        .attr("x", 0)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    //create label group for y axis labels
    var ylabelsGroup = chartGroup.append("g")

    //create y axes labels
    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks in Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    var obesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -80)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity (%)");


    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            console.log(value);
            if (value !== chosenXAxis) {
                // replaces chosenXAxis with value
                chosenXAxis = value;
                // console.log(chosenXAxis)
                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);
                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);
                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true)
                } else if (chosenXAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false)
                } else {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true)
                }
            }
        });
    // x axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            console.log(value);
            if (value !== chosenYAxis) {
                // replaces chosenXAxis with value
                chosenYAxis = value;
                // console.log(chosenXAxis)
                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(censusData, chosenYAxis);
                // updates x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);
                // changes classes to change bold text
                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true)
                } else if (chosenYAxis === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true)
                } else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false)
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});