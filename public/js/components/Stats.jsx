/* global d3 */
import React from 'react';
import ShitIsHappens from '../lib/ShitIsHappens';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.margin = 30;
    this.name = props.name;
    this.data = props.data;
    this.statsStore = React.stores.stats;
  }

  parseData(data) {
    let datum = [];
    if (data) {
      for (let i in data) {
        if (data.hasOwnProperty(i)) {
          let d = data[i];
          d.date = new Date(d.date);
          d[this.name] = +d[this.name];
          datum.push(d);
        }
      }
    }

    return datum;
  }

  onChange(values) {
    this.data = values;
    this.clean();
    this.updateData();
  }

  componentDidMount() {
    d3.select(window).on('resize.' + this.name, this.update.bind(this));
    this.statsStore.on('update', this.onChange, this);
  }

  componentWillUnmount() {
    d3.select(window).on('resize.' + this.name, null);
    this.statsStore.off('update', this.onChange, this);
  }

  clean() {
    if (this.graph) {
      this.graph.select('.x.axis').remove();
      this.graph.select('.y.axis').remove();
      this.graph.selectAll('.line').remove();
    }
  }

  update() {
    let margin = this.margin;
    let xAxis = this.xAxis;
    let yAxis = this.yAxis;
    let graph = this.graph;

    let selector = d3.select('#' + this.name);
    let width = parseInt(selector.style('width'), 10) - margin * 2;
    let height = parseInt(selector.style('height'), 10) - margin * 2;

    this.xScale.range([0, width]);
    this.yScale.range([height, 0]);

    graph.attr('width', width + margin * 2)
      .attr('height', height + margin * 2);

    graph.select('.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    graph.select('.y.axis')
      .call(yAxis);

    this.updateData();
  }

  updateData() {
    if (this.graph && this.data) {
      this.graph.selectAll('.line')
      .datum(this.parseData(this.data))
      .attr('d', this.line);
    }
  }

  create(data) {
    if (!data) {
      return;
    } else if (this.graph) {
      this.update();
    }

    let margin = this.margin;
    let datum = this.parseData(data);
    let selector = d3.select('#' + this.name);
    let width = parseInt(selector.style('width'), 10) - margin * 2;
    let height = parseInt(selector.style('height'), 10) - margin * 2;

    let xScale = d3.time.scale()
      .range([0, width]);

    let yScale = d3.scale.linear()
      .range([height, 0]);

    let xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

    let yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

    let line = d3.svg.line()
      .x((d) => {
        return xScale(d.date);
      })
      .y((d) => {
        return yScale(d[this.name]);
      });

    let graph = d3.select('#' + this.name)
      .attr('width', width + margin * 2)
      .attr('height', height + margin * 2)
      .append('g')
      .attr('transform', 'translate(' + margin + ',' + margin + ')');

    xScale.domain(d3.extent(datum, (d) => {
      return d.date;
    }));

    yScale.domain(d3.extent(datum, (d) => {
      return d[this.name];
    }));

    graph.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    graph.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(this.name);

    graph.append('path')
      .datum(datum)
      .attr('class', 'line')
      .attr('d', line);

    this.line = line;
    this.xScale = xScale;
    this.yScale = yScale;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.graph = graph;
  }

  render() {
    this.create(this.data);
    return (
      <svg id={this.name}></svg>
    );
  }
}

class Info extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let data = this.props.data;
    let indexes = {};
    if (data) {
      for (let i in data) {
        if (data.hasOwnProperty(i)) {
          let d = data[i];
          let indexes = ShitIsHappens.calculate(d);
          d.index = indexes.shitIsHappensIndex;
          d.indexes = indexes;
        }
      }

      let lastKey = Object.keys(data).slice(-1)[0];
      indexes = data[lastKey].indexes;
    }

    return (
      <div>
        <div>Индекс паршивости (на текуший момент): <b>{indexes.shitIsHappensIndex}</b></div>
        <div className="chart">
          <Chart name="index" data={data} />
        </div>
        {['heatIndex', 'levelIndex', 'windIndex', 'accidentIndex', 'dampnessIndex'].map((type, key) => {
          let info = ShitIsHappens.translate(type);
          if (indexes[type] > 0) {
            return <div key={key}>{info.text}: +{indexes[type]}</div>;
          }
        })}
      </div>
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
    let data = this.state;
    return (
      <div className="mask">
        <div className="reveal-modal">
          <p className="lead">Статистика</p>
          <div className="row stats">
            <div className="col-md-6 chart">
              {['accident', 'level'].map((type, key) => {
                return <Chart key={key} name={type} data={data} />;
              })}
            </div>
            <div className="col-md-6">
              <Info data={data} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Stats;
