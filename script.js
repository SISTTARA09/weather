"use strict";
const cl = console.log;
// GET THE ELEMENT
let form = document.getElementById("form");
let input = document.getElementById("input");
let apiKey = "b9f40d7a87a00ab0696c5daf08615c91";
let dataBox = document.querySelector(".show-data");
// ADD THE EVENT LISTENER
form.addEventListener("submit", async (ev) => {
	ev.preventDefault();
	// let city = input.value;
	let mainData = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`
	);
	try {
		let data = await mainData.json();
		let description = data.weather[0].description;
		let icon = data.weather[0].icon;
		// WORK WITH SHOW BOX
		dataBox.innerHTML = `
        <span class="city" id="city">City: <b>${input.value}</b></span>
        <span class="img" id="img">
          <img id="image" src="http://openweathermap.org/img/wn/${icon}.png" width="70px">
        </span>
        <span class="status" id="status">${description}</span>
        <div class="time-temp">
          <span class="temp" id="temp" >${data.main.temp.toFixed(0)} °C</span>
          <span class="time" id="time">${new Date().getHours()}:${new Date().getMinutes()}</span>
        `;
		dataBox.style.display = "flex";
	} catch (reason) {
		let undefinedCity = document.getElementById("indefinedCity");
		undefinedCity.style = "display:flex;";
		setTimeout(() => {
			undefinedCity.style = "display:none;";
		}, 2000);
	}
});
// WORK WITH LOCATION CITY
let tbodyTable = document.querySelector("table tbody");
let citiesArr = ["london", "paris", "madrid"];

window.onload = function () {
	navigator.geolocation.getCurrentPosition(async (pos) => {
		let latitude = pos.coords.latitude;
		let longitude = pos.coords.longitude;
		let positionUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
		let positionMainData = await fetch(positionUrl);
		try {
			let positionData = await positionMainData.json();
			citiesArr.unshift(positionData.address.city);
			citiesArr.forEach(async (ele) => {
				let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ele}&appid=${apiKey}&units=metric`;
				let weatherMainData = await fetch(weatherUrl);
				try {
					let weatherData = await weatherMainData.json();
					tbodyTable.innerHTML += `
					<tr>
						<td>${ele.toLocaleLowerCase()}</td>
						<td>${weatherData.main.temp.toFixed(0)}</td>
						<td>${weatherData.weather[0].description}</td>
						<td><img src="http://openweathermap.org/img/wn/${
							weatherData.weather[0].icon
						}.png" width="50"></td>
      	</tr>`;
					tbodyTable.parentElement.style.display = 'flex';
				} catch (re) {
					cl(re);
				}
			});
		} catch (re) {
			cl(re);
		}
	});
};
