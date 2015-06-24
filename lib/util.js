module.exports = {
    timeDecode: function (str) {
        var ts = Date.now() / 1000 | 0,
            day = 86400,
            min = 60;
        str = str.replace(' назад', '');
        switch (str) {
        case 'больше дня':
            ts -= 1.5 * day;
            break;
        case 'день':
            ts -= 1 * day;
            break;
        case 'полдня':
            ts -= 0.5 * day;
            break;
        case 'час':
            ts -= 60 * min;
            break;
        case 'минуту':
            ts -= 1 * min;
            break;
        default:
            var match = str.match(/(\d+)\s(минут|час)/);
            if (match && match.length === 3) {
                switch (match[2]) {
                case 'минут':
                    ts -= match[1] * 1 * min;
                    break;
                case 'час':
                    ts -= match[1] * 60 * min;
                    break;
                }
            } else {
                ts = null;
            }
            break;
        }
        return ts;
    }
};