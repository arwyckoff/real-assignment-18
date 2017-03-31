
function forEach(arr, cb){
  for (var i = 0; i < arr.length; i++){
    cb(arr[i], i, arr)
  }
}


let arrivals= $.getJSON('http://apis.is/flight?language=en&type=arrivals')
let departures = $.getJSON('http://apis.is/flight?language=en&type=departures')
let carpoolDrivers = $.getJSON('http://apis.is/rides/samferda-drivers/')
let carpoolPass = $.getJSON('http://apis.is/rides/samferda-passengers/')
let concerts = $.getJSON('http://apis.is/concerts')
let nav = document.querySelector('.nav')
let wasActive = document.querySelector(`[class="col-sm-3 navbar active"]`)
let isActive = document.querySelector(`[class="col-sm-3 navbar"]`)



window.location.hash = 'home'
let currentRoute = window.location.hash.slice(1)

let appRouter = function(){
  	if(currentRoute === 'undefined'){
    }
  	let renderHere = document.querySelector('.mainView')
  	makeActive(currentRoute)
  	renderTo(renderHere, window.location.hash.slice(1))
}

function renderTo(domEl, currentRoute){
  let htmlString = ''
  if(currentRoute === "home"){
    htmlString =`
    <table>
      <tr>
        <th>The Basic Facts</th>
      </tr>
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
            CONCERTS
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
              <div class="panel-heading">
                CARPOOLS
              </div>
              <table class="table">
                <thead>
                  <th>Time of Departure</th>
                  <th>From</th>
                  <th>To</th>
                </thead>`
      carpoolDrivers.then(function(serverRes){
        console.log(serverRes);
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
    <div class='container-fluid flights-container'>
      <div class="panel panel-default">
        <div class="panel-body">
          FLIGHTS
        </div>
      </div>
      <div class='row'>
        <div class="col-md-6 flights-columns">
          <div class="panel panel-default flights-content">
            <div class="panel-heading flights-panel-heading">
              Arrivals
            </div>
            <table class="table">
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
          <div class="panel panel-default flights-content">
            <div class="panel-heading flights-panel-heading">
              Departures
            </div>
            <table class="table">
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

nav.addEventListener('click', function(evt){
  console.log('BANG')
  let renderHereAlso = document.querySelector('.mainView')
  // let daRooooooooooot = window.location.hash.slice(1)
  let clickTarg = evt.target
	let route = clickTarg.dataset.route
  window.location.hash = route

  if (clickTarg.classList.contains('home') === true){
    console.log('Let me go home!')
    window.location.hash = 'home'
    renderTo(renderHereAlso, window.location.hash.slice(1))
  }
  if (clickTarg.classList.contains('flights') === true){
    console.log("I'll fly away!")
    window.location.hash = 'flights'
    renderTo(renderHereAlso, window.location.hash.slice(1))
  }
  if (clickTarg.classList.contains('carpools') === true){
    console.log('Life is a highway!')
    window.location.hash = 'carpools'
    renderTo(renderHereAlso,window.location.hash.slice(1))
  }
  if (clickTarg.classList.contains('concerts') === true){
    console.log('For those about to rock!')
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
