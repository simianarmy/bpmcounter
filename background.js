chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'bounds': {
      'width': 700,
      'height': 500
    }
  }, function (win) {
      // when the callback is executed, the DOM is loaded but no script was
      // loaded yet. So, let's attach to the load event.
      win.contentWindow.addEventListener('load', function() {
      });
  });
});
