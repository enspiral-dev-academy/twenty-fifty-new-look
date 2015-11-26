define(['knockout', 'text!../../components/text.html', 'utils', 'hasher'], function(ko, html, Utils, hasher){
  'use strict';

  var ViewModel = function(params) {
    var lastRoute = params.lastRoute || 'home';

    self.heading = 'Turn me around';
    self.content = '<p>Rotate your device to see our lovely app.</p>';
    self.button = false;

    var timer;

    self.handleResize = function() {
      timer = setTimeout(function() {
        if(!Utils.shouldRotate()) {
          hasher.replaceHash(lastRoute);
          window.removeEventListener('resize', self.handleResize);
        }
      }, 500);
    };

    window.addEventListener('resize', self.handleResize);
    self.handleResize();
  };

  return {
    viewModel: ViewModel,
    template: html
  }
});

