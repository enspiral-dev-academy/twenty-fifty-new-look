define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var CostsSensitivityChart = function() {};

  CostsSensitivityChart.prototype = new Chart({});

  CostsSensitivityChart.prototype.constructor = CostsSensitivityChart

  CostsSensitivityChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    self.data = data;

    var readSelects = function() {
      var selects = document.querySelectorAll(".select");
      var sensitivitySelection = [];

      for(var i = 0; i < selects.length; i++) {
        sensitivitySelection.push(selects[i].value);
      }

      return sensitivitySelection;
    };

    var selects = readSelects();
    var totalSelection = 0;
    var totalRange = 0;

    for(var i = 0; i < data.length; i++) {
      var key = Object.keys(data);
      if(typeof selects[i] === "undefined") {
        totalSelection += data[key[i]].value.point;
      } else if(selects[i] === "range") {
        totalSelection += data[key[i]].value.low;
        totalRange += data[key[i]].value.range;
      } else {
        totalSelection += data[key[i]].value[selects[i]];
      }
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var xMin = 0;
    var xMax = 10000;

    var nTicks = 5;

    var x = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, self.width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .ticks(nTicks);

    self.x = x;
    self.xAxis = xAxis;

    var selectionBar = self.svg.selectAll(".selection-bar")
        .data([totalSelection])

    selectionBar.enter().append("rect")
        .attr("class", "bar selection-bar")
        .attr('fill', function(d, i) { return self.colours(i); })
        .attr('opacity', '0.6')
        .attr("y", 0)
        .attr("height", self.height)
        .attr("x", function(d) { return x(0); })
        .attr("width", function(d) { return self.width - x(d); });

    var rangeBar = self.svg.selectAll(".range-bar")
        .data([totalRange])

    rangeBar.enter().append("rect")
        .attr("class", "bar range-bar")
        .attr('fill', function(d, i) { return self.colours(i); })
        .attr('opacity', '0.3')
        .attr("y", 0)
        .attr("height", self.height)
        .attr("x", function(d) { return x(totalSelection); })
        .attr("width", function(d) { return x(d); });

    self.transitionBars = function() {
      var selectionBar = self.svg.selectAll(".selection-bar")
        .data([totalSelection])

      var rangeBar = self.svg.selectAll(".range-bar")
        .data([totalRange])

      var selects = readSelects();

      selectionBar.transition()
          .attr("x", function(d) { return x(0); })
          .attr("width", function(d) { return x(d); })
          .attr("height", self.height);

      rangeBar.transition()
          .attr("x", function(d) { return x(totalSelection); })
          .attr("width", function(d) { return x(d); })
          .attr("height", self.height);
    };
    self.transitionBars();


    self.svg.selectAll("line.horizontalGrid").remove();
    self.svg.selectAll("line.horizontalGrid").data(self.x.ticks(nTicks)).enter()
      .append("line")
        .attr({
          "class":"horizontalGrid",
          "x1" : function(d){ return self.x(d);},
          "x2" : function(d){ return self.x(d);},
          "y1" : 0,
          "y2" : self.height,
          "fill" : "none",
          "shape-rendering" : "crispEdges",
          "stroke" : "rgba(255, 255, 255, 0.2)",
          "stroke-width" : "1px"
        });

    self.svg.selectAll('.border').remove();
    self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : 0,
        "x2" : 0,
        "y1" : 0,
        "y2" : self.height,
      });
    self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : self.width,
        "x2" : self.width,
        "y1" : 0,
        "y2" : self.height,
      });
    self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : 0,
        "x2" : self.width,
        "y1" : self.height,
        "y2" : self.height,
      });

    if(self.hasAxis) {
      self.svg.selectAll('.axis').remove();

      self.svg.append("g")
          .attr("class", "x axis")
          .attr("shape-rendering", "crispEdges")
          .call(self.xAxis)
    } else {
      self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : 0,
        "x2" : self.width,
        "y1" : 0,
        "y2" : 0,
      });
    }
  };

  return CostsSensitivityChart;
});

