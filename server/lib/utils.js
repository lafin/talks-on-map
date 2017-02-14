
module.exports = {
  timeDecode: (str) => {
    let ts = Math.round(Date.now() / 1000);
    const day = 86400;
    const min = 60;
    let match;
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
        match = str.match(/(\d+)\s(минут|час)/);
        if (match && match.length === 3) {
          switch (match[2]) {
            case 'минут':
              ts -= match[1] * 1 * min;
              break;
            case 'час':
              ts -= match[1] * 60 * min;
              break;
            default:
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
