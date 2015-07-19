class ShitIsHappens {
  static heatIndex(temperature, humidity) {
    return -42.379 +
        2.04901523 * temperature +
        10.14333127 * humidity +
        (-0.22475541) * temperature * humidity +
        (-6.83783e-3) * temperature * temperature +
        (-5.481717e-2) * humidity * humidity +
        1.22874e-3 * temperature * temperature * humidity +
        8.5282e-4 * temperature * humidity * humidity +
        (-1.99e-6) * temperature * temperature * humidity * humidity;
  }

  // https://en.wikipedia.org/wiki/Room_temperature
  static heatIndexIndex(heatIndex) {
    let index = 0;
    if (heatIndex >= 27 || heatIndex < 32) {
      index = 1;
    } else if (heatIndex >= 32 || heatIndex < 41) {
      index = 2;
    } else if (heatIndex >= 41 || heatIndex < 54) {
      index = 3;
    } else if (heatIndex >= 54) {
      index = 4;
    }

    return index;
  }

  static levelIndex(index) {
    return index / 3;
  }

  static accidentIndex(population, accident) {
    return (accident / population) * 1e5;
  }

  // http://www.ara.bme.hu/oktatas/tantargy/NEPTUN/BMEGEATMKK2+MKK4/2014-2015-I/ea/WIND%20COMFORT%20STUDIES.pdf
  static windIndex(wind) {
    let index = 0;
    if (wind >= 0 && wind < 1) {
      index = 1;
    } else if (wind >= 1 && wind < 2.5) {
      index = 0;
    } else if (wind >= 2.5) {
      index = (wind - 2.5) / 1.5 + 1;
    }

    return index;
  }

  // http://cdn2.hubspot.net/hub/88935/file-15972568-jpg/images/relative-humidity-chart-4-factors-of-comfort.jpg?t=1435846677413
  static dampnessIndex(dampness) {
    let index = 0;
    if (dampness >= 0 && dampness < 20 || dampness >= 80 && dampness <= 100) {
      index = 2;
    } else if (dampness >= 20 && dampness < 40 || dampness >= 60 && dampness < 80) {
      index = 1;
    }

    return index;
  }

  static calculate(data) {
    let weather = data.weather;
    let temperature = +weather.temperature;
    let heatIndex = this.heatIndex(temperature, weather.dampness);
    let shitIsHappensIndex = this.heatIndexIndex(heatIndex) +
        this.levelIndex(data.level) +
        this.windIndex(weather.wind) +
        this.accidentIndex(data.population, data.accident) +
        this.dampnessIndex(weather.dampness);
    shitIsHappensIndex = Math.round(shitIsHappensIndex * 100) / 100;
    return shitIsHappensIndex;
  }
}

export default ShitIsHappens;
