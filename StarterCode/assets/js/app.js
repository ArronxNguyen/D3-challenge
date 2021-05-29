// @TODO: YOUR CODE HERE!
// set up Chart
// Define SVG area dimensions  
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 50);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
var chosenXAxis = "poverty";

// **AN set initial y axis
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
// establishing values for x-scales
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8, d3.max(data, d => d[chosenYAxis])* 1.2])
      .range([height, 0]);
  
    return yLinearScale;
  
}

// Render Axis **AN check class activity 03.10
// function renderXAxis used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating circles group with a transition
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("dx", d => newXScale(d[chosenXAxis]));
      return circlesGroup;
}
// new circles for y
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]))
      .attr("dy", d => newYScale(d[chosenYAxis]))
      return circlesGroup;
}

//function used to render circleText
function renderXText(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}

function renderYText(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("dy", d => newYScale(d[chosenYAxis])+5)
    return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    var ylabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty:";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age:";
    }
    else if (chosenXAxis === "income"){
        xlabel = "Household income:"
    }

    // Update for Y **AN
    if (chosenYAxis === 'obesity'){
      ylabel = "Obesity:"
    }
    else if (chosenYAxis === 'smokes'){
      ylabel = "Smokes:"
    }
    else if (chosenYAxis === 'healthcare'){
      ylabel = "Lack Healthcare:";
    }
  
  // what to do with tooltip  
    var toolTip = d3.tip()
      .attr("class", "d3-tip") // referencing css
      .offset([80, -60])
      .html(function (d) {        
          return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%`);        
   });

    // call function chosen x and y tooltip
    circlesGroup.call(toolTip);

    // event when mouse hover over
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    
    // onmouseout event hide info
    .on("mouseout", function(data, index) {
    toolTip.hide(data, this);
    });
  
    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
  console.log(data)
  if (err) throw err;
  
  // parse numrical data from csv columns cast as numbers**AN
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.healthcare = +d.healthcare;
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
    });
  
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(data, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);
  
    // create group for circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("g");
    // append initial circles
    var circles = circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
      .classed('stateCircle', true);

    // append text inside circles
    var circlesText = circlesGroup.append("text")
      .text(d => d.abbr)
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis]))
      .classed('stateText', true);    
    
    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var PovertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)//positioning 
      .attr("value", "poverty") // value used for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var AgeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40) //positioning 
      .attr("value", "age") // value used for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var IncomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60) //positioning 
      .attr("value", "income") // value used for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
    
    // *AN
    // Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
          
    var ObesityLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -90) //positioning 
      .attr("x", -(height/2))
      .attr("dy", "1em") //text size a value of 1em is translated into 10px
      .attr("value", "obesity") // value used for event listener
      .classed("inactive", true)
      .text("Obesity (%)");
  
    var SmokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70) //positioning 
      .attr("x", -(height/2))
      .attr("dy", "1em")//text size a value of 1em is translated into 10px
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");

    var HealthLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)//positioning 
      .attr("x", -(height/2))
      .attr("dy", "1em")//text size a value of 1em is translated into 10px
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lack of Healthcare (%)");

    // updateToolTip function above csv import
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;  
      
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);
  
          // updates circles with new x values
          circles = renderXCircles(circles, xLinearScale, chosenXAxis);

        //   updating text within circles
          circlesText = renderXText(circlesText, xLinearScale, chosenXAxis)  
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "income") {
            IncomeLabel
              .classed("active", true)
              .classed("inactive", false);
            PovertyLabel
              .classed("active", false)
              .classed("inactive", true);
            AgeLabel
              .classed("active", false)
              .classed("inactive", true); 
          }
          else if(chosenXAxis == "age"){
            AgeLabel
            .classed("active", true)
            .classed("inactive", false);  
            PovertyLabel
            .classed("active", false)
            .classed("inactive", true);
            IncomeLabel
            .classed("active", false)
            .classed("inactive", true);
          }
          else {
            PovertyLabel
              .classed("active", true)
              .classed("inactive", false);
            IncomeLabel
              .classed("active", false)
              .classed("inactive", true);
            AgeLabel
              .classed("active", false)
              .classed("inactive", true); 
         }
        }
    }); 

// do the same for Y axis
// set chosen axis/class to active and deactivate other classes
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxis(yLinearScale, yAxis);

        // updates circles with new y values
        circles = renderYCircles(circles, yLinearScale, chosenYAxis);

        // update text within circles
        circlesText = renderYText(circlesText, yLinearScale, chosenYAxis) 

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          ObesityLabel
            .classed("active", true)
            .classed("inactive", false);
          SmokesLabel
            .classed("active", false)
            .classed("inactive", true);
          HealthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if(chosenYAxis === 'smokes'){
          SmokesLabel
            .classed("active", true)
            .classed("inactive", false);
          HealthLabel
            .classed("active", false)
            .classed("inactive", true);
          ObesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          HealthLabel
            .classed("active", true)
            .classed("inactive", false);
          SmokesLabel
            .classed("active", false)
            .classed("inactive", true);
          ObesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
  }).catch(function(error) {
    console.log(error);
});
