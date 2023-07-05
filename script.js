const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorPage = document.querySelector(".error-page");
const root = document.documentElement.style;
const modeBtn = document.querySelector('.mode-btn');
const modeBtnImg = document.querySelector('.mode-btn-img');

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    errorPage.classList.remove("active");
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");

    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fetch the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    const maxTemp = document.querySelector("[data-maxTemp]");
    const pressure = document.querySelector("[data-pressure]");
    const minTemp = document.querySelector("[data-minTemp]");

    console.log(weatherInfo);

    //fetch values from weather info object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    maxTemp.innerText = `${weatherInfo?.main?.temp_max} °C`;
    pressure.innerText = `${weatherInfo?.main?.pressure} mbar`;
    minTemp.innerText = `${weatherInfo?.main?.temp_min} °C`;


}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})



async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.cod === '404') {
            loadingScreen.classList.remove("active");
            errorPage.classList.add("active");
        }
        else {
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            errorPage.classList.remove("active");
            renderWeatherInfo(data);
        }
    }
    catch (err) {
        window.alert("Invalid Input!");
    }
}

let darkMode = false;

//SWITCH TO DARK MODE - activateDarkMode
function darkModeProperties() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.style.backgroundImage = "linear-gradient(160deg, rgb(12 11 11) 0%, rgb(48 50 52) 100%)";
    root.setProperty("--colorDark2", "#494e53");
}

//SWITCH TO LIGHT MODE - activateLightMode
function lightModeProperties() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.style.backgroundImage = "linear-gradient(160deg, #15457d 0%, #84addf 100%)";
    root.setProperty("--colorDark2", "#3F72AF");
}

modeBtn.addEventListener('click', () => {
    darkMode = !darkMode;

    if(darkMode){
        modeBtnImg.style.width = "28px";
        modeBtnImg.style.paddingBottom = "4px";
        modeBtnImg.src = "./assets/sun-icon.svg";

        darkModeProperties();
    }
    else{
        modeBtnImg.style.width = "32px";
        modeBtnImg.src = "./assets/dark-mode.png";
        lightModeProperties();
    }
})


