const BASE_URL = "http://www.fhbsc.co.za/weather/";
const WEATHER_API = BASE_URL + "smartphone/weather.json";
export const DAY_WIND = "daywind.png";
export const DAY_WIND_DIR = "daywinddir.png";
export const WEEK_WIND = "weekwind.png";
export const WEEK_WIND_DIR = "weekwinddir.png";
export const DAY_TEMP_DEW = "daytempdew.png";
export const WEEK_TEMP_DEW = "weektempdew.png";
export const DAY_BAROMETER = "daybarometer.png";
export const WEEK_BAROMETER = "weekbarometer.png";
export const DAY_RAIN = "dayrain.png";
export const MONTH_RAIN = "monthrain.png";

export const REMOTE_IMAGES = BASE_URL;
export const LOCAL_DAY_WIND = require("../../imgs/graphs/daywind.png");
export const LOCAL_DAY_WIND_DIR = require("../../imgs/graphs/daywinddir.png");
export const LOCAL_WEEK_WIND = require("../../imgs/graphs/weekwind.png");
export const LOCAL_WEEK_WIND_DIR = require("../../imgs/graphs/weekwinddir.png");
export const LOCAL_DAY_TEMP_DEW = require("../../imgs/graphs/daytempdew.png");
export const LOCAL_WEEK_TEMP_DEW = require("../../imgs/graphs/weektempdew.png");
export const LOCAL_DAY_BAROMETER = require("../../imgs/graphs/daybarometer.png");
export const LOCAL_WEEK_BAROMETER = require("../../imgs/graphs/weekbarometer.png");
export const LOCAL_DAY_RAIN = require("../../imgs/graphs/dayrain.png");
export const LOCAL_MONTH_RAIN = require("../../imgs/graphs/monthrain.png");

export const INITIAL_STATE = {
  selectedPage: 0,
  lastUpdated: null,
  weather: {
    "Time": "07-Nov-2017 12:35",
    "windSpeed": "30 knots",
    "windDir": "141&#176;",
    "windGust": "39 knots",
    "windGustDir": "143&#176;",
    "barometer": "1017.8 mbar",
    "outTemp": "17.2&#176;C",
    "outTempMin": "15.3&#176;C",
    "outTempMax": "17.3&#176;C",
    "rainDayTotal": "0.0 mm",
    "rainRateNow": "0.0 mm/hr",
    "rainMinRate": "0.0 mm/hr",
    "rainMaxRate": "0.0 mm/hr"
  },
  cacheBuster: null,
  refreshing: false,
};

const WEATHER_UPDATED = 'WEATHER_UPDATED';
const ERROR = 'ERROR';
const PAGE_SELECTED = 'PAGE_SELECTED';
const REFRESH_STARTED = 'REFRESH_STARTED';

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WEATHER_UPDATED: {
      // ignore blank weather
      if (!action.data) {
        return {
          ...state,
          refreshing: false,
        };
      }
      // otherwise update the weather
      return {
        ...state,
        lastUpdated: new Date().getTime(),
        weather: action.data,
        cacheBuster: action.data.Time,
        refreshing: false,
      };
    }
    case ERROR: {
      return {
        ...state,
        refreshing: false,
      };
    }
    case PAGE_SELECTED: {
      return {
        ...state,
        selectedPage: action.data,
      };
    }
    case REFRESH_STARTED: {
      return {
        ...state,
        refreshing: true,
      }
    }
  }

  return state;
};

export const fetchWeather = () => async (dispatch, getState) => {
  dispatch({type: REFRESH_STARTED});

  try {
    // check for updated weather
    // noinspection ES6ModulesDependencies
    const response = await fetch(`${WEATHER_API}`);

    dispatch({
      type: WEATHER_UPDATED,
      data: JSON.parse(response._bodyText),
    });
  }
  catch (error) {
    console.warn(`Error fetching weather ${error}`);

    dispatch({
      type: ERROR,
      error
    });
  }
};

export const onPageSelected = (selectedPage) => (dispatch, getState) => {
  console.log(`onPageSelected -> ${selectedPage}`);

  if (selectedPage === getState().selectedPage) {
    return;
  }

  dispatch({
    type: PAGE_SELECTED,
    data: selectedPage
  });
};
