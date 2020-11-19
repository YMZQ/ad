export { parseTime, formatTime } from '@/utils';

/**
 * 开启关闭
 * 1
 * 0
 * */
const statusFilter = (value) => {
    switch (value) {
        case 1:
            return '是';
            break;
        case 0:
            return '否';
            break;
        case '1':
            return '是';
            break;
        case '0':
            return '否';
            break;
        default:
            '';
    }
};

/**
 *语言
 * */
const langFilter = (value) => {
    switch (value) {
        case 'cn':
            return '中文';
            break;
        case 'en':
            return '英文';
            break;
        default:
            '中文';
    }
};

/**
 *实名状态
 * */
const toStatus = (value) => {
    switch (value) {
        case 0:
            return '未实名';
            break;
        case 1:
            return '未实名';
            break;
        case 2:
            return '已实名';
            break;
        case 3:
            return '审核不通过';
            break;
        default:
            '';
    }
};

/**
 *
 * */

const toTime = (timestamp, format = 'YYYY-MM-DD HH:MM:SS') => {
    var pad = function(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = '0' + val;
        return val;
    };
    var date = new Date(parseFloat(timestamp));
    var year = date.getFullYear();
    var month = pad(date.getMonth() + 1);
    var day = pad(date.getDate());
    var hour = pad(date.getHours());
    var minutes = pad(date.getMinutes());
    var second = pad(date.getSeconds());
    switch (format) {
        case 'MM-DD HH:MM:SS':
            return [month, day].join('-') + ' ' + [hour, minutes, second].join(':');
            break;
        case 'YYYY-MM-DD HH:MM':
            return [year, month, day].join('-') + ' ' + [hour, minutes].join(':');
            break;
        case 'YYYY-MM-DD':
            return [year, month, day].join('-');
            break;
        case 'HH:MM:SS':
            return [hour, minutes, second].join(':');
            break;
        case 'HH:MM':
            return [hour, minutes].join(':');
            break;
        case 'array':
            return [year, month, day, hour, minutes, second];
            break;
        case 'YYYY-MM-DD HH:MM:SS':
            return [year, month, day].join('-') + ' ' + [hour, minutes, second].join(':');
            break;
        case 'YYYY年MM月DD日 HH时MM分':
            return year + '年' + month + '月' + day + '日' + ' ' + hour + '时' + minutes + '分';
            break;
        case 'full':
            return [year, month, day].join('-') + ' ' + [hour, minutes, second].join(':');
            break;
        default:
            return [month, day].join('-') + ' ' + [hour, minutes, second].join(':');
            break;
    }
};


export { statusFilter, toTime, langFilter ,toStatus};