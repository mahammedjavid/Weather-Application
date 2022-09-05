const timeEl = document.getElementById('time')
const dateEl = document.getElementById('date')
const currentWeatherItems = document.getElementById('current-weather-items')
const timeZone = document.getElementById('time-zone')
const CountryEl = document.getElementById('country')
const weatherForecastEl = document.getElementById('weather-forecast')
const currentTempEl = document.getElementById('current-temp')

// to convert date to word

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const months = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec']

const API_KEY ='49cc8c821cd2aff9af04c9f98c36eb74';
setInterval(() => {
    const  time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12Hourformat = hour >= 13 ?hour %12 :hour
    const minute = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12Hourformat <10 ? '0'+hoursIn12Hourformat : hoursIn12Hourformat) + ':' + (minute<10 ? '0'+minute:minute ) + ' '+`<span id="am-pm"> ${ampm}</span>`

    dateEl.innerHTML = days[day] + ' , '+date+ ' '+months[month]
    
}, 1000);


getWeatherData()
function getWeatherData () {
   navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude} = success.coords;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{

            console.log(data)
            showWeatherData(data)
        })

    })
}

function showWeatherData(data){
    let {humidity, pressure, sunset, sunrise, wind_speed} = data.current;


    // timezone

    // timeZone.innerHTML = data.timeZone;
    CountryEl.innerHTML = data.lat + "N" + data.lon+"E"
    // we got the data in current so data.current
// now need to show humidity in screen co cut from html to js
    currentWeatherItems.innerHTML = `                   
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>`;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src=" http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="others">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>

            </div>
            
            `
        }else{
            otherDayForcast += `
           <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src=" http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;

                    


}