class ShitIsHappens {
    static apparentTemperature(temperature, wind, humidity) {
        let e = (humidity / 100) * 6.105 * Math.exp((17.27 * temperature) / (237.7 + temperature));
        return temperature + 0.348 * e - 0.7 * wind - 4.25;
    }

    // https://en.wikipedia.org/wiki/Room_temperature
    static apparentTemperatureIndex(apparentTemp, temperature) {
        let index = 0;
        if (apparentTemp < 20 || apparentTemp > 26) {
            index = Math.abs(apparentTemp - temperature);
        }
        return index;
    }

    static levelIndex(index) {
        return index / 3;
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
        let apparentTemp = this.apparentTemperature(temperature, weather.wind, weather.dampness);
        let shitIsHappensIndex = this.apparentTemperatureIndex(apparentTemp, temperature) +
            this.levelIndex(data.level) +
            this.windIndex(weather.wind) +
            this.dampnessIndex(weather.dampness);
        shitIsHappensIndex = Math.round(shitIsHappensIndex * 100) / 100;
        return shitIsHappensIndex;
    }
}

export default ShitIsHappens;