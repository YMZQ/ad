export function getDateTime(timestamp, format) {
    // var pad = function(val, len) {
    //     val = String(val);
    //     len = len || 2;
    //     while (val.length < len) val = '0' + val;
    //     return val;
    // };
    // var date = new Date(parseFloat(timestamp));
    // var year = date.getFullYear();
    // var month = pad(date.getMonth() + 1);
    // var day = pad(date.getDate());
    // var hour = pad(date.getHours());
    // var minutes = pad(date.getMinutes());
    // var second = pad(date.getSeconds());
    // switch (format) {
    //     case 'MM-DD HH:MM:SS':
    //         return [month, day].join('-') + ' ' + [hour, minutes, second].join(':');
    //         break;
    //     case 'YYYY-MM-DD HH:MM':
    //         return [year, month, day].join('-') + ' ' + [hour, minutes].join(':');
    //         break;
    //     case 'YYYY-MM-DD':
    //         return [year, month, day].join('-');
    //         break;
    //     case 'HH:MM:SS':
    //         return [hour, minutes, second].join(':');
    //         break;
    //     case 'HH:MM':
    //         return [hour, minutes].join(':');
    //         break;
    //     case 'array':
    //         return [year, month, day, hour, minutes, second];
    //         break;
    //     case 'YYYY-MM-DD HH:MM:SS':
    //         return [year, month, day].join('-') + ' ' + [hour, minutes, second].join(':');
    //         break;
    //     case 'YYYY年MM月DD日 HH时MM分':
    //         return year + '年' + month + '月' + day + '日' + ' ' + hour + '时' + minutes + '分';
    //         break;
    //     case 'full':
    //         return [year, month, day].join('-') + ' ' + [hour, minutes, second].join(':');
    //         break;
    //     default:
    //         return [month, day].join('-') + ' ' + [hour, minutes, second].join(':');
    //         break;
    // }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time);
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        return value.toString().padStart(2, '0');
    });
    return time_str;
}


/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000;
    } else {
        time = +time;
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前';
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前';
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        );
    }
}


/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

export function getFileType(filename) {
    const startIndex = filename.lastIndexOf('.')
    if (startIndex !== -1) {
        return filename.substring(startIndex + 1, filename.length).toLowerCase()
    } else {
        return ''
    }
}