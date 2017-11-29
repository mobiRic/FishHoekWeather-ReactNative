const BASE_URL = "http://www.fhbsc.co.za/weather/";
const WEATHER_API = BASE_URL + "smartphone/weather.json";
export const REMOTE_IMAGES = BASE_URL;

export const INITIAL_STATE = {
  selectedPage: 0,
  lastUpdated: null,
  weather: {
    "Time": "29-Nov-2017 13:10",
    "windSpeed": "25 knots",
    "windDir": "150&#176;",
    "windGust": "32 knots",
    "windGustDir": "145&#176;",
    "barometer": "1018.2 mbar",
    "outTemp": "19.5&#176;C",
    "outTempMin": "16.8&#176;C",
    "outTempMax": "19.6&#176;C",
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
