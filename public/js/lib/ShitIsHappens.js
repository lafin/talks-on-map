class ShitIsHappens {
  static translate(index) {
    const info = {
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
    const heatIndexValue = -42.379 +
        2.04901523 * temperature +
        10.14333127 * humidity +
        (-0.22475541) * temperature * humidity +
        (-6.83783e-3) * temperature * temperature +
        (-5.481717e-2) * humidity * humidity +
        1.22874e-3 * temperature * temperature * humidity +
        8.5282e-4 * temperature * humidity * humidity +
        (-1.99e-6) * temperature * temperature * humidity * humidity;

    let index = 0;
    if (heatIndexValue >= 27 || heatIndexValue < 32) {
      index = 1;
    } else if (heatIndexValue >= 32 || heatIndexValue < 41) {
      index = 2;
    } else if (heatIndexValue >= 41 || heatIndexValue < 54) {
      index = 3;
    } else if (heatIndexValue >= 54) {
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
    const weather = data.weather;
    const temperature = +weather.temperature;
    const heatIndex = this.heatIndex(temperature, weather.dampness);
    const levelIndex = this.levelIndex(data.level);
    const windIndex = this.windIndex(weather.wind);
    const accidentIndex = this.accidentIndex(data.population, data.accident);
    const dampnessIndex = this.dampnessIndex(weather.dampness);
    const shitIsHappensIndex = heatIndex + levelIndex + windIndex + accidentIndex + dampnessIndex;
    const round = (value) => {
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
