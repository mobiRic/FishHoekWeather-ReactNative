const BASE_URL = "http://www.fhbsc.co.za/weather/";
const HOME_PAGE = BASE_URL + "smartphone/index.html";
const DAY_WIND = BASE_URL + "daywind.png";
const DAY_WIND_DIR = BASE_URL + "daywinddir.png";
const WEEK_WIND = BASE_URL + "weekwind.png";
const WEEK_WIND_DIR = BASE_URL + "weekwinddir.png";
const DAY_TEMP_DEW = BASE_URL + "daytempdew.png";
const WEEK_TEMP_DEW = BASE_URL + "weektempdew.png";
const DAY_BAROMETER = BASE_URL + "daybarometer.png";
const WEEK_BAROMETER = BASE_URL + "weekbarometer.png";
const DAY_RAIN = BASE_URL + "dayrain.png";
const MONTH_RAIN = BASE_URL + "monthrain.png";


const TAG_WEATHER_START = '<!-- FHBSC-JSON ';
const TAG_WEATHER_END = '} -->';

export const INITIAL_STATE = {
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
};

const WEATHER_UPDATED = 'WEATHER_UPDATED';
const ERROR = 'ERROR';

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WEATHER_UPDATED: {
      // ignore blank weather
      if (!action.data) {
        return state;
      }
      // otherwise update the weather
      return {
        ...state,
        lastUpdated: new Date().getTime(),
        weather: action.data,
        cacheBuster: action.data.Time,
      };
    }
    case ERROR: {
      return state;
    }
  }

  return state;
};

export const fetchWeather = () => async (dispatch, getState) => {
  try {
    // check for updated weather
    // noinspection ES6ModulesDependencies
    const response = await fetch(`${HOME_PAGE}`);

    // extract the JSON
    const n = response._bodyText.indexOf(TAG_WEATHER_START) + TAG_WEATHER_START.length;
    const m = response._bodyText.indexOf(TAG_WEATHER_END, n) + 1;
    const json = response._bodyText.substring(n, m);

    dispatch({
      type: WEATHER_UPDATED,
      data: JSON.parse(json),
    });

    // load new images if the weather has been updated
    // if (getState().next.length < PREFETCH_IMAGES) {
    //   dispatch(fetchImage());
    // }
  }
  catch (error) {
    console.log(`Error fetching weather ${error}`);

    dispatch({
      type: ERROR,
      error
    })
  }
};
