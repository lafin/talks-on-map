import React from 'react';

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.width = this.props.width || 600;
    this.height = this.props.height || 400;
  }

  componentDidMount() {
    this.init();
  }

  init() {
    let share = document.querySelectorAll('.share');
    for (let i = 0; i < share.length; i++) {
      this.title = share[i].getAttribute('data-title');
      let url = share[i].getAttribute('data-url') || location.href;
      let desc = share[i].getAttribute('data-desc') || '';
      let el = share[i].querySelectorAll('a');

      for (let j = 0; j < el.length; j++) {
        let id = el[j].getAttribute('data-id');
        if (id) {
          this.addEventListener(el[j], 'click', {
            id: id,
            url: url,
            title: this.title,
            desc: desc
          });
        }
      }
    }
  }

  addEventListener(el, eventName, opt) {
    if (el.addEventListener) {
      el.addEventListener(eventName, this.share.bind(this, opt.id, opt.url, opt.title, opt.desc));
    } else {
      el.attachEvent('on' + eventName, this.share.bind(this, opt.id, opt.url, opt.title, opt.desc));
    }
  }

  share(id, url, title, desc) {
    url = encodeURIComponent(url);
    desc = encodeURIComponent(desc);
    title = encodeURIComponent(title);

    let text;
    let width = +this.width;
    let height = +this.height;
    switch (id) {
      case 'fb':
        this.popupCenter('https://www.facebook.com/sharer/sharer.php?u=' + url, this.title, width, height);
        break;

      case 'vk':
        this.popupCenter('https://vk.com/share.php?url=' + url + '&description=' + title + '. ' + desc, this.title, width, height);
        break;

      case 'tw':
        text = title || desc || '';
        if (title.length > 0 && desc.length > 0) {
          text = title + ' - ' + desc;
        }

        if (text.length > 0) {
          text = '&text=' + text;
        }

        this.popupCenter('https://twitter.com/intent/tweet?url=' + url + text, this.title, width, height);
        break;

      case 'gp':
        this.popupCenter('https://plus.google.com/share?url=' + url, this.title, width, height);
        break;

      case 'in':
        this.popupCenter('https://www.linkedin.com/shareArticle?mini=true&url=' + url, this.title, width, height);
        break;

      case 'mail':
        text = title || desc || '';
        if (title.length > 0 && desc.length > 0) {
          text = title + ' - ' + desc;
        }

        if (text.length > 0) {
          text = text + ' / ';
        }

        if (title.length > 0) {
          title = title + ' / ';
        }

        let mail = 'mailto:?Subject=' + title + this.title + '&body=' + text + url;
        this.newTab(mail);
        break;

      default:
        break;
    }
  }

  newTab(url) {
    window.open(url, '_blank').focus();
  }

  popupCenter(url, title, w, h) {
    let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    let dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
    let el = document.documentElement;
    let width = window.innerWidth || (el.clientWidth ? el.clientWidth : screen.width);
    let height = window.innerHeight || (el.clientHeight ? el.clientHeight : screen.height);
    let left = ((width / 2) - (w / 2)) + dualScreenLeft;
    let top = ((height / 3) - (h / 3)) + dualScreenTop;
    let newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    if (window.focus) {
      newWindow.focus();
    }
  }

  render() {
    return (
    <div data-url={this.props.url} data-title={this.props.title} data-desc={this.props.desc} role="group" className="btn-group btn-group-sm share">

      {this.props.to.map((site, key) => {
        return <a key={key} className={'btn btn-default btn-sm btn-' + site} data-id={site}><i className={'icon-' + site}></i></a>;
      })}

    </div>
    );
  }
}

export default Share;
