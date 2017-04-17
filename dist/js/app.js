(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function forEach(arr, cb) {
  for (var i = 0; i < arr.length; i++) {
    cb(arr[i], i, arr);
  }
}

var nav = document.querySelector('.nav');
var carpoolDrivers = $.getJSON('http://apis.is/rides/samferda-drivers/');
var carpoolPass = $.getJSON('http://apis.is/rides/samferda-passengers/');
var concerts = $.getJSON('http://apis.is/concerts');
var arrivals = $.getJSON('http://apis.is/flight?language=en&type=arrivals');
var departures = $.getJSON('http://apis.is/flight?language=en&type=departures');
var wasActive = document.querySelector('[class="col-sm-3 navbar active"]');
var isActive = document.querySelector('[class="col-sm-3 navbar"]');

window.location.hash = 'home';
var currentRoute = window.location.hash.slice(1);

var appRouter = function appRouter() {
  if (currentRoute === 'undefined') {}
  var renderHere = document.querySelector('.appbody');
  makeActive(currentRoute);
  renderTo(renderHere, window.location.hash.slice(1));
};

function renderTo(domEl, currentRoute) {
  var htmlString = '';
  if (currentRoute === "home") {
    htmlString = '\n    <table>\n        <th class="table-header" colspan="2">The Basic Facts</th>\n      <tr>\n        <td>Native Name</td>\n        <td>Island</td>\n      </tr>\n      <tr>\n        <td>Demonym</td>\n        <td>Icelander</td>\n      </tr>\n      <tr>\n        <td>Area(m2)</td>\n        <td>103000</td>\n      </tr>\n      <tr>\n        <td>Calling Code</td>\n        <td>352</td>\n      </tr>\n    </table>';

    domEl.innerHTML = htmlString;
  }
  if (currentRoute === "concerts") {
    htmlString += '\n        <div class="panel panel-default">\n          <div class="panel-body">\n            <div class="table-header">CONCERTS</div>\n          </div>\n          <div class="row">';
    concerts.then(function (serverRes) {
      forEach(serverRes.results, function (dataobj) {
        htmlString += '\n            <div class="col-sm-3 col-md-4 thumbnail-container">\n            <div class="clearfix visible-xs-block"></div>\n              <div class="thumbnail">\n                <img src="' + dataobj.imageSource + '">\n                <div class="info">\n                  <h4>' + dataobj.name + '</h4>\n                  <p>Venue:' + dataobj.eventHallName + '</p>\n                  <p>' + dataobj.dateOfShow + '</p>\n                </div>\n              </div>\n            </div>';
      });
      htmlString += '\n          </div>\n        </div>';
      domEl.innerHTML = htmlString;
    });
  }
  if (currentRoute === "carpools") {
    htmlString += '\n          <div class=row>\n            <div class="panel panel-default">\n              <div class="table-header">\n                CARPOOLS\n              </div>\n              <table class=" carpool-table table centered">\n                <thead>\n                  <th>Time of Departure</th>\n                  <th>From</th>\n                  <th>To</th>\n                </thead>';
    carpoolDrivers.then(function (serverRes) {
      forEach(serverRes.results, function (dataobj) {
        htmlString += '\n                  <tbody>\n                    <tr>\n                      <td>' + dataobj.date + '</td>\n                      <td>' + dataobj.from + '</td>\n                      <td>' + dataobj.to + '</td>\n                    </tr>\n                  </tbody>';
      });
      htmlString += '\n              </table>\n            </div>\n          </div>';
      domEl.innerHTML = htmlString;
    });
  }
  if (currentRoute === "flights") {
    htmlString += '\n    <div class=\'panel container-fluid flights-container\'>\n      <div class="flights-header">\n        <div class="table-header">\n          FLIGHTS\n        </div>\n      </div>\n      <div class=\'row\'>\n        <div class="col-md-6 flights-columns">\n          <div class="flights-content">\n            <div class="flights-panel-heading">\n              Arrivals\n            </div>\n            <table class="flight">\n              <thead>\n                <th>Date</th>\n                <th>Arrival Time</th>\n                <th>Origin</th>\n                <th>Airline</th>\n              </thead>';
    $.when(arrivals, departures).then(function (serverResArrivals, serverResDepartures) {
      forEach(serverResArrivals[0].results, function (dataobj) {
        htmlString += '\n              <tbody>\n                <tr>\n                  <td>' + dataobj.date + '</td>\n                  <td>' + dataobj.plannedArrival + '</td>\n                  <td>' + dataobj.from + '</td>\n                  <td>' + dataobj.airline + '</td>\n                </tr>\n              </tbody>';
      });
      htmlString += '\n            </table>\n          </div>\n        </div>\n        <div class="col-md-6 flights-columns">\n          <div class="flights-content">\n            <div class="flights-panel-heading">\n              Departures\n            </div>\n            <table class=" flight">\n              <thead>\n                <th>Date</th>\n                <th>Departure Time</th>\n                <th>Destination</th>\n                <th>Airline</th>\n              </thead>';

      forEach(serverResDepartures[0].results, function (dataobj) {
        htmlString += '\n\n              <tbody>\n                <tr>\n                 <td>' + dataobj.date + '</td>\n                 <td>' + dataobj.plannedArrival + '</td>\n                 <td>' + dataobj.to + '</td>\n                 <td>' + dataobj.airline + '</td>\n                </tr>\n              </body>';
      });
      htmlString += '\n\n            </table>\n          </div>\n        </div>\n      </div>';
      domEl.innerHTML = htmlString;
    });
  }
}

//working//
nav.addEventListener('click', function (evt) {
  var renderHereAlso = document.querySelector('.appbody');
  var clickTarg = evt.target;
  var route = clickTarg.dataset.route;
  window.location.hash = route;

  if (clickTarg.classList.contains('home') === true) {
    window.location.hash = 'home';
    renderTo(renderHereAlso, window.location.hash.slice(1));
  }
  if (clickTarg.classList.contains('flights') === true) {
    window.location.hash = 'flights';
    renderTo(renderHereAlso, window.location.hash.slice(1));
  }
  if (clickTarg.classList.contains('carpools') === true) {
    window.location.hash = 'carpools';
    renderTo(renderHereAlso, window.location.hash.slice(1));
  }
  if (clickTarg.classList.contains('concerts') === true) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsRUFBdEIsRUFBeUI7QUFDdkIsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLElBQUksTUFBeEIsRUFBZ0MsR0FBaEMsRUFBb0M7QUFDbEMsT0FBRyxJQUFJLENBQUosQ0FBSCxFQUFXLENBQVgsRUFBYyxHQUFkO0FBQ0Q7QUFDRjs7QUFJRCxJQUFJLE1BQU0sU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQVY7QUFDQSxJQUFJLGlCQUFpQixFQUFFLE9BQUYsQ0FBVSx3Q0FBVixDQUFyQjtBQUNBLElBQUksY0FBYyxFQUFFLE9BQUYsQ0FBVSwyQ0FBVixDQUFsQjtBQUNBLElBQUksV0FBVyxFQUFFLE9BQUYsQ0FBVSx5QkFBVixDQUFmO0FBQ0EsSUFBSSxXQUFVLEVBQUUsT0FBRixDQUFVLGlEQUFWLENBQWQ7QUFDQSxJQUFJLGFBQWEsRUFBRSxPQUFGLENBQVUsbURBQVYsQ0FBakI7QUFDQSxJQUFJLFlBQVksU0FBUyxhQUFULG9DQUFoQjtBQUNBLElBQUksV0FBVyxTQUFTLGFBQVQsNkJBQWY7O0FBSUEsT0FBTyxRQUFQLENBQWdCLElBQWhCLEdBQXVCLE1BQXZCO0FBQ0EsSUFBSSxlQUFlLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUEyQixDQUEzQixDQUFuQjs7QUFFQSxJQUFJLFlBQVksU0FBWixTQUFZLEdBQVU7QUFDdkIsTUFBRyxpQkFBaUIsV0FBcEIsRUFBZ0MsQ0FDOUI7QUFDRixNQUFJLGFBQWEsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWpCO0FBQ0EsYUFBVyxZQUFYO0FBQ0EsV0FBUyxVQUFULEVBQXFCLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUEyQixDQUEzQixDQUFyQjtB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UCxDQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUEyQixDQUEzQixDQUF4QjtBQUNEO0FBQ0QsTUFBSSxVQUFVLFNBQVYsQ0FBb0IsUUFBcEIsQ0FBNkIsVUFBN0IsTUFBNkMsSUFBakQsRUFBc0Q7QUFDcEQsV0FBTyxRQUFQLENBQWdCLElBQWhCLEdBQXVCLFVBQXZCO0FBQ0EsYUFBUyxjQUFULEVBQXdCLE9BQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixLQUFyQixDQUEyQixDQUEzQixDQUF4QjtBQUNEO0FBQ0YsQ0F0QkQ7O0FBd0JBLFNBQVMsVUFBVCxDQUFvQixZQUFwQixFQUFpQztBQUNoQyxZQUFVLFNBQVYsQ0FBb0IsTUFBcEIsQ0FBMkIsUUFBM0I7QUFDQSxXQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsUUFBdkI7QUFDQTs7QUFHRDtBQUNBLE9BQU8sZ0JBQVAsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBdEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5mdW5jdGlvbiBmb3JFYWNoKGFyciwgY2Ipe1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKyl7XG4gICAgY2IoYXJyW2ldLCBpLCBhcnIpXG4gIH1cbn1cblxuXG5cbmxldCBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2JylcbmxldCBjYXJwb29sRHJpdmVycyA9ICQuZ2V0SlNPTignaHR0cDovL2FwaXMuaXMvcmlkZXMvc2FtZmVyZGEtZHJpdmVycy8nKVxubGV0IGNhcnBvb2xQYXNzID0gJC5nZXRKU09OKCdodHRwOi8vYXBpcy5pcy9yaWRlcy9zYW1mZXJkYS1wYXNzZW5nZXJzLycpXG5sZXQgY29uY2VydHMgPSAkLmdldEpTT04oJ2h0dHA6Ly9hcGlzLmlzL2NvbmNlcnRzJylcbmxldCBhcnJpdmFscz0gJC5nZXRKU09OKCdodHRwOi8vYXBpcy5pcy9mbGlnaHQ/bGFuZ3VhZ2U9ZW4mdHlwZT1hcnJpdmFscycpXG5sZXQgZGVwYXJ0dXJlcyA9ICQuZ2V0SlNPTignaHR0cDovL2FwaXMuaXMvZmxpZ2h0P2xhbmd1YWdlPWVuJnR5cGU9ZGVwYXJ0dXJlcycpXG5sZXQgd2FzQWN0aXZlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2NsYXNzPVwiY29sLXNtLTMgbmF2YmFyIGFjdGl2ZVwiXWApXG5sZXQgaXNBY3RpdmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbY2xhc3M9XCJjb2wtc20tMyBuYXZiYXJcIl1gKVxuXG5cblxud2luZG93LmxvY2F0aW9uLmhhc2ggPSAnaG9tZSdcbmxldCBjdXJyZW50Um91dGUgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKVxuXG5sZXQgYXBwUm91dGVyID0gZnVuY3Rpb24oKXtcbiAgXHRpZihjdXJyZW50Um91dGUgPT09ICd1bmRlZmluZWQnKXtcbiAgICB9XG4gIFx0bGV0IHJlbmRlckhlcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXBwYm9keScpXG4gIFx0bWFrZUFjdGl2ZShjdXJyZW50Um91dGUpXG4gIFx0cmVuZGVyVG8ocmVuZGVySGVyZSwgd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkpXG59XG5cbmZ1bmN0aW9uIHJlbmRlclRvKGRvbUVsLCBjdXJyZW50Um91dGUpe1xuICBsZXQgaHRtbFN0cmluZyA9ICcnXG4gIGlmKGN1cnJlbnRSb3V0ZSA9PT0gXCJob21lXCIpe1xuICAgIGh0bWxTdHJpbmcgPWBcbiAgICA8dGFibGU+XG4gICAgICAgIDx0aCBjbGFzcz1cInRhYmxlLWhlYWRlclwiIGNvbHNwYW49XCIyXCI+VGhlIEJhc2ljIEZhY3RzPC90aD5cbiAgICAgIDx0cj5cbiAgICAgICAgPHRkPk5hdGl2ZSBOYW1lPC90ZD5cbiAgICAgICAgPHRkPklzbGFuZDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+RGVtb255bTwvdGQ+XG4gICAgICAgIDx0ZD5JY2VsYW5kZXI8L3RkPlxuICAgICAgPC90cj5cbiAgICAgIDx0cj5cbiAgICAgICAgPHRkPkFyZWEobTIpPC90ZD5cbiAgICAgICAgPHRkPjEwMzAwMDwvdGQ+XG4gICAgICA8L3RyPlxuICAgICAgPHRyPlxuICAgICAgICA8dGQ+Q2FsbGluZyBDb2RlPC90ZD5cbiAgICAgICAgPHRkPjM1MjwvdGQ+XG4gICAgICA8L3RyPlxuICAgIDwvdGFibGU+YFxuXG4gICAgZG9tRWwuaW5uZXJIVE1MID0gaHRtbFN0cmluZ1xuXG4gIH1cbiAgaWYoY3VycmVudFJvdXRlID09PSBcImNvbmNlcnRzXCIpe1xuICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS1oZWFkZXJcIj5DT05DRVJUUzwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5gXG4gICAgICBjb25jZXJ0cy50aGVuKGZ1bmN0aW9uKHNlcnZlclJlcyl7XG4gICAgICAgIGZvckVhY2goc2VydmVyUmVzLnJlc3VsdHMsIGZ1bmN0aW9uKGRhdGFvYmope1xuICAgICAgICAgIGh0bWxTdHJpbmcgKz1gXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTMgY29sLW1kLTQgdGh1bWJuYWlsLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNsZWFyZml4IHZpc2libGUteHMtYmxvY2tcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRodW1ibmFpbFwiPlxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtkYXRhb2JqLmltYWdlU291cmNlfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmZvXCI+XG4gICAgICAgICAgICAgICAgICA8aDQ+JHtkYXRhb2JqLm5hbWV9PC9oND5cbiAgICAgICAgICAgICAgICAgIDxwPlZlbnVlOiR7ZGF0YW9iai5ldmVudEhhbGxOYW1lfTwvcD5cbiAgICAgICAgICAgICAgICAgIDxwPiR7ZGF0YW9iai5kYXRlT2ZTaG93fTwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIH0pXG4gICAgICAgIGh0bWxTdHJpbmcgKz0gYFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5gXG4gICAgICAgIGRvbUVsLmlubmVySFRNTCA9IGh0bWxTdHJpbmdcbiAgICAgIH0pXG4gIH1cbiAgaWYoY3VycmVudFJvdXRlID09PSBcImNhcnBvb2xzXCIpe1xuICAgICAgICBodG1sU3RyaW5nICs9IGBcbiAgICAgICAgICA8ZGl2IGNsYXNzPXJvdz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJsZS1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICBDQVJQT09MU1xuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwiIGNhcnBvb2wtdGFibGUgdGFibGUgY2VudGVyZWRcIj5cbiAgICAgICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgICAgICA8dGg+VGltZSBvZiBEZXBhcnR1cmU8L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPkZyb208L3RoPlxuICAgICAgICAgICAgICAgICAgPHRoPlRvPC90aD5cbiAgICAgICAgICAgICAgICA8L3RoZWFkPmBcbiAgICAgIGNhcnBvb2xEcml2ZXJzLnRoZW4oZnVuY3Rpb24oc2VydmVyUmVzKXtcbiAgICAgICAgZm9yRWFjaChzZXJ2ZXJSZXMucmVzdWx0cywgZnVuY3Rpb24oZGF0YW9iail7XG4gICAgICAgIGh0bWxTdHJpbmcgKz0gYFxuICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai5kYXRlfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai5mcm9tfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai50b308L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgPC90Ym9keT5gXG4gICAgICAgIH0pXG4gICAgICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5gXG4gICAgICAgIGRvbUVsLmlubmVySFRNTCA9IGh0bWxTdHJpbmdcbiAgICAgIH0pXG4gIH1cbiAgaWYoY3VycmVudFJvdXRlID09PSBcImZsaWdodHNcIil7XG4gICAgaHRtbFN0cmluZyArPSBgXG4gICAgPGRpdiBjbGFzcz0ncGFuZWwgY29udGFpbmVyLWZsdWlkIGZsaWdodHMtY29udGFpbmVyJz5cbiAgICAgIDxkaXYgY2xhc3M9XCJmbGlnaHRzLWhlYWRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFibGUtaGVhZGVyXCI+XG4gICAgICAgICAgRkxJR0hUU1xuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz0ncm93Jz5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC02IGZsaWdodHMtY29sdW1uc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGlnaHRzLWNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGlnaHRzLXBhbmVsLWhlYWRpbmdcIj5cbiAgICAgICAgICAgICAgQXJyaXZhbHNcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwiZmxpZ2h0XCI+XG4gICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICA8dGg+RGF0ZTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkFycml2YWwgVGltZTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPk9yaWdpbjwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkFpcmxpbmU8L3RoPlxuICAgICAgICAgICAgICA8L3RoZWFkPmBcbiAgICAkLndoZW4oYXJyaXZhbHMsIGRlcGFydHVyZXMpLnRoZW4oZnVuY3Rpb24gKHNlcnZlclJlc0Fycml2YWxzLCBzZXJ2ZXJSZXNEZXBhcnR1cmVzKXtcbiAgICBmb3JFYWNoKHNlcnZlclJlc0Fycml2YWxzWzBdLnJlc3VsdHMsIGZ1bmN0aW9uKGRhdGFvYmope1xuICAgICAgaHRtbFN0cmluZyArPSBgXG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICA8dGQ+JHtkYXRhb2JqLmRhdGV9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD4ke2RhdGFvYmoucGxhbm5lZEFycml2YWx9PC90ZD5cbiAgICAgICAgICAgICAgICAgIDx0ZD4ke2RhdGFvYmouZnJvbX08L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai5haXJsaW5lfTwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC90Ym9keT5gXG4gICAgfSlcbiAgICBodG1sU3RyaW5nICs9IGBcbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTYgZmxpZ2h0cy1jb2x1bW5zXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZsaWdodHMtY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsaWdodHMtcGFuZWwtaGVhZGluZ1wiPlxuICAgICAgICAgICAgICBEZXBhcnR1cmVzXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cIiBmbGlnaHRcIj5cbiAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgIDx0aD5EYXRlPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+RGVwYXJ0dXJlIFRpbWU8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5EZXN0aW5hdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkFpcmxpbmU8L3RoPlxuICAgICAgICAgICAgICA8L3RoZWFkPmBcblxuICAgIGZvckVhY2goc2VydmVyUmVzRGVwYXJ0dXJlc1swXS5yZXN1bHRzLCBmdW5jdGlvbihkYXRhb2JqKXtcbiAgICAgIGh0bWxTdHJpbmcgKz0gYFxuXG4gICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgIDx0ZD4ke2RhdGFvYmouZGF0ZX08L3RkPlxuICAgICAgICAgICAgICAgICA8dGQ+JHtkYXRhb2JqLnBsYW5uZWRBcnJpdmFsfTwvdGQ+XG4gICAgICAgICAgICAgICAgIDx0ZD4ke2RhdGFvYmoudG99PC90ZD5cbiAgICAgICAgICAgICAgICAgPHRkPiR7ZGF0YW9iai5haXJsaW5lfTwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC9ib2R5PmBcbiAgICB9KVxuICAgICAgaHRtbFN0cmluZyArPSBgXG5cbiAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+YFxuICAgICAgZG9tRWwuaW5uZXJIVE1MID0gaHRtbFN0cmluZ1xuICB9KVxuICAgIH1cbn1cblxuLy93b3JraW5nLy9cbm5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gIGxldCByZW5kZXJIZXJlQWxzbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcHBib2R5JylcbiAgbGV0IGNsaWNrVGFyZyA9IGV2dC50YXJnZXRcblx0bGV0IHJvdXRlID0gY2xpY2tUYXJnLmRhdGFzZXQucm91dGVcbiAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSByb3V0ZVxuXG4gIGlmIChjbGlja1RhcmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdob21lJykgPT09IHRydWUpe1xuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJ2hvbWUnXG4gICAgcmVuZGVyVG8ocmVuZGVySGVyZUFsc28sIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpKVxuICB9XG4gIGlmIChjbGlja1RhcmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdmbGlnaHRzJykgPT09IHRydWUpe1xuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJ2ZsaWdodHMnXG4gICAgcmVuZGVyVG8ocmVuZGVySGVyZUFsc28sIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpKVxuICB9XG4gIGlmIChjbGlja1RhcmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJwb29scycpID09PSB0cnVlKXtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICdjYXJwb29scydcbiAgICByZW5kZXJUbyhyZW5kZXJIZXJlQWxzbyx3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKSlcbiAgfVxuICBpZiAoY2xpY2tUYXJnLmNsYXNzTGlzdC5jb250YWlucygnY29uY2VydHMnKSA9PT0gdHJ1ZSl7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnY29uY2VydHMnXG4gICAgcmVuZGVyVG8ocmVuZGVySGVyZUFsc28sd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIG1ha2VBY3RpdmUoY3VycmVudFJvdXRlKXtcblx0d2FzQWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cdGlzQWN0aXZlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG59XG5cblxuYXBwUm91dGVyKCk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIGFwcFJvdXRlcilcbiJdfQ==
