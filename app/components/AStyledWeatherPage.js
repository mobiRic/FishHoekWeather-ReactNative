import React, {Component} from 'react';
import {
  DAY_BAROMETER, DAY_RAIN,
  DAY_TEMP_DEW,
  DAY_WIND, DAY_WIND_DIR, LOCAL_DAY_BAROMETER, LOCAL_DAY_RAIN, LOCAL_DAY_TEMP_DEW, LOCAL_DAY_WIND, LOCAL_DAY_WIND_DIR,
  LOCAL_IMAGES, LOCAL_MONTH_RAIN,
  LOCAL_WEEK_BAROMETER,
  LOCAL_WEEK_TEMP_DEW,
  LOCAL_WEEK_WIND,
  LOCAL_WEEK_WIND_DIR, MONTH_RAIN, WEEK_BAROMETER, WEEK_TEMP_DEW,
  WEEK_WIND, WEEK_WIND_DIR
} from "../redux/DataStore";

/**
 * Base class for each weather page.
 *
 * Contains code and styles common to all pages.
 */
export default class AStyledWeatherPage extends Component {

  constructor() {
    super();

    this._assertFunctionImplemented("_onWeatherUpdated");
  }

  /**
   * Checks that a given function exists in subclasses. Throws a critical error if the function is not found.
   * @param requiredFunctionName String giving the name of the required function to check
   * @private
   */
  _assertFunctionImplemented(requiredFunctionName) {
    const theFunction = eval(`this.${requiredFunctionName}`);
    if (typeof theFunction !== 'function') {
      throw new ReferenceError(`${this.constructor.name} must implement function ${requiredFunctionName}() when extending AStyledWeatherPage.`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.weather) {
      this._onWeatherUpdated(nextProps.weather);
    }
  }

  /**
   * Determines the correct, refreshed image for a given image name. This takes into account if the app has ever
   * downloaded any weather yet, and also includes a timestamp into the URL to enable the image cache to be updated.
   * @param imageName Base name of the image
   */
  getImage(imageName) {
    return this._getLocalImage(imageName);
  }

  _getLocalImage(imageName) {
    switch (imageName) {
      case DAY_WIND: {
        return LOCAL_DAY_WIND;
      }
      case DAY_WIND_DIR: {
        return LOCAL_DAY_WIND_DIR;
      }
      case WEEK_WIND: {
        return LOCAL_WEEK_WIND;
      }
      case WEEK_WIND_DIR: {
        return LOCAL_WEEK_WIND_DIR;
      }
      case DAY_TEMP_DEW: {
        return LOCAL_DAY_TEMP_DEW;
      }
      case WEEK_TEMP_DEW: {
        return LOCAL_WEEK_TEMP_DEW;
      }
      case DAY_BAROMETER: {
        return LOCAL_DAY_BAROMETER;
      }
      case WEEK_BAROMETER: {
        return LOCAL_WEEK_BAROMETER;
      }
      case DAY_RAIN: {
        return LOCAL_DAY_RAIN;
      }
      case MONTH_RAIN: {
        return LOCAL_MONTH_RAIN;
      }
    }
  }

  _getRemoteImage(imageName) {
  }

};

export const SharedWeatherPageStyles = {
  pageContainer: {
    alignItems: 'center',
    paddingTop: 38,
    paddingBottom: 16,
  },
  widget: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  graph: {
    flex: 1,
    resizeMode: 'contain',
  },
};
