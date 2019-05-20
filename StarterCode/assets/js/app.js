// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 10,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
var chartGroup2 = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("/assets/data/data.csv")
  .then(function(data) {
      console.log(data)

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
      d.healthcare = +d.healthcare;
    });

    //Step 2: Create scale functions
    //==============================
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.poverty))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)])
      .range([height, 0]);

    var yLinearScaleSmoke = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.smokes)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);
    var yAxisSmoke = d3.axisLeft(yLinearScaleSmoke);

    
    // creat default chart
    // Append Axes to the chart
    // ==============================
    function defaultChart() {
      d3.selectAll(".changeChart").remove() // remove preious axis and circles
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
      chartGroup.append("g")
        .attr("class", "defaultChart")
        .call(yAxis);

      // Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "defaultChart")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "pink")
        .attr("fill-opacity",0.8)
        .attr("stroke-width", "1")
        .attr("stroke", "none");
        // add text to circles  
      var textGroup=chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("class", "defaultChart")
        .attr("x", d => xLinearScale(d.poverty)-7)
        .attr("y", d => yLinearScale(d.healthcare)+4)
        .text(d => `${d.abbr}`)
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("font-weight","bold")
      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Poverty:${d.poverty}%<br>Lack Healthcare:${d.healthcare}%</b>`);
        });
      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);
      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      textGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });  
      // change text color while click
      d3.select("#defaultAxis").attr("fill","black");  
      d3.select("#changeAxis").attr("fill","grey");
    }
    defaultChart()

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("id", "defaultAxis")
      .text("Lack Healthcare (%)")
      .attr("font-weight","bold");
    chartGroup2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("id", "changeAxis")
      .text("Smokes (%)")
      .attr("fill","grey")
      .attr("font-weight","bold");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)")
      .attr("font-weight","bold");
    

    //function to change ticks and data
    function changeData(){
      d3.selectAll(".defaultChart").remove()
      chartGroup2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
      
      chartGroup2.append("g")
        .attr("class", "changeChart")
        .call(yAxisSmoke);

      var circlesGroup2 = chartGroup2.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "changeChart")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("fill-opacity",0.4)
        .attr("stroke-width", "1")
        .attr("stroke", "none");

      var textGroup2=chartGroup2.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("class", "changeChart")
        .attr("x", d => xLinearScale(d.poverty)-7)
        .attr("y", d => yLinearScale(d.smokes)+4)
        .text(d => `${d.abbr}`)
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("font-weight","bold")

      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Poverty:${d.poverty}%<br>Smoke:${d.smokes}%</b>`);
        });
        
        // Step 7: Create tooltip in the chart
        // ==============================
      chartGroup2.call(toolTip);
        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
      textGroup2.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });

      //change axis color: current to black, others to grey
      d3.select("#defaultAxis").attr("fill","grey");
      d3.select("#changeAxis").attr("fill","black");
    }
 
    //add event listener for axis change
    d3.select("#changeAxis").on("click", changeData)
    d3.select("#defaultAxis").on("click", defaultChart)
  });
