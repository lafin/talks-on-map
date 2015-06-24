/* global d3, JSON */
import React from 'react';

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    createChart(name, data) {
        if(!data) {
            return;
        }
        let margin = {
                top: 15,
                right: 15,
                bottom: 30,
                left: 30
            },
            width = 940 - margin.left - margin.right,
            height = 180 - margin.top - margin.bottom;

        let x = d3.time.scale()
            .range([0, width]);

        let y = d3.scale.linear()
            .range([height, 0]);

        let xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        let line = d3.svg.line()
            .x((d) => {
                return x(d.date);
            })
            .y((d) => {
                return y(d[name]);
            });

        let datum = [];
        for(let i in data) {
            if(data.hasOwnProperty(i)) {
                let d = data[i];
                d.date = new Date(d.date);
                datum.push(d);                
            }
        }

        x.domain(d3.extent(datum, (d) => {
            return d.date;
        }));
        y.domain(d3.extent(datum, (d) => {
            return d[name];
        }));

        let container = d3.select('#' + name);
        container.select('svg').remove();
        let svg = container.append('svg');

        svg.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '5px')
            .style('text-anchor', 'end')
            .text(name);

        svg.append('path')
            .datum(datum)
            .attr('class', 'line')
            .attr('d', line);
    }

    render() {
        this.createChart(this.props.name, this.props.data);
        return (
            <div id={this.props.name}></div>
        );
    }
}

class Info extends React.Component {
    constructor(props) {
        super(props);
    }

    apparentTemperature(temperature, wind, humidity) {
        let e = (humidity / 100) * 6.105 * Math.exp((17.27 * temperature) / (237.7 + temperature));
        return temperature + 0.348 * e - 0.7 * wind - 4.25;
    }

    render() {
        var info = this.props.data;
        let reallyTemperature = null;
        let weather = null;
        if (info) {
            let lastKey = Object.keys(info).slice(-1)[0];
            info = info[lastKey];
            weather = info.weather;
            reallyTemperature = this.apparentTemperature(+weather.temperature, weather.wind, weather.dampness);
        }
        return (
            <div>{reallyTemperature} {JSON.stringify(weather)}</div>
        );
    }
}

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.statsStore = React.stores.stats;
        this.statsAction = React.actions.stats;
        this.infoAction = React.actions.info;
        this.statsAction.getStats(this.infoAction.getCity());
        this.infoAction.on('city:select', (city) => {
            this.statsAction.getStats(city);
        });
    }

    componentDidMount() {
        this.statsStore.on('update', this.onChange, this);
    }

    componentWillUnmount() {
        this.statsStore.off('update', this.onChange, this);
    }

    onChange(values) {
        this.setState(values);
    }

    render() {
        let state = this.state;
        return (
            <div className="mask">
                <div className="reveal-modal">
                    <p className="lead">Статистика</p>
                    <div className="row">
                        <div className="col-md-6">
                            {['accident','level'].map((type) => {
                                return <Chart name={type} data={state} />;
                            })}
                        </div>
                        <div className="col-md-6">
                            <Info data={state} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Stats;
