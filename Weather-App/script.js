const apiKey = "e537188a9977488fffd9d66943070578";
const logsList = document.getElementById("logs-list");
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("welcome-screen").classList.add("d-none");
  document.getElementById("dashboard").classList.remove("d-none");
  document.getElementById("theme-css").setAttribute("href", "dashboard.css");
  autoDetectLocation();
});
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("search-input").value;
  if(city) {
    fetchWeather(city);
    addLog(`Searched for ${city}`);
  }
});
function addLog(message) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
  logsList.appendChild(li);
}
document.getElementById("download-logs").addEventListener("click", () => {
  const logs = Array.from(logsList.children).map(li => li.textContent).join("\n");
  const blob = new Blob([logs], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "weather_logs.txt";
  link.click();
});
document.getElementById("download-forecast").addEventListener("click", () => {
  const forecast = document.getElementById("dashboard").innerText;
  const blob = new Blob([forecast], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "weather_forecast.txt";
  link.click();
});

function autoDetectLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    addLog("Auto-detected location");
  });
}
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  if(data.cod === "200") {
    updateToday(data.city.name, data.list[0], data.city);
    updateWeekly(data.list);
    fetchAQI(data.city.coord.lat, data.city.coord.lon);
    drawCharts(data.list);
    fetchAlerts(data.city.coord.lat, data.city.coord.lon);
  } else {
    addLog("Error: Invalid city");
  }
}
async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  if(data.cod === "200") {
    updateToday(data.city.name, data.list[0], data.city);
    updateWeekly(data.list);
    fetchAQI(lat, lon);
    drawCharts(data.list);
    fetchAlerts(lat, lon);
  }
}
function updateToday(city, today, cityData) {
  document.getElementById("city").textContent = city;
  document.getElementById("temperature").textContent = `${today.main.temp}°C (Feels like ${today.main.feels_like}°C)`;
  document.getElementById("condition").textContent = today.weather[0].main;
  document.getElementById("humidity").textContent = `Humidity: ${today.main.humidity}%`;
  document.getElementById("wind").textContent = `Wind: ${today.wind.speed} km/h`;
  document.getElementById("fog").textContent = `Fog Level: ${today.visibility < 1000 ? "High" : "Low"}`;
  document.getElementById("rain").textContent = `Rain Chance: ${today.pop ? today.pop * 100 : 0}%`;
  document.getElementById("sunrise").textContent = `Sunrise: ${new Date(cityData.sunrise * 1000).toLocaleTimeString()}`;
  document.getElementById("sunset").textContent = `Sunset: ${new Date(cityData.sunset * 1000).toLocaleTimeString()}`;
}
function updateWeekly(list) {
  const container = document.getElementById("weekly-forecast");
  container.innerHTML = "";
  for(let i=0; i<list.length; i+=8) {
    const day = list[i];
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
      <p>${day.main.temp}°C</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
    `;
    container.appendChild(div);
  }
}
async function fetchAQI(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const aqi = data.list[0].main.aqi;
  const levels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  document.getElementById("aqi").textContent = `Air Quality: ${levels[aqi-1]}`;
}
async function fetchAlerts(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  if(data.alerts && data.alerts.length > 0) {
    document.getElementById("alerts").textContent = `Alerts: ${data.alerts[0].event} - ${data.alerts[0].description}`;
  } else {
    document.getElementById("alerts").textContent = "Alerts: None";
  }
}
function drawCharts(list) {
  const labels = list.slice(0, 8).map(item => new Date(item.dt_txt).getHours() + ":00");
  const temps = list.slice(0, 8).map(item => item.main.temp);
  const rain = list.slice(0, 8).map(item => item.pop * 100);
  new Chart(document.getElementById("tempChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        borderColor: "#f1200d",
        backgroundColor: "rgba(216, 171, 167, 0.3)",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#e9dbdb" } } },
      scales: { x: { ticks: { color: "#c9bcbc" } }, y: { ticks: { color: "#bcbcbc" } } }
    }
  });

  // Rain chart
  new Chart(document.getElementById("rainChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Rain Chance (%)",
        data: rain,
        backgroundColor: "rgba(216, 174, 35, 0.99)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#fff" } } },
      scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } }
    }
  });
}
