class ShitIsHappens {
  static translate(index) {
    let info = {
      heatIndex: {
        text: 'Индекс теплоты',
        link: 'https://en.wikipedia.org/wiki/Heat_index'
      },
      levelIndex: {
        text: 'Уровень пробок',
        link: ''
      },
      windIndex: {
        text: 'Сила ветра',
        link: 'http://www.ara.bme.hu/oktatas/tantargy/NEPTUN/BMEGEATMKK2+MKK4/2014-2015-I/ea/WIND%20COMFORT%20STUDIES.pdf'
      },
      accidentIndex: {
        text: 'Колличество ДТП',
        link: ''
      },
      dampnessIndex: {
        text: 'Уровень влажности',
        link: 'http://cdn2.hubspot.net/hub/88935/file-15972568-jpg/images/relative-humidity-chart-4-factors-of-comfort.jpg'
      }
    };

    return info[index];
  }

  static heatIndex(temperature, humidity) {
    let heatIndex = -42.379 +
        2.04901523 * temperature +
        10.14333127 * humidity +
        (-0.22475541) * temperature * humidity +
        (-6.83783e-3) * temperature * temperature +
        (-5.481717e-2) * humidity * humidity +
        1.22874e-3 * temperature * temperature * humidity +
        8.5282e-4 * temperature * humidity * humidity +
        (-1.99e-6) * temperature * temperature * humidity * humidity;

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
    let levelIndex = this.levelIndex(data.level);
    let windIndex = this.windIndex(weather.wind);
    let accidentIndex = this.accidentIndex(data.population, data.accident);
    let dampnessIndex = this.dampnessIndex(weather.dampness);
    let shitIsHappensIndex = heatIndex + levelIndex + windIndex + accidentIndex + dampnessIndex;
    let round = (value) => {
      return Math.round(value * 100) / 100;
    };

    return {
      shitIsHappensIndex: round(shitIsHappensIndex),
      heatIndex: round(heatIndex),
      levelIndex: round(levelIndex),
      windIndex: round(windIndex),
      accidentIndex: round(accidentIndex),
      dampnessIndex: round(dampnessIndex)
    };
  }
}

export default ShitIsHappens;
