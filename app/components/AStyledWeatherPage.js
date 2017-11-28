import React, {Component} from 'react';
import {RefreshControl} from 'react-native';
import * as Images from '../Images';
import {REMOTE_IMAGES} from "../redux/DataStore";

/**
 * Base class for each weather page.
 *
 * Contains code and styles common to all pages.
 */
export default class AStyledWeatherPage extends Component {

  ANIMATION_DURATION = 300;

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

  componentWillMount() {
    if (this.props.weather) {
      this._handleWeatherUpdated(this.props.weather);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.weather) {
      this._handleWeatherUpdated(nextProps.weather);
    }
  }

  _handleWeatherUpdated(weather) {
    this._onWeatherUpdated(weather);
  }

  _getRefreshControl() {
    return (
      <RefreshControl
        refreshing={this.props.refreshing}
        onRefresh={this._onRefresh.bind(this)}
      />
    );
  }

  _onRefresh() {
    this.props.actions.fetchWeather();
  }

  /**
   * Determines the correct, refreshed image for a given image name. This takes into account if the app has ever
   * downloaded any weather yet, and also includes a timestamp into the URL to enable the image cache to be updated.
   * @param imageName Base name of the image
   */
  getImage(imageName) {
    if (!this.props.lastUpdated) {
      return this._getLocalImage(imageName);
    } else {
      return this._getRemoteImage(imageName, this.props.cacheBuster);
    }
  }

  _getLocalImage(imageName) {
    switch (imageName) {
      case Images.DAY_WIND: {
        return Images.LOCAL_DAY_WIND;
      }
      case Images.DAY_WIND_DIR: {
        return Images.LOCAL_DAY_WIND_DIR;
      }
      case Images.WEEK_WIND: {
        return Images.LOCAL_WEEK_WIND;
      }
      case Images.WEEK_WIND_DIR: {
        return Images.LOCAL_WEEK_WIND_DIR;
      }
      case Images.DAY_TEMP_DEW: {
        return Images.LOCAL_DAY_TEMP_DEW;
      }
      case Images.WEEK_TEMP_DEW: {
        return Images.LOCAL_WEEK_TEMP_DEW;
      }
      case Images.DAY_BAROMETER: {
        return Images.LOCAL_DAY_BAROMETER;
      }
      case Images.WEEK_BAROMETER: {
        return Images.LOCAL_WEEK_BAROMETER;
      }
      case Images.DAY_RAIN: {
        return Images.LOCAL_DAY_RAIN;
      }
      case Images.MONTH_RAIN: {
        return Images.LOCAL_MONTH_RAIN;
      }
    }
  }

  _getRemoteImage(imageName, cacheBuster) {
    const uri = REMOTE_IMAGES + imageName + '?cacheBuster=' + cacheBuster;
    return {
      uri: uri,
      cache: 'force-cache',
    };
  }

};

export const SharedWeatherPageStyles = {
  pageContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  widget: {
    width: 200,
    height: 200,
  },
  graph: {
    width: 300,
    height: 180,
    resizeMode: 'contain',
  },
};
