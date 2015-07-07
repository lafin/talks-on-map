import React from 'react';
import Share from './Share.jsx';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
        this.infoStore = React.stores.info;
        this.infoAction = React.actions.info;
        this.state.city = this.infoAction.getCity();
    }

    componentDidMount() {
        this.infoStore.on('update', this.onChange, this);
    }

    componentWillUnmount() {
        this.infoStore.off('update', this.onChange, this);
    }

    onChange(values) {
        let state = {};
        if (values.hasOwnProperty('accident')) {
            state.accident = values.accident;
        } else {
            state = {
                level: values.level,
                time: values.time,
                online: values.online
            };
        }
        this.setState(state);
    }

    onChangeCity(el) {
        el = el.target;
        let value = el.options[el.selectedIndex].value;
        this.infoAction.emit('city:select', value);
    }

    render() {
        let state = this.state;
        return (
            <div className="footer">
                <div className="container">
                    <div className="text-muted">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <span className="element hidden-md hidden-xs hidden-sm">Hello, I am <a href="http://lafin.me/">lafin</a></span>
                            <span className="element">
                                <Share
                                    url="http://map.lafin.me"
                                    height="400"
                                    width="600"
                                    title="Карта, с дорожными событиями города"
                                    desc=""
                                    to={['vk','tw','fb']}/>
                            </span>
                            <span className="element hidden-sm hidden-xs">
                                <div className="btn-group btn-group-sm" role="group">
                                    <a href="#/" className="btn btn-sm btn-default">
                                        <i className="glyphicon glyphicon-home" aria-hidden="true"></i> Главная
                                    </a>
                                    <a href="#/stats" className="btn btn-sm btn-default">
                                        <i className="glyphicon glyphicon-stats" aria-hidden="true"></i> Графики
                                    </a>
                                </div>
                            </span>
                        </div>
                        <div className="col-lg-4 hidden-md hidden-xs hidden-sm"></div>
                        <div className="col-lg-6 col-md-6 col-sm-6 hidden-xs">
                            <span className="right city">
                                <select className="form-control" onChange={this.onChangeCity.bind(this)} defaultValue={state.city}>
                                    {state.cities.map(function(city, key) {
                                        return <option key={key}>{city}</option>;
                                    })}
                                </select>
                            </span>
                            <span className="right element hidden-xs hidden-sm">
                                Баллы: <span id="level">{state.level}</span>
                            </span>
                            <span className="right element hidden-xs hidden-sm">
                                Время: <span id="time">{state.time}</span>
                            </span>
                            <span className="right element hide hidden-xs hidden-sm">
                                Online: <span id="online">{state.online}</span>
                            </span>
                            <span className="right element hidden-xs hidden-sm">
                                ДТП: <span id="accident">{state.accident}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Footer.defaultProps = {
    cities: ['Москва', 'Санкт-Петербург', 'Ростов-на-Дону', 'Новосибирск',
        'Екатеринбург', 'Нижний Новгород', 'Казань', 'Самара',
        'Челябинск', 'Омск', 'Уфа', 'Красноярск',
        'Пермь', 'Волгоград', 'Воронеж', 'Саратов', 'Краснодар'
    ],
    city: 'Москва',
    level: '--',
    time: '--',
    online: '--',
    accident: '--'
};

export default Footer;