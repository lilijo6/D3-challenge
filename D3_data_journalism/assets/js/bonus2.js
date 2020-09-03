var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}

function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
            d3.max(censusData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
    return yLinearScale;
}
// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, x_dynaAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    x_dynaAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return x_dynaAxis;
}

function renderAxesY(newYScale, y_dynaAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    y_dynaAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return y_dynaAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup, chosenYAxis) {
    var xlabel = "";
    var ylabel = "";
    if (chosenXAxis === "poverty") {
        xlabel = "Poverty:";
    } else if (chosenXAxis === "income") {
        xlabel = "Median Income:";
    } else {
        xlabel = "Age:";
    }
    if (chosenYAxis === "healthcare") {
        ylabel = "Lacks Healthcare:";
    } else if (chosenYAxis === "obesity") {
        ylabel = "Obesity:";
    } else {
        ylabel = "Smokers:";
    }
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}%`);
        });
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
}
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData) {
    // parse data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });
    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);
    var yLinearScale = yScale(censusData, chosenYAxis);
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // append x axis
    var x_dynaAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    var y_dynaAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".5");
    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");
    // append y axis
    var ylabelsGroup = chartGroup.append("g")
    var healthLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Healthcare (%)");
    var smokeLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");
    var obesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -80)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity")
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
                x_dynaAxis = renderAxesX(xLinearScale, x_dynaAxis);
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
                y_dynaAxis = renderAxesY(yLinearScale, y_dynaAxis);
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);
                // changes classes to change bold text
                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true)
                } else if (chosenYAxis === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true)
                } else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthLabel
                        .classed("active", true)
                        .classed("inactive", false)
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});