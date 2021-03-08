var margin = { top: 20, right: 20, bottom: 30, left: 20 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y:%m");

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, margin.top]);
var center = d3.scaleLinear().range([0, width]);

var color = d3
  .scaleOrdinal()
  .range(["#055C81", "#B13C3D"]);

var labels = [
  "Inflows",
  "Spending",
];

var xAxis = d3.axisBottom(x).ticks(10);
var yAxis = d3.axisRight(y).ticks(10);

var centerLine = d3.axisTop(center).ticks(0);

d3.json("data.json", function (error, data) {
  data = data.slice(data.length - 125, data.length);

  var keys = d3.keys(data[0]);

  var keys = ["inflows", "spend"];

  data.forEach(function (d) {
    var y0_positive = 0;
    var y0_negative = 0;

    d.components = keys.map(function (key) {
      var val = d[key];
      val = (key === "spend") ? Math.abs(val) * -1 : Math.abs(val);

      if (val >= 0) {
        return { key: key, y1: y0_positive, y0: (y0_positive += val) };
      } else {
        return { key: key, y0: y0_negative, y1: (y0_negative += val) };
      }
    });
  });

  var y_min = d3.min(data, function (d) {
    return d.inflows - 0.1;
  });
  var y_max = d3.max(data, function (d) {
    return d.inflows + 0.1;
  });

  var datestart = d3.min(data, function (d) {
    return parseDate(d.date);
  });
  var dateend = d3.max(data, function (d) {
    return parseDate(d.date);
  });

  x.domain([datestart, dateend]);
  y.domain([y_min, y_max]);
  color.domain(keys);

  var cashflow = d3
    .line()
    .x(function (d) {
      return x(parseDate(d.date)) + 10;
    })
    .y(function (d) {
      return y(Math.abs(d.inflows) - Math.abs(d.spend));
    });

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + (margin.left + margin.right)*2)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (width + margin.right) + " ,0)")
    .call(yAxis);

  svg
    .append("g")
    .attr("class", "centerline")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(centerLine);

  var entry = svg
    .selectAll(".entry")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "g")
    .attr("transform", function (d) {
      return "translate(" + x(parseDate(d.date)) + ", 0)";
    });

  entry
    .selectAll("rect")
    .data(function (d) {
      return d.components;
    })
    .enter()
    .append("rect")
    .attr("width", 20)
    .attr("y", function (d) {
      return y(d.y0);
    })
    .attr("height", function (d) {
      return Math.abs(y(d.y0) - y(d.y1));
    })
    .style("fill", function (d) {
      return color(d.key);
    });

  svg
    .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", cashflow);

  // Data dots
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d) { return x(parseDate(d.date)) + 10 })
    .attr("cy", function(d) { return y(Math.abs(d.inflows) - Math.abs(d.spend)) })
    .attr("r", 3.5)

  var legend = svg
    .selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend");

  legend
    .append("rect")
    .attr("x", 50)
    .attr("y", function (d, i) {
      return i * 25 + 350;
    })
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", 75)
    .attr("y", function (d, i) {
      return i * 25 + 359;
    })
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function (d, i) {
      return labels[i];
    });
});
