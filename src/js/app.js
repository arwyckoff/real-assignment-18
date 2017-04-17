
function forEach(arr, cb){
  for (var i = 0; i < arr.length; i++){
    cb(arr[i], i, arr)
  }
}



let nav = document.querySelector('.nav')
let carpoolDrivers = $.getJSON('http://apis.is/rides/samferda-drivers/')
let carpoolPass = $.getJSON('http://apis.is/rides/samferda-passengers/')
let concerts = $.getJSON('http://apis.is/concerts')
let arrivals= $.getJSON('http://apis.is/flight?language=en&type=arrivals')
let departures = $.getJSON('http://apis.is/flight?language=en&type=departures')
let wasActive = document.querySelector(`[class="col-sm-3 navbar active"]`)
let isActive = document.querySelector(`[class="col-sm-3 navbar"]`)



window.location.hash = 'home'
let currentRoute = window.location.hash.slice(1)

let appRouter = function(){
  	if(currentRoute === 'undefined'){
    }
  	let renderHere = document.querySelector('.appbody')
  	makeActive(currentRoute)
  	renderTo(renderHere, window.location.hash.slice(1))
}

function renderTo(domEl, currentRoute){
  let htmlString = ''
  if(currentRoute === "home"){
    htmlString =`
    <table>
        <th class="table-header" colspan="2">The Basic Facts</th>
      <tr>
        <td>Native Name</td>
        <td>Island</td>
      </tr>
      <tr>
        <td>Demonym</td>
        <td>Icelander</td>
      </tr>
      <tr>
        <td>Area(m2)</td>
        <td>103000</td>
      </tr>
      <tr>
        <td>Calling Code</td>
        <td>352</td>
      </tr>
    </table>`

    domEl.innerHTML = htmlString

  }
  if(currentRoute === "concerts"){
      htmlString += `
        <div class="panel panel-default">
          <div class="panel-body">
            <div class="table-header">CONCERTS</div>
          </div>
          <div class="row">`
      concerts.then(function(serverRes){
        forEach(serverRes.results, function(dataobj){
          htmlString +=`
            <div class="col-sm-3 col-md-4 thumbnail-container">
            <div class="clearfix visible-xs-block"></div>
              <div class="thumbnail">
                <img src="${dataobj.imageSource}">
                <div class="info">
                  <h4>${dataobj.name}</h4>
                  <p>Venue:${dataobj.eventHallName}</p>
                  <p>${dataobj.dateOfShow}</p>
                </div>
              </div>
            </div>`
        })
        htmlString += `
          </div>
        </div>`
        domEl.innerHTML = htmlString
      })
  }
  if(currentRoute === "carpools"){
        htmlString += `
          <div class=row>
            <div class="panel panel-default">
              <div class="table-header">
                CARPOOLS
              </div>
              <table class=" carpool-table table centered">
                <thead>
                  <th>Time of Departure</th>
                  <th>From</th>
                  <th>To</th>
                </thead>`
      carpoolDrivers.then(function(serverRes){
        forEach(serverRes.results, function(dataobj){
        htmlString += `
                  <tbody>
                    <tr>
                      <td>${dataobj.date}</td>
                      <td>${dataobj.from}</td>
                      <td>${dataobj.to}</td>
                    </tr>
                  </tbody>`
        })
          htmlString += `
              </table>
            </div>
          </div>`
        domEl.innerHTML = htmlString
      })
  }
  if(currentRoute === "flights"){
    htmlString += `
    <div class='panel container-fluid flights-container'>
      <div class="flights-header">
        <div class="table-header">
          FLIGHTS
        </div>
      </div>
      <div class='row'>
        <div class="col-md-6 flights-columns">
          <div class="flights-content">
            <div class="flights-panel-heading">
              Arrivals
            </div>
            <table class="flight">
              <thead>
                <th>Date</th>
                <th>Arrival Time</th>
                <th>Origin</th>
                <th>Airline</th>
              </thead>`
    $.when(arrivals, departures).then(function (serverResArrivals, serverResDepartures){
    forEach(serverResArrivals[0].results, function(dataobj){
      htmlString += `
              <tbody>
                <tr>
                  <td>${dataobj.date}</td>
                  <td>${dataobj.plannedArrival}</td>
                  <td>${dataobj.from}</td>
                  <td>${dataobj.airline}</td>
                </tr>
              </tbody>`
    })
    htmlString += `
            </table>
          </div>
        </div>
        <div class="col-md-6 flights-columns">
          <div class="flights-content">
            <div class="flights-panel-heading">
              Departures
            </div>
            <table class=" flight">
              <thead>
                <th>Date</th>
                <th>Departure Time</th>
                <th>Destination</th>
                <th>Airline</th>
              </thead>`

    forEach(serverResDepartures[0].results, function(dataobj){
      htmlString += `

              <tbody>
                <tr>
                 <td>${dataobj.date}</td>
                 <td>${dataobj.plannedArrival}</td>
                 <td>${dataobj.to}</td>
                 <td>${dataobj.airline}</td>
                </tr>
              </body>`
    })
      htmlString += `

            </table>
          </div>
        </div>
      </div>`
      domEl.innerHTML = htmlString
  })
    }
}

//working//
nav.addEventListener('click', function(evt){
  let renderHereAlso = document.querySelector('.appbody')
  let clickTarg = evt.target
	let route = clickTarg.dataset.route
  window.location.hash = route

  if (clickTarg.classList.contains('home') === true){
    window.location.hash = 'home'
    renderTo(renderHereAlso, window.location.hash.slice(1))
  }
  if (clickTarg.classList.contains('flights') === true){
    window.location.hash = 'flights'
    renderTo(renderHereAlso, window.location.hash.slice(1))
  }
  if (clickTarg.classList.contains('carpools') === true){
    window.location.hash = 'carpools'
    renderTo(renderHereAlso,window.location.hash.slice(1))
  }
  if (clickTarg.classList.contains('concerts') === true){
    window.location.hash = 'concerts'
    renderTo(renderHereAlso,window.location.hash.slice(1))
  }
})

function makeActive(currentRoute){
	wasActive.classList.remove('active')
	isActive.classList.add('active')
}


appRouter();
window.addEventListener('hashchange', appRouter)
