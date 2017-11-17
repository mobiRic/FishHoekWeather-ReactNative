import React, {Component} from 'react';

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
