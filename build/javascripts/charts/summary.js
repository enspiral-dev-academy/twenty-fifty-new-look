define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var pink = "#d53980";
  var peach = "#d43939";
  var green = "#28a197";

  function color (d) {
    return d >= 0 ? green : peach
  }

  function absolute (num) {
    return num >= 0 ? num : -num
  }

  function increaseOrReduction (d) {
    return d >= 0 ? (d + "% CO₂ Reduction") : (-d + "% CO₂ Increase")
  }


  var SummaryChart = function() {};

  SummaryChart.prototype = new Chart({});

  SummaryChart.prototype.constructor = SummaryChart

  SummaryChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height ||self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var xMin = -70;
    var xMax = 100;

    var x = d3.scale.linear()
        .domain([xMax, xMin])
        .range([0, self.width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")

    self.x = x;
    self.xAxis = xAxis;

    self.svg.select("#arrow-total-co2-reduction").remove();
    // self.svg.append("linearGradient").data([data])
    //     .attr("id", "arrow-gradient-decrease")
    //     .attr("gradientUnits", "userSpaceOnUse")
    //     .attr("x1", x(xMin)).attr("y1", 0)
    //     .attr("x2", function(d) { return x(d) }).attr("y2", 0)
    //   .selectAll("stop")
    //     .data([
    //       { offset: "0%", color: "#fff" },
    //       { offset: "100%", color: "#fff" }
    //     ])
    //   .enter().append("stop")
    //     .attr("offset", function(d) { return d.offset; })
    //     .attr("stop-color", function(d, i) {
    //       // New color interpolated between original and white depending on chart %
    //       // var colorness = function(color) { return Math.round(color * (data / 100) + 255 * (1 - (data / 100))); }
    //       // var color = "rgb("+colorness(90)+","+colorness(99)+","+colorness(120)+")";
    //       // return i === 0 ? color : d.color;
    //       return d >= 80 ? "#28a197" : "#d53980"
    //     })
    //     .attr("stop-opacity", function(d, i) { return i === 0 ? (1 - (data / 100)) : "1"; });
    //
    // self.svg.append("linearGradient").data([data])
    //     .attr("id", "arrow-gradient-increase")
    //     .attr("gradientUnits", "userSpaceOnUse")
    //     .attr("x1", x(xMin)).attr("y1", 0)
    //     .attr("x2", function(d) { return x(d) }).attr("y2", 0)
    //   .selectAll("stop")
    //     .data([
    //       { offset: "0%", color: "#fff" },
    //       { offset: "100%", color: "#fff" }
    //     ])
    //   .enter().append("stop")
    //     .attr("offset", function(d) { return d.offset; })
    //     .attr("stop-color", function(d, i) {
    //       // New color interpolated between original and white depending on chart %
    //       // var colorness = function(color) { return Math.round(color * (data / 100) + 255 * (1 - (data / 100))); }
    //       // var color = "rgb("+colorness(90)+","+colorness(99)+","+colorness(120)+")";
    //       // return i === 0 ? color : d.color;
    //       return d >= 80 ? "#28a197" : "#d53980"
    //     })
    //     .attr("stop-opacity", function(d, i) { return i === 0 ? (1 - (data / 100)) : "1"; });

    var bars = self.svg.selectAll(".bar")
        .data([data])


    // arrow
    var arrowBaseOffset = 15;
    bars.enter().append("polygon")
        .attr("class", "bar")
        .attr('fill', color)
        .attr("points", function(d) {
          var base = x(d);
          base += d > 0 ? arrowBaseOffset : - arrowBaseOffset
          return [x(0)+" 0", base+" 0", (x(d))+" "+(self.height/2), base+" "+self.height, x(0)+" "+self.height].join(", ");
        })

    bars.transition()
        .attr('fill', color)
        .attr("points", function(d) {
          var base = x(d);
          base += d > 0 ? arrowBaseOffset : - arrowBaseOffset
          return [x(0)+" 0", base +" 0", (x(d))+" "+(self.height/2), base +" "+self.height, x(0)+" "+self.height].join(", ");
        })


    var text = self.svg.selectAll(".background-text")
        .data([data])

    text.enter().append("text")
        .attr("class", "background-text")
        .attr("y", 44)

    text.transition()
        .attr("x", function(d) { return self.width * 0.4 })
        .text(increaseOrReduction)

    self.svg.selectAll('.target').remove();
    self.svg.append("line")
      .attr({
        "class": "target",
        "x1" : x(80),
        "x2" : x(80),
        "y1" : 0,
        "y2" : self.height,
        "stroke": "rgba(255,255,255, 0.5)",
        "stroke-dasharray": "4 3"
      });
  };

  return SummaryChart;
});
