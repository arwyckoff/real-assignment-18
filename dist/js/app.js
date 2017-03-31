(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function forEach(arr, cb) {
  for (var i = 0; i < arr.length; i++) {
    cb(arr[i], i, arr);
  }
}

var arrivals = $.getJSON('http://apis.is/flight?language=en&type=arrivals');
var departures = $.getJSON('http://apis.is/flight?language=en&type=departures');
var carpoolDrivers = $.getJSON('http://apis.is/rides/samferda-drivers/');
var carpoolPass = $.getJSON('http://apis.is/rides/samferda-passengers/');
var concerts = $.getJSON('http://apis.is/concerts');
var nav = document.querySelector('.nav');
var wasActive = document.querySelector('[class="col-sm-3 navbar active"]');
var isActive = document.querySelector('[class="col-sm-3 navbar"]');

window.location.hash = 'home';
var currentRoute = window.location.hash.slice(1);

var appRouter = function appRouter() {
  if (currentRoute === 'undefined') {}
  var renderHere = document.querySelector('.mainView');
  makeActive(currentRoute);
  renderTo(renderHere, window.location.hash.slice(1));
};

function renderTo(domEl, currentRoute) {
  var htmlString = '';
  if (currentRoute === "home") {
    htmlString = '\n    <table>\n      <tr>\n        <th>The Basic Facts</th>\n      </tr>\n      <tr>\n        <td>Native Name</td>\n        <td>Island</td>\n      </tr>\n      <tr>\n        <td>Demonym</td>\n        <td>Icelander</td>\n      </tr>\n      <tr>\n        <td>Area(m2)</td>\n        <td>103000</td>\n      </tr>\n      <tr>\n        <td>Calling Code</td>\n        <td>352</td>\n      </tr>\n    </table>';

    domEl.innerHTML = htmlString;
  }
  if (currentRoute === "concerts") {
    htmlString += '\n        <div class="panel panel-default">\n          <div class="panel-body">\n            CONCERTS\n          </div>\n          <div class="row">';
    concerts.then(function (serverRes) {
      forEach(serverRes.results, function (dataobj) {
        htmlString += '\n            <div class="col-sm-3 col-md-4 thumbnail-container">\n            <div class="clearfix visible-xs-block"></div>\n              <div class="thumbnail">\n                <img src="' + dataobj.imageSource + '">\n                <div class="info">\n                  <h4>' + dataobj.name + '</h4>\n                  <p>Venue:' + dataobj.eventHallName + '</p>\n                  <p>' + dataobj.dateOfShow + '</p>\n                </div>\n              </div>\n            </div>';
      });
      htmlString += '\n          </div>\n        </div>';
      domEl.innerHTML = htmlString;
    });
  }
  if (currentRoute === "carpools") {
    htmlString += '\n          <div class=row>\n            <div class="panel panel-default">\n              <div class="panel-heading">\n                CARPOOLS\n              </div>\n              <table class="table">\n                <thead>\n                  <th>Time of Departure</th>\n                  <th>From</th>\n                  <th>To</th>\n                </thead>';
    carpoolDrivers.then(function (serverRes) {
      console.log(serverRes);
      forEach(serverRes.results, function (dataobj) {
        htmlString += '\n                  <tbody>\n                    <tr>\n                      <td>' + dataobj.date + '</td>\n                      <td>' + dataobj.from + '</td>\n                      <td>' + dataobj.to + '</td>\n                    </tr>\n                  </tbody>';
      });
      htmlString += '\n              </table>\n            </div>\n          </div>';
      domEl.innerHTML = htmlString;
    });
  }
  if (currentRoute === "flights") {
    htmlString += '\n    <div class=\'container-fluid flights-container\'>\n      <div class="panel panel-default">\n        <div class="panel-body">\n          FLIGHTS\n        </div>\n      </div>\n      <div class=\'row\'>\n        <div class="col-md-6 flights-columns">\n          <div class="panel panel-default flights-content">\n            <div class="panel-heading flights-panel-heading">\n              Arrivals\n            </div>\n            <table class="table">\n              <thead>\n                <th>Date</th>\n                <th>Arrival Time</th>\n                <th>Origin</th>\n                <th>Airline</th>\n              </thead>';
    $.when(arrivals, departures).then(function (serverResArrivals, serverResDepartures) {
      forEach(serverResArrivals[0].results, function (dataobj) {
        htmlString += '\n              <tbody>\n                <tr>\n                  <td>' + dataobj.date + '</td>\n                  <td>' + dataobj.plannedArrival + '</td>\n                  <td>' + dataobj.from + '</td>\n                  <td>' + dataobj.airline + '</td>\n                </tr>\n              </tbody>';
      });
      htmlString += '\n            </table>\n          </div>\n        </div>\n        <div class="col-md-6 flights-columns">\n          <div class="panel panel-default flights-content">\n            <div class="panel-heading flights-panel-heading">\n              Departures\n            </div>\n            <table class="table">\n              <thead>\n                <th>Date</th>\n                <th>Departure Time</th>\n                <th>Destination</th>\n                <th>Airline</th>\n              </thead>';

      forEach(serverResDepartures[0].results, function (dataobj) {
        htmlString += '\n              <tbody>\n                <tr>\n                 <td>' + dataobj.date + '</td>\n                 <td>' + dataobj.plannedArrival + '</td>\n                 <td>' + dataobj.to + '</td>\n                 <td>' + dataobj.airline + '</td>\n                </tr>\n              </body>';
      });
      htmlString += '\n            </table>\n          </div>\n        </div>\n      </div>';
      domEl.innerHTML = htmlString;
    });
  }
}

nav.addEventListener('click', function (evt) {
  console.log('BANG');
  var renderHereAlso = document.querySelector('.mainView');
  // let daRooooooooooot = window.location.hash.slice(1)
  var clickTarg = evt.target;
  var route = clickTarg.dataset.route;
  window.location.hash = route;

  if (clickTarg.classList.contains('home') === true) {
    console.log('Let me go home!');
    window.location.hash = 'home';
    renderTo(renderHereAlso, window.location.hash.slice(1));
  }
  if (clickTarg.classList.contains('flights') === true) {
    console.log("I'll fly away!");
    window.location.hash = 'flights';
    renderTo(renderHereAlso, window.location.hash.slice(1));
  }
  if (clickTarg.classList.contains('carpools') === true) {
    console.log('Life is a highway!');
    window.location.hash = 'carpools';
    renderTo(renderHereAlso, window.location.hash.slice(1));
  }
  if (clickTarg.classList.contains('concerts') === true) {
    console.log('For those about to rock!');
    window.location.hash = 'concerts';
    renderTo(renderHereAlso, window.location.hash.slice(1));
  }
});

function makeActive(currentRoute) {
  wasActive.classList.remove('active');
  isActive.classList.add('active');
}

appRouter();
window.addEventListener('hashchange', appRouter);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsRUFBdEIsRUFBeUI7QUFDdkIsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLElBQUksTUFBeEIsRUFBZ0MsR0FBaEMsRUFBb0M7QUFDbEMsT0FBRyxJQUFJLENBQUosQ0FBSCxFQUFXLENBQVgsRUFBYyxHQUFkO0FBQ0Q7QUFDRjs7QUFHRCxJQUFJLFdBQVUsRUFBRSxPQUFGLENBQVUsaURBQVYsQ0FBZDtBQUNBLElBQUksYUFBYSxFQUFFLE9BQUYsQ0FBVSxtREFBVixDQUFqQjtBQUNBLElBQUksaUJBQWlCLEVBQUUsT0FBRixDQUFVLHdDQUFWLENBQXJCO0FBQ0EsSUFBSSxjQUFjLEVBQUUsT0FBRixDQUFVLDJDQUFWLENBQWxCO0FBQ0EsSUFBSSxXQUFXLEVBQUUsT0FBRixDQUFVLHlCQUFWLENBQWY7QUFDQSxJQUFJLE1BQU0sU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQVY7QUFDQSxJQUFJLFlBQVksU0FBUyxhQUFULG9DQUFoQjtBQUNBLElBQUksV0FBVyxTQUFTLGFBQVQsNkJBQWY7O0FBSUEsT0FBTyxRQUFQLENBQWdCLElBQWhCLEdBQXVCLE1BQXZCO0FBQ0EsSUFBSSxlQUFlLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUEyQixDQUEzQixDQUFuQjs7QUFFQSxJQUFJLFlBQVksU0FBWixTQUFZLEdBQVU7QUFDdkIsTUFBRyxpQkFBaUIsV0FBcEIsRUFBZ0MsQ0FDOUI7QUFDRixNQUFJLGFBQWEsU0FBUyxhQUFULENBQXVCLFdBQXZCLENBQWpCO0FBQ0EsYUFBVyxZQUFYO0FBQ0EsV0FBUyxVQUFULEVBQXFCLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUEyQixDQUEzQixDQUFyQjtB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cEIsQ0FBNkIsVUFBN0IsTUFBNkMsSUFBakQsRUFBc0Q7QUFDcEQsWUFBUSxHQUFSLENBQVksb0JBQVo7QUFDQSxXQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsVUFBdkI7QUFDQSxhQUFTLGNBQVQsRUFBd0IsT0FBTyxRQUFQLENBQWdCLElBQWhCLENBQXFCLEtBQXJCLENBQTJCLENBQTNCLENBQXhCO0FBQ0Q7QUFDRCxNQUFJLFVBQVUsU0FBVixDQUFvQixRQUFwQixDQUE2QixVQUE3QixNQUE2QyxJQUFqRCxFQUFzRDtBQUNwRCxZQUFRLEdBQVIsQ0FBWSwwQkFBWjtBQUNBLFdBQU8sUUFBUCxDQUFnQixJQUFoQixHQUF1QixVQUF2QjtBQUNBLGFBQVMsY0FBVCxFQUF3QixPQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsQ0FBcUIsS0FBckIsQ0FBMkIsQ0FBM0IsQ0FBeEI7QUFDRDtBQUNGLENBNUJEOztBQThCQSxTQUFTLFVBQVQsQ0FBb0IsWUFBcEIsRUFBaUM7QUFDaEMsWUFBVSxTQUFWLENBQW9CLE1BQXBCLENBQTJCLFFBQTNCO0FBQ0EsV0FBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLFFBQXZCO0FBQ0E7O0FBR0Q7QUFDQSxPQUFPLGdCQUFQLENBQXdCLFlBQXhCLEVBQXNDLFNBQXRDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuZnVuY3Rpb24gZm9yRWFjaChhcnIsIGNiKXtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspe1xuICAgIGNiKGFycltpXSwgaSwgYXJyKVxuICB9XG59XG5cblxubGV0IGFycml2YWxzPSAkLmdldEpTT04oJ2h0dHA6Ly9hcGlzLmlzL2ZsaWdodD9sYW5ndWFnZT1lbiZ0eXBlPWFycml2YWxzJylcbmxldCBkZXBhcnR1cmVzID0gJC5nZXRKU09OKCdodHRwOi8vYXBpcy5pcy9mbGlnaHQ/bGFuZ3VhZ2U9ZW4mdHlwZT1kZXBhcnR1cmVzJylcbmxldCBjYXJwb29sRHJpdmVycyA9ICQuZ2V0SlNPTignaHR0cDovL2FwaXMuaXMvcmlkZXMvc2FtZmVyZGEtZHJpdmVycy8nKVxubGV0IGNhcnBvb2xQYXNzID0gJC5nZXRKU09OKCdodHRwOi8vYXBpcy5pcy9yaWRlcy9zYW1mZXJkYS1wYXNzZW5nZXJzLycpXG5sZXQgY29uY2VydHMgPSAkLmdldEpTT04oJ2h0dHA6Ly9hcGlzLmlzL2NvbmNlcnRzJylcbmxldCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2JylcbmxldCB3YXNBY3RpdmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbY2xhc3M9XCJjb2wtc20tMyBuYXZiYXIgYWN0aXZlXCJdYClcbmxldCBpc0FjdGl2ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtjbGFzcz1cImNvbC1zbS0zIG5hdmJhclwiXWApXG5cblxuXG53aW5kb3cubG9jYXRpb24uaGFzaCA9ICdob21lJ1xubGV0IGN1cnJlbnRSb3V0ZSA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpXG5cbmxldCBhcHBSb3V0ZXIgPSBmdW5jdGlvbigpe1xuICBcdGlmKGN1cnJlbnRSb3V0ZSA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgIH1cbiAgXHRsZXQgcmVuZGVySGVyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluVmlldycpXG4gIFx0bWFrZUFjdGl2ZShjdXJyZW50Um91dGUpXG4gIFx0cmVuZGVyVG8ocmVuZGVySGVyZSwgd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkpXG59XG5cbmZ1bmN0aW9uIHJlbmRlclRvKGRvbUVsLCBjdXJyZW50Um91dGUpe1xuICBsZXQgaHRtbFN0cmluZyA9ICcnXG4gIGlmKGN1cnJlbnRSb3V0ZSA9PT0gXCJob21lXCIpe1xuICAgIGh0bWxTdHJpbmcgPWBcbiAgICA8dGFibGU+XG4gICAgICA8dHI+XG4gICAgICAgIDx0aD5UaGUgQmFzaWMgRmFjdHM8L3RoPlxuICAgICAgPC90cj5cbiAgICAgIDx0cj5cbiAgICAgICAgPHRkPk5hdGl2ZSBOYW1lPC90ZD5cbiAgICAgICAgPHRkPklzbGFuZDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+RGVtb255bTwvdGQ+XG4gICAgICAgIDx0ZD5JY2VsYW5kZXI8L3RkPlxuICAgICAgPC90cj5cbiAgICAgIDx0cj5cbiAgICAgICAgPHRkPkFyZWEobTIpPC90ZD5cbiAgICAgICAgPHRkPjEwMzAwMDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+Q2FsbGluZyBDb2RlPC90ZD5cbiAgICAgICAgPHRkPjM1MjwvdGQ+XG4gICAgICA8L3RyPlxuICAgIDwvdGFibGU+YFxuXG4gICAgZG9tRWwuaW5uZXJIVE1MID0gaHRtbFN0cmluZ1xuXG4gIH1cbiAgaWYoY3VycmVudFJvdXRlID09PSBcImNvbmNlcnRzXCIpe1xuICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgICAgIENPTkNFUlRTXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPmBcbiAgICAgIGNvbmNlcnRzLnRoZW4oZnVuY3Rpb24oc2VydmVyUmVzKXtcbiAgICAgICAgZm9yRWFjaChzZXJ2ZXJSZXMucmVzdWx0cywgZnVuY3Rpb24oZGF0YW9iail7XG4gICAgICAgICAgaHRtbFN0cmluZyArPWBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMyBjb2wtbWQtNCB0aHVtYm5haWwtY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xlYXJmaXggdmlzaWJsZS14cy1ibG9ja1wiPjwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGh1bWJuYWlsXCI+XG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2RhdGFvYmouaW1hZ2VTb3VyY2V9XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImluZm9cIj5cbiAgICAgICAgICAgICAgICAgIDxoND4ke2RhdGFvYmoubmFtZX08L2g0PlxuICAgICAgICAgICAgICAgICAgPHA+VmVudWU6JHtkYXRhb2JqLmV2ZW50SGFsbE5hbWV9PC9wPlxuICAgICAgICAgICAgICAgICAgPHA+JHtkYXRhb2JqLmRhdGVPZlNob3d9PC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PmBcbiAgICAgICAgfSlcbiAgICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PmBcbiAgICAgICAgZG9tRWwuaW5uZXJIVE1MID0gaHRtbFN0cmluZ1xuICAgICAgfSlcbiAgfVxuICBpZihjdXJyZW50Um91dGUgPT09IFwiY2FycG9vbHNcIil7XG4gICAgICAgIGh0bWxTdHJpbmcgKz0gYFxuICAgICAgICAgIDxkaXYgY2xhc3M9cm93PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgICAgICBDQVJQT09MU1xuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dGg+VGltZSBvZiBEZXBhcnR1cmU8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPkZyb208L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPlRvPC90aD5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPmBcbiAgICAgIGNhcnBvb2xEcml2ZXJzLnRoZW4oZnVuY3Rpb24oc2VydmVyUmVzKXtcbiAgICAgICAgY29uc29sZS5sb2coc2VydmVyUmVzKTtcbiAgICAgICAgZm9yRWFjaChzZXJ2ZXJSZXMucmVzdWx0cywgZnVuY3Rpb24oZGF0YW9iail7XG4gICAgICAgIGh0bWxTdHJpbmcgKz0gYFxuICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai5kYXRlfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai5mcm9tfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai50b308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgPC90Ym9keT5gXG4gICAgICAgIH0pXG4gICAgICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIGRvbUVsLmlubmVySFRNTCA9IGh0bWxTdHJpbmdcbiAgICAgIH0pXG4gIH1cbiAgaWYoY3VycmVudFJvdXRlID09PSBcImZsaWdodHNcIil7XG4gICAgaHRtbFN0cmluZyArPSBgXG4gICAgPGRpdiBjbGFzcz0nY29udGFpbmVyLWZsdWlkIGZsaWdodHMtY29udGFpbmVyJz5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XG4gICAgICAgICAgRkxJR0hUU1xuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz0ncm93Jz5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC02IGZsaWdodHMtY29sdW1uc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0IGZsaWdodHMtY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmcgZmxpZ2h0cy1wYW5lbC1oZWFkaW5nXCI+XG4gICAgICAgICAgICAgIEFycml2YWxzXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+XG4gICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICA8dGg+RGF0ZTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkFycml2YWwgVGltZTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPk9yaWdpbjwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkFpcmxpbmU8L3RoPlxuICAgICAgICAgICAgICA8L3RoZWFkPmBcbiAgICAkLndoZW4oYXJyaXZhbHMsIGRlcGFydHVyZXMpLnRoZW4oZnVuY3Rpb24gKHNlcnZlclJlc0Fycml2YWxzLCBzZXJ2ZXJSZXNEZXBhcnR1cmVzKXtcbiAgICBmb3JFYWNoKHNlcnZlclJlc0Fycml2YWxzWzBdLnJlc3VsdHMsIGZ1bmN0aW9uKGRhdGFvYmope1xuICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQ+JHtkYXRhb2JqLmRhdGV9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD4ke2RhdGFvYmoucGxhbm5lZEFycml2YWx9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD4ke2RhdGFvYmouZnJvbX08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai5haXJsaW5lfTwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC90Ym9keT5gXG4gICAgfSlcbiAgICBodG1sU3RyaW5nICs9IGBcbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTYgZmxpZ2h0cy1jb2x1bW5zXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHQgZmxpZ2h0cy1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZyBmbGlnaHRzLXBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgICAgRGVwYXJ0dXJlc1xuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxuICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5EZXBhcnR1cmUgVGltZTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkRlc3RpbmF0aW9uPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+QWlybGluZTwvdGg+XG4gICAgICAgICAgICAgIDwvdGhlYWQ+YFxuXG4gICAgZm9yRWFjaChzZXJ2ZXJSZXNEZXBhcnR1cmVzWzBdLnJlc3VsdHMsIGZ1bmN0aW9uKGRhdGFvYmope1xuICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgIDx0ZD4ke2RhdGFvYmouZGF0ZX08L3RkPlxuICAgICAgICAgICAgICAgICA8dGQ+JHtkYXRhb2JqLnBsYW5uZWRBcnJpdmFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgIDx0ZD4ke2RhdGFvYmoudG99PC90ZD5cbiAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai5haXJsaW5lfTwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC9ib2R5PmBcbiAgICB9KVxuICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PmBcbiAgICAgIGRvbUVsLmlubmVySFRNTCA9IGh0bWxTdHJpbmdcbiAgfSlcbiAgICB9XG59XG5cbm5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gIGNvbnNvbGUubG9nKCdCQU5HJylcbiAgbGV0IHJlbmRlckhlcmVBbHNvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW5WaWV3JylcbiAgLy8gbGV0IGRhUm9vb29vb29vb29vdCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpXG4gIGxldCBjbGlja1RhcmcgPSBldnQudGFyZ2V0XG5cdGxldCByb3V0ZSA9IGNsaWNrVGFyZy5kYXRhc2V0LnJvdXRlXG4gIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcm91dGVcblxuICBpZiAoY2xpY2tUYXJnLmNsYXNzTGlzdC5jb250YWlucygnaG9tZScpID09PSB0cnVlKXtcbiAgICBjb25zb2xlLmxvZygnTGV0IG1lIGdvIGhvbWUhJylcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICdob21lJ1xuICAgIHJlbmRlclRvKHJlbmRlckhlcmVBbHNvLCB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKSlcbiAgfVxuICBpZiAoY2xpY2tUYXJnLmNsYXNzTGlzdC5jb250YWlucygnZmxpZ2h0cycpID09PSB0cnVlKXtcbiAgICBjb25zb2xlLmxvZyhcIkknbGwgZmx5IGF3YXkhXCIpXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnZmxpZ2h0cydcbiAgICByZW5kZXJUbyhyZW5kZXJIZXJlQWxzbywgd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkpXG4gIH1cbiAgaWYgKGNsaWNrVGFyZy5jbGFzc0xpc3QuY29udGFpbnMoJ2NhcnBvb2xzJykgPT09IHRydWUpe1xuICAgIGNvbnNvbGUubG9nKCdMaWZlIGlzIGEgaGlnaHdheSEnKVxuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJ2NhcnBvb2xzJ1xuICAgIHJlbmRlclRvKHJlbmRlckhlcmVBbHNvLHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpKVxuICB9XG4gIGlmIChjbGlja1RhcmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb25jZXJ0cycpID09PSB0cnVlKXtcbiAgICBjb25zb2xlLmxvZygnRm9yIHRob3NlIGFib3V0IHRvIHJvY2shJylcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICdjb25jZXJ0cydcbiAgICByZW5kZXJUbyhyZW5kZXJIZXJlQWxzbyx3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKSlcbiAgfVxufSlcblxuZnVuY3Rpb24gbWFrZUFjdGl2ZShjdXJyZW50Um91dGUpe1xuXHR3YXNBY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcblx0aXNBY3RpdmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbn1cblxuXG5hcHBSb3V0ZXIoKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgYXBwUm91dGVyKVxuIl19
