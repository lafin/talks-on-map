class Share {
    constructor(title = '', width = 600, height = 400) {
        this.title = title;
        this.width = width;
        this.height = height;
    }

    init() {
        let share = document.querySelectorAll('.share');
        for (let i = 0, l = share.length; i < l; i++) {
            this.title = share[i].getAttribute('data-title');
            let url = share[i].getAttribute('data-url') || location.href,
                desc = share[i].getAttribute('data-desc') || '',
                el = share[i].querySelectorAll('a');

            for (let j = 0, j < el.length; j++) {
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
        switch (id) {
            case 'fb':
                this.popupCenter('https://www.facebook.com/sharer/sharer.php?u=' + url, this.title, this.width, this.height);
                break;

            case 'vk':
                this.popupCenter('https://vk.com/share.php?url=' + url + '&description=' + title + '. ' + desc, this.title, this.width, this.height);
                break;

            case 'tw':
                text = title || desc || '';
                if (title.length > 0 && desc.length > 0) {
                    text = title + ' - ' + desc;
                }
                if (text.length > 0) {
                    text = '&text=' + text;
                }
                this.popupCenter('https://twitter.com/intent/tweet?url=' + url + text, this.title, this.width, this.height);
                break;

            case 'gp':
                this.popupCenter('https://plus.google.com/share?url=' + url, this.title, this.width, this.height);
                break;

            case 'in':
                this.popupCenter('https://www.linkedin.com/shareArticle?mini=true&url=' + url, this.title, this.width, this.height);
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
        let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left,
            dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top,
            el = document.documentElement,
            width = window.innerWidth ? window.innerWidth : el.clientWidth ? el.clientWidth : screen.width,
            height = window.innerHeight ? window.innerHeight : el.clientHeight ? el.clientHeight : screen.height,
            left = ((width / 2) - (w / 2)) + dualScreenLeft,
            top = ((height / 3) - (h / 3)) + dualScreenTop,
            newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        if (window.focus) {
            newWindow.focus();
        }
    }
}

export default Share;