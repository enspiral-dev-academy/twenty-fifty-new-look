define(['knockout', 'text!../../../components/chartViews/overview.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    var minDate = 2015;
    var maxDate = 2050;

    self.title = params.title;
    self.chart = params.charts[0];
    self.data = params.data;

    self.chartOptions = [
      { name: 'Demand', title: 'Demand (GWh/yr)', xMin: 0, xMax: 5000 },
      { name: 'Supply', title: 'Supply (GWh/yr)', xMin: 0, xMax: 5000 },
      { name: 'Emissions', title: 'Emissions (ktCO2e/yr)', xMin: -1500, xMax: 1500 }
    ];

    self.date = ko.observable(maxDate);

    // This is only here because it's the last component loaded
    params.componentsLoaded(true);

    self.rangeAttributes = ko.observable({
      min: minDate,
      max: maxDate,
      step: 5
    });
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});
