//API
//openweather api key
const key = "b9e8ddc20a672bf8cdcffd0193b2aa0a";
//mapquest api key
const key2 = "Y9QVmRGWZUavjlpNda6CreXSUXVwDGZ5";

//Elements
const searchKey = document.querySelector("#searchKey");
const searchBtn = document.querySelector("#searchBtn");
const locationIcon = document.getElementById("locationIcon");
const currentCity = document.querySelector("#city");
const currentCountry = document.querySelector("#country");
const currentDate = document.querySelector("#date");
const currentDesc = document.querySelector("#currentDescription");
const currentTemp = document.querySelector("#currentTemp");
const currentWind = document.querySelector("#currentWind");
const currentWindDegree = document.querySelector("#currentWindDegree");
const currentHumidity = document.querySelector("#currentHumidity");
const currentRainProb = document.querySelector("#currentRainProb");
const forecastTable = document.querySelector("#forecast");

/*const notification = document.querySelector("#notification");*/

//app data
const date = new Date();
const weather = {};
var forecast;

//const arrays
const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

/*notification.style.display = "none";*/

//event listener
searchBtn.addEventListener('click', eventHandler);

function eventHandler(e) {
	e.preventDefault();
	let citySearched = searchKey.value.trim();
	getWeatherCityName(citySearched);
	fetchCoordsCityName(citySearched);
}

//location services
if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
	/*notification.style.display = "block";
	notification.innerHTML = "<p>Konum servisi kullanılamıyor.</p>";*/
}

function setPosition(position) {
	//locationIcon göster
	let lat = position.coords.latitude;
	let lon = position.coords.longitude;
	getWeatherCoords(lat, lon);
	locationIcon.classList.toggle('d-none');
	getForecastLocation(lat, lon);
}

function showError(error) {
	/*notification.style.display = "block";
	notification.innerHTML = "<p>Konum servisi kullanılamıyor.</p>";*/
}

//fetch location
function fetchCoordsCityName(cityName) {
	if (cityName == "") {
		alert("Şehir giriniz!");
	} else {
		let api = `http://www.mapquestapi.com/geocoding/v1/address?key=${key2}&thumbMaps=false&maxResults=1&location=${cityName}`;
		fetch(api)
			.then(
				function (response) {
					let data = response.json();
					return data;
				}).then(function (data) {
				let lat = data.results[0].locations[0].latLng.lat;
				let lon = data.results[0].locations[0].latLng.lng;
				getForecastLocation(lat, lon);
			});
	}
}

//fetch current
function fetchCurrent(api) {
	fetch(api)
		.then(function (response) {
			let data = response.json();
			return data;
		}).then(function (data) {
			weather.date = data.dt;
			weather.temp = Math.round(data.main.temp);
			weather.description = data.weather[0].description;
			weather.humidty = data.main.humidity;
			weather.wind = data.wind;
			weather.city = data.name;
			weather.country = data.sys.country;
		}).then(function () {
			displayCurrent();
		});
}
//fetch forecast
function fetchForecast(api) {
	fetch(api)
		.then(function (response) {
			let data = response.json();
			console.log(data);
			return data;
		}).then(function (data) {
			forecast = data.daily;
			currentRainProb.textContent = Math.round(forecast[0].pop * 100) + " %";

		}).then(function () {

			displayForecast();
		})
}
//get by user location
function getWeatherCoords(lat, lon) {
	let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=tr&units=metric&appid=${key}`;
	fetchCurrent(api);
}
//get by city name
function getWeatherCityName(cityName) {
	if (cityName == "") {
		alert("Şehir giriniz!");
	} else {
		let api = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=tr&units=metric&appid=${key}`;
		fetchCurrent(api);
	}
}

function getForecastLocation(lat, lon) {
	let api = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=tr&units=metric&appid=${key}`;
	fetchForecast(api);
}

function getForecastCityName(cityName) {
	if (cityName == "") {
		alert("Şehir giriniz!");
	} else {
		let api = `http://api.openweathermap.org/data/2.5/onecall?q=${cityName}&lang=tr&units=metric&appid=${key}`;
		console.log("--getForecastCityName func--");
		fetchForecast(api);
	}
}
//display current
function displayCurrent() {
	currentCity.textContent = weather.city;
	currentCountry.textContent = weather.country;
	currentDate.textContent = timeConverter(weather.date);
	currentDesc.textContent = weather.description;
	currentTemp.textContent = weather.temp + " °C";
	currentHumidity.textContent = weather.humidty + " %";
	currentWind.textContent = weather.wind.speed.toFixed(1) + " m/s " + degToDir(weather.wind.deg);
}
//display forecast
function displayForecast() {
	console.log("^^ begin query - display forecast ^^");
	console.log(forecastTable.children);
	console.log(forecastTable.children.length)
	for (let i = 0; i < forecastTable.children.length; i++) {
		//date
		forecastTable.children[i]
			.firstElementChild
			.firstElementChild
			.textContent = timeConverterDate(forecast[i + 1].dt);
		//date-day
		forecastTable.children[i]
			.firstElementChild
			.lastElementChild
			.textContent = timeConverterDay(forecast[i + 1].dt);
		//temperature
		forecastTable.children[i]
			.lastElementChild
			.firstElementChild
			.children[1]
			.textContent = Math.round(forecast[i + 1].temp.day) + " °C";
		//rain probability
		forecastTable.children[i]
			.lastElementChild
			.firstElementChild
			.children[3]
			.textContent = Math.round(forecast[i + 1].pop * 100) + "%";

		// STLYING //

		//temperature margin
		forecastTable.children[i]
			.lastElementChild
			.firstElementChild
			.children[1].style.marginBottom = "1.5rem";
		//temperature font size
		forecastTable.children[i]
			.lastElementChild
			.firstElementChild
			.children[1].style.fontSize = "1.5rem";
		//rain probability font-size
		forecastTable.children[i]
			.lastElementChild
			.firstElementChild
			.children[3].style.fontSize = "1.5rem";

		//temperature icon font size
		forecastTable.children[i]
			.lastElementChild
			.firstElementChild
			.children[0].style.fontSize = '1.2rem';
		//rain probability icon font size
		forecastTable.children[i]
			.lastElementChild
			.firstElementChild
			.children[2].style.fontSize = '1.2rem';

	}
	console.log("^^ end query - display forecast  ^^");
}
//unix time converter
function timeConverter(dt) {
	var a = new Date(dt * 1000);
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var day = days[a.getDay()];
	var date = a.getDate();
	var time = date + ' ' + month + ' ' + year + ' ' + day;
	return time;
}

function timeConverterDate(dt) {
	var a = new Date(dt * 1000);
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var time = date + ' ' + month + ' ' + year
	return time;
}

function timeConverterDay(dt) {
	var a = new Date(dt * 1000);
	var day = days[a.getDay()];
	return day;
}

//wind degree to wind direction
var degToDir = function (deg) {
	var directions = ['Kuzey',
				   'Kuzey Batı',
				   'Batı',
				   'Güney Batı',
				   'Güney',
				   'Güney Doğu',
				   'Doğu',
				   'Kuzey Doğu'];
	return directions[Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8];
}
