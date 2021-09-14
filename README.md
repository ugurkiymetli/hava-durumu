
# Hava Durumu ([Live Demo](http://www.ugurkiymetli.com/hava-durumu.html))

Açık kaynak hava durumu ve geo-lokasyon arama API’leri kullanılarak geliştirilen mobil ve
masaüstü [responsive tasarıma](https://getbootstrap.com/docs/3.3/getting-started/) sahip bir hava durumu web uygulaması.

## Ekran Görüntüleri

[![hava-durumu-1.md.jpg](https://s9.gifyu.com/images/hava-durumu-1.md.jpg)](https://gifyu.com/image/JrmO)  
[![hava-durumu-2.md.jpg](https://s9.gifyu.com/images/hava-durumu-2.md.jpg)](https://gifyu.com/image/JrmB)  
[![hava-durumu-mobil.gif](https://s9.gifyu.com/images/hava-durumu-mobil.gif)](https://gifyu.com/image/Jrmy)  

  
## API Kullanımı


| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `keyOpenWeatherAPI` | `string` | **Gerekli**. [Open Weather](https://openweathermap.org/api) API anahtarınız. |
| `keyMapQuestAPI` | `string` | **Gerekli**. Mapquest Geocoding API API anahtarınız. |

OpenWeather’ın kullanımı bedava olan [API](https://openweathermap.org/api/one-call-api)’sinde bazı kısıtlamalar mevcut. Şehir
ismiyle arama yapıldığında ileriye dönük tahmin verilerini vermiyor fakat koordinat ile
arama yapılırsa veriyor. O yüzden bu sıkıntıyı aşmak için bir başka API’ye
başvruruyoruz, [Mapquest Geocoding API](https://developer.mapquest.com/documentation/geocoding-api/). Kullanıcıdan aldığımız şehir ismini buradan
sorgulatarak o şehrin koordinatlarını buluyoruz. Bu koordinatlar ile de hava durumu
tahminlerimizi edinip kullanıcıya gösteriyoruz.

```javascript
function fetchCoordsCityName(cityName) {
	if (cityName == "") {
		alert("Şehir giriniz!");
	} else {
		let api = `http://www.mapquestapi.com/geocoding/v1/address?key=${keyMapQuestAPI}&thumbMaps=false&maxResults=1&location=${cityName}`;
		fetch(api)
			.then(
				function (response) {
					let data = response.json();
					return data;
				}).then(function (data) {
				let lat = data.results[0].locations[0].latLng.lat;
				let lon = data.results[0].locations[0].latLng.lng;
				getForecastLocation(lat, lon); //koordinat bilgisi ile openweather'dan sorgulanıyor.
			});
	}
}
```

### Hava durumu göstermek için kullanılan fonksiyonlar
#### API'den gelen güncel verinin işlenmesi.

```javascript
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
```  
#### API'den gelen tahmin verisinin işlenmesi.

```javascript
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
```  
#### Şehir ismiyle güncel verinin getirilmesi.

```javascript
  function getWeatherCityName(cityName) {
	if (cityName == "") {
		alert("Şehir giriniz!");
	} else {
		let api = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=tr&units=metric&appid=${key}`;
		fetchCurrent(api);
	}
}
```
#### Şehir ismiyle tahmin verilerinin getirilmesi.

```javascript
  function getForecastCityName(cityName) {
	if (cityName == "") {
		alert("Şehir giriniz!");
	} else {
		let api = `http://api.openweathermap.org/data/2.5/onecall?q=${cityName}&lang=tr&units=metric&appid=${keyOpenWeatherAPI}`;
		console.log("--getForecastCityName func--");
		fetchForecast(api);
	}
}
```


  
