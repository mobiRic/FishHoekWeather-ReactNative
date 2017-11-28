// weather gauges
import Asset from "expo/src/Asset";

export const WIND_GAUGE = require('../imgs/widgets/windrose.png');
export const WIND_ARROW = require('../imgs/widgets/arrow_wind_direction.png');
export const THERMOMETER = require('../imgs/widgets/thermometer.png');
export const BAROMETER = require('../imgs/widgets/barometer.png');
export const BAROMETER_ARROW = require('../imgs/widgets/arrow_barometer.png');
export const RAIN_GAUGE = require('../imgs/widgets/raindrop.png');

// default graphs
export const LOCAL_DAY_WIND = require("../imgs/graphs/daywind.png");
export const LOCAL_DAY_WIND_DIR = require("../imgs/graphs/daywinddir.png");
export const LOCAL_WEEK_WIND = require("../imgs/graphs/weekwind.png");
export const LOCAL_WEEK_WIND_DIR = require("../imgs/graphs/weekwinddir.png");
export const LOCAL_DAY_TEMP_DEW = require("../imgs/graphs/daytempdew.png");
export const LOCAL_WEEK_TEMP_DEW = require("../imgs/graphs/weektempdew.png");
export const LOCAL_DAY_BAROMETER = require("../imgs/graphs/daybarometer.png");
export const LOCAL_WEEK_BAROMETER = require("../imgs/graphs/weekbarometer.png");
export const LOCAL_DAY_RAIN = require("../imgs/graphs/dayrain.png");
export const LOCAL_MONTH_RAIN = require("../imgs/graphs/monthrain.png");

// online graphs
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


function _cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export async function loadAssetsAsync() {
  const imageAssets = _cacheImages([
    WIND_GAUGE,
    WIND_ARROW,
    THERMOMETER,
    BAROMETER,
    BAROMETER_ARROW,
    RAIN_GAUGE,
    LOCAL_DAY_WIND,
    LOCAL_DAY_WIND_DIR,
    LOCAL_WEEK_WIND,
    LOCAL_WEEK_WIND_DIR,
    LOCAL_DAY_TEMP_DEW,
    LOCAL_WEEK_TEMP_DEW,
    LOCAL_DAY_BAROMETER,
    LOCAL_WEEK_BAROMETER,
    LOCAL_DAY_RAIN,
    LOCAL_MONTH_RAIN,
  ]);

  await Promise.all([...imageAssets]);
}