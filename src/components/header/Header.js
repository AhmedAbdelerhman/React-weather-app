import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";

import axios from "axios";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./Header.css";
import { Redirect } from "react-router-dom";

import City from "../City/City";
import Current from "../current/Current";
import ForecastPreview from "../ForecastPreview/ForecastPreview";
import Footer from "../footor/Footer";

const Header = (props) => {
  const [city, setCity] = useState(props.defaultCity);
  const [weather, setWeather] = useState({});
  const [day, setDay] = useState(null);
  const [hour, setHour] = useState({});
  const [forecast, setForecast] = useState({});
  const [fahrenheit, setFahrenheit] = useState(false);
  const [fSelected, setFSelected] = useState({});
  const [cSelected, setCSelected] = useState(props.unitC);
  const [ready, setReady] = useState(false);
  const history = useHistory();
  var currentColor = JSON.parse(localStorage.getItem("displayTheme"));
  const [isDarkMood, setIsDarkMoog] = useState(currentColor);
  localStorage.setItem("displayTheme", JSON.stringify(isDarkMood));

  function showTime(response) {
    setDay(response.data.day_of_week);
    let date = new Date();
    let hours = date.getUTCHours();
    let inte = parseInt(hours);
    let offset = parseInt(response.data.utc_offset);
    let totalHour = inte + offset;
    if (totalHour >= 24) {
      totalHour -= 24;
    } else if (totalHour < 0) {
      totalHour += 24;
    } else if (totalHour === 0) {
      totalHour = `00`;
    } else if (totalHour < 10) {
      totalHour = `0${totalHour}`;
    } else totalHour = inte + offset;
    setHour({
      ready: true,
      hourSet: totalHour,
    });
  }

  function showForecast(response) {
    setForecast(response.data);
    let timeUrl = `https://worldtimeapi.org/api/timezone/`;
    axios
      .get(`${timeUrl}${response.data.timezone}`)
      .then(showTime)
      .catch(
        () =>
          setHour({
            ready: true,
            hourSet: "00",
          }) & setDay(0)
      )
      .then(() => setReady(true));
  }

  function showWeather(response) {
    setWeather({
      ready: true,
      city: response.data.name,
      description: response.data.weather[0].description,
      temp: response.data.main.temp,
      icon: response.data.weather[0].icon,
      humid: response.data.main.humidity,
      wind: response.data.wind.speed,
      latitude: response.data.coord.lat,
      longitude: response.data.coord.lon,
    });

    let latitude = response.data.coord.lat;
    let longitude = response.data.coord.lon;
    let apiKeyWeather = `a785b12636ed229463fa77e0a6deb5be`;
    let weatherForecastUrl = `https://api.openweathermap.org/data/2.5/onecall`;
    axios
      .get(
        `${weatherForecastUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKeyWeather}&units=metric`
      )
      .then(showForecast);
  }

  function search() {
    let apiKey = `a785b12636ed229463fa77e0a6deb5be`;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(url).then(showWeather);
    setCity("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    //setReady(false);
    history.push("/forecast");
    search();
  }

  function handleChange(event) {
    setCity(event.target.value);
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function displayFahrenheit(event) {
    event.preventDefault();
    setFahrenheit(true);
    setFSelected({
      color: `#fcfeff`,
      backgroundColor: `#465866`,
      borderRadius: `50%`,
      cursor: `default`,
    });
    setCSelected({});
  }

  function displayCelcius(event) {
    event.preventDefault();
    setFahrenheit(false);
    setCSelected({
      color: `#fcfeff`,
      backgroundColor: `#465866`,
      borderRadius: `50%`,
      cursor: `default`,
    });
    setFSelected({});
  }

  if (ready) {
    return (
      // all app
      <div>
        <div className={`${isDarkMood ? "darkMoodApp" : "lightMoodApp"}`}>
          <div className="Header">
            <div className="page-name">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setIsDarkMoog(!isDarkMood)}
              >
                {isDarkMood ? <NightlightIcon /> : <LightModeIcon />}
              </span>
            </div>
            <div className="search-form">
              <form onSubmit={handleSubmit}>
                <button>
                  <i className="fas fa-search search-icon" />
                </button>
                <input
                  className="text-input"
                  type="text"
                  placeholder="Search for a city"
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                  onChange={handleChange}
                  value={city}
                />
              </form>
            </div>
            <div className="conversion">
              <a href="http://">
                <span
                  className="conversion-c"
                  onClick={displayCelcius}
                  style={cSelected}
                >
                  C
                </span>
                <span
                  className="conversion-f"
                  onClick={displayFahrenheit}
                  style={fSelected}
                >
                  F
                </span>
              </a>
            </div>
          </div>
          <Route path="*">
            <Redirect to="/forecast" />
          </Route>
          <Route
            path="/forecast"
            exact
            render={(props) => (
              <City
                {...props}
                city={weather.city}
                description={weather.description}
                dayOfWeek={day}
                fullHour={hour.hourSet}
              />
            )}
          />
          <Route
            path="/forecast"
            exact
            render={(props) => (
              <Current
                {...props}
                temperature={weather.temp}
                humidity={weather.humid}
                wind={weather.wind}
                icon={weather.icon}
                unit={fahrenheit}
              />
            )}
          />
          <div className="forecast-flax-wrapper forecast-scroll">
            <Route
              path="/forecast"
              exact
              render={(props) => (
                <ForecastPreview
                  {...props}
                  max={forecast.daily[0].temp.max}
                  min={forecast.daily[0].temp.min}
                  icon={forecast.daily[0].weather[0].icon}
                  day={day}
                  unit={fahrenheit}
                />
              )}
            />
            <Route
              path="/forecast"
              exact
              render={(props) => (
                <ForecastPreview
                  {...props}
                  max={forecast.daily[1].temp.max}
                  min={forecast.daily[1].temp.min}
                  icon={forecast.daily[1].weather[0].icon}
                  day={day + 1}
                  unit={fahrenheit}
                />
              )}
            />
            <Route
              path="/forecast"
              exact
              render={(props) => (
                <ForecastPreview
                  {...props}
                  max={forecast.daily[2].temp.max}
                  min={forecast.daily[2].temp.min}
                  icon={forecast.daily[2].weather[0].icon}
                  day={day + 2}
                  unit={fahrenheit}
                />
              )}
            />
            <Route
              path="/forecast"
              exact
              render={(props) => (
                <ForecastPreview
                  {...props}
                  max={forecast.daily[3].temp.max}
                  min={forecast.daily[3].temp.min}
                  icon={forecast.daily[3].weather[0].icon}
                  day={day + 3}
                  unit={fahrenheit}
                />
              )}
            />
            <Route
              path="/forecast"
              exact
              render={(props) => (
                <ForecastPreview
                  {...props}
                  max={forecast.daily[4].temp.max}
                  min={forecast.daily[4].temp.min}
                  icon={forecast.daily[4].weather[0].icon}
                  day={day + 4}
                  unit={fahrenheit}
                />
              )}
            />
            <Route
              path="/forecast"
              exact
              render={(props) => (
                <ForecastPreview
                  {...props}
                  max={forecast.daily[5].temp.max}
                  min={forecast.daily[5].temp.min}
                  icon={forecast.daily[5].weather[0].icon}
                  day={day + 5}
                  unit={fahrenheit}
                />
              )}
            />
            <Route
              path="/forecast"
              exact
              render={(props) => (
                <ForecastPreview
                  {...props}
                  max={forecast.daily[6].temp.max}
                  min={forecast.daily[6].temp.min}
                  icon={forecast.daily[6].weather[0].icon}
                  day={day + 6}
                  unit={fahrenheit}
                />
              )}
            />
          </div>
        </div>
        <Footer theme={isDarkMood} />
      </div>
    );
  } else {
    return (
      <div className="loader">
        <BallTriangle
          type="ThreeDots"
          color="#94aec2"
          height={100}
          width={150}
          timeout={3000} //3 secs
        />
      </div>
    );
  }
};

export default Header;
