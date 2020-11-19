import { parseTime } from './index';

export default {
    Capitalization: (item) => { /**转为大写*/
        return item ? item.toLocaleUpperCase() : item;
    },
    getDateTime: (timestamp, format) => {
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
    },
    route: [{
        path: '/jurisdiction',
        meta: {
            icon: 'el-icon-user-solid',
            title: '权限管理'
        },
        children: [
            {
                component: 'jurisdiction/user/index',
                meta: { breadcrumb: true, icon: '', title: '用户管理' },
                path: '/jurisdiction/user'
            },
            {
                component: 'jurisdiction/role/index',
                meta: { breadcrumb: true, icon: '', title: '角色管理' },
                path: '/jurisdiction/role'
            },
            {
                component: 'jurisdiction/menu/index',
                meta: { breadcrumb: true, icon: '', title: '菜单管理' },
                path: '/jurisdiction/menu'
            }
        ]
    }, {
        path: '/filling',
        meta: {
            icon: 'el-icon-wallet',
            title: '财务管理'
        },
        children: [
            {
                component: 'filling/rechargeRecord/index',
                meta: { breadcrumb: true, icon: '', title: '充值记录' },
                path: '/filling/rechargeRecord'
            },
            {
                component: 'filling/withdrawalAudit/index',
                meta: { breadcrumb: true, icon: '', title: '提币审核' },
                path: '/filling/withdrawalAudit'
            },
            {
                component: 'filling/transfer/index',
                meta: { breadcrumb: true, icon: '', title: '转账记录' },
                path: '/filling/transfer'
            }
            // {
            //     component: 'filling/withdrawalRate/index',
            //     meta: { breadcrumb: true, icon: '', title: '参数设置' },
            //     path: '/filling/withdrawalRate'
            // }
        ]
    }, {
        path: '/content',
        meta: {
            icon: 'el-icon-mobile-phone',
            title: '内容管理'
        },
        children: [
            {
                component: 'content/app/index',
                meta: { breadcrumb: true, icon: '', title: 'app管理' },
                path: '/content/app'
            },
            {
                component: 'content/banner/index',
                meta: { breadcrumb: true, icon: '', title: '轮播管理' },
                path: '/content/banner'
            },
            {
                component: 'content/articleList/index',
                meta: { breadcrumb: true, icon: '', title: '文章列表' },
                path: '/content/articleList'
            }
        ]
    },
        //     {
        //     path: '/other',
        //     meta: {
        //         icon: 'el-icon-set-up',
        //         title: '其他管理'
        //     },
        //     children: [
        //         {
        //             component: 'other/toExamine/index',
        //             meta: { breadcrumb: true, icon: '', title: '审核管理' },
        //             path: '/other/toExamine'
        //         },
        //         {
        //             component: 'other/user/index',
        //             meta: { breadcrumb: true, icon: '', title: '用户列表' },
        //             path: '/other/user'
        //         },
        //         {
        //             component: 'other/raise/index',
        //             meta: { breadcrumb: true, icon: '', title: '公募记录列表' },
        //             path: '/other/raise'
        //         }
        //     ]
        // },
        {
            path: '/orePool',
            meta: {
                icon: 'el-icon-set-up',
                title: '矿池管理'
            },
            children: [
                {
                    component: 'orePool/orePool/index',
                    meta: { breadcrumb: true, icon: '', title: '矿池列表' },
                    path: '/orePool/orePool'
                },
                {
                    component: 'orePool/orePoolProfit/index',
                    meta: { breadcrumb: true, icon: '', title: '矿池收益记录' },
                    path: '/orePool/orePoolProfit'
                }
            ]
        }, {
            path: '/raise',
            meta: {
                icon: 'el-icon-set-up',
                title: '公募管理'
            },
            children: [
                {
                    component: 'raise/raise/index',
                    meta: { breadcrumb: true, icon: '', title: '公募记录' },
                    path: '/raise/raise'
                }
            ]
        }, {
            path: '/member',
            meta: {
                icon: 'el-icon-user-solid',
                title: '会员管理'
            },
            children: [
                {
                    component: 'member/memberList/index',
                    meta: { breadcrumb: true, icon: '', title: '会员列表' },
                    path: '/member/memberList'
                }
            ]
        }
    ],
    displayType: [{ id: 0, type: '否' }, { id: 1, type: '是' }],
    langList: [{ id: 'cn', name: '中文' }, { id: 'en', name: '英文' }],
    marketType: [{ id: 0, type: 'USDT合约' }, { id: 1, type: '币本位合约' }],
    cardType: [{ id: 1, type: '身份证' }, { id: 2, type: '护照' }, { id: 3, 'type': '驾驶证' }, { id: 4, 'type': '其他' }],
    authType: [{ id: 0, type: '人脸识别' }, { id: 1, type: '后台审核' }],
    examineStatus: [{ id: 1, type: '待审核' }, { id: 2, type: '已审核' }],
    examineResult: [{ id: 2, type: '审核通过' }, { id: 3, type: '审核不通过' }],
    payIn: [{ id: 0, type: '待审核' }, { id: 3, type: '已完成' }, { id: 4, type: '已取消' }, { id: 2, type: '待确认' }, { id: 5, type: '提币失败' },{id:1,type:'审核通过'}],
    coinList: [{ id: 0, name: 'btc' }, { id: 1, name: 'usdt' }, { id: 2, name: 'eth' }, { id: 3, name: 'eos' }],
    FreezingType: [{ id: 1, name: '交易冻结' }, { id: 2, name: '充值冻结' }, { id: 3, name: '提现冻结' }, { id: 4, name: '一般冻结' }],
    lockedPostionList: [{ id: 1, name: '交易冻结' }, { id: 2, name: '充值冻结' }, { id: 3, name: '提现冻结' }, {
        id: 4,
        name: '一般冻结'
    }],
    financialType: [{ id: 1, type: '充值' }, { id: 2, type: '提现' }, { id: 3, type: '储蓄' }, { id: 4, type: '其他' }],
    range: [{ id: 0, type: '主库数据' }, { id: 1, type: '备库数据' }],
    checkList: [],
    list: [
        {
            categoryName: '关于我们',
            realName: '张三',
            countryId: 2,
            countryCode: 86,
            cardTypeName: '驾驶证',
            cardId: 123254215452123451,
            status: 1,
            createTime: 1568617443000,
            id: 100000000,
            uid: 0,
            isDeleted: 0,
            isNewsAnnouncement: 0,
            isRecommend: '1',
            language: 'cn',
            orderBy: 0,
            region: 1,
            vipLevel: '1',
            title: '关于我们',
            content: '<p>集卡日时间的话抗裂砂浆等会</p>',
            updateTime: 671304755000,
            name: '17638825741',
            code: 'readfd',
            phone: '17638825741',
            email: 'a1@qq.com',
            webLoginCount: 11,
            webRegisterCount: 4,
            appLoginCount: 10,
            appRegisterCount: 10,
            loginCount: 21,
            registerCount: 14,
            level: 1,
            levelName: '普通会员',
            point: 1,
            takerFee: 0.01,
            makerFee: 0.01,
            isWithdrawOpen: 0,
            isOtcOpen: 1,
            coin: 1,
            number: 100.0001,
            amount: 12348574,
            isDef: 1,
            typeId: 4,
            remark: 'mcc充值账号',
            billType: '系统充值',
            ip: '192.168.1.117',
            fee: 0.4,
            address: '1MKSVNPpXbBDv1gQi6aqhxovYLFGWMePqf',
            addHash: '62005fb08901eba9841fe4ed4fc2036c1f5c58883e832665a37a60bed49a8d45',
            memo: 'jaksdfhjksadfhs',
            nickName: '羽梦',
            market: 'ETH_USDT',
            trade: 1,
            repayTypes: 1,
            coinImg: 'https://file.gaias.io/image/public/get/20200817/4bb8ce42-43ee-4882-921f-1097fd839c6d.png',
            app: 'IOS'
        }, {
            categoryName: '新闻公告',
            createTime: 1568617443000,
            realName: '李四',
            cardTypeName: '身份证',
            cardId: 4132654141452114441,
            status: 3,
            countryId: 1,
            countryCode: 235,
            id: 2,
            uid: 123,
            isDeleted: 0,
            vipLevel: '2',
            isNewsAnnouncement: 0,
            isRecommend: 0,
            language: 'en',
            orderBy: 1,
            region: 0,
            title: 'otc',
            content: '<p>集卡日时间的话抗裂砂浆等会</p>',
            updateTime: 1271304755000,
            name: '17638825741',
            code: 'readfd',
            phone: '17638825741',
            email: 'a1@qq.com',
            webLoginCount: 11,
            webRegisterCount: 4,
            appLoginCount: 10,
            appRegisterCount: 10,
            loginCount: 21,
            registerCount: 14,
            level: 2,
            levelName: '市代理',
            point: 0,
            takerFee: 1,
            makerFee: 0,
            isWithdrawOpen: 0,
            isOtcOpen: 0,
            coin: 2,
            number: 200.01,
            amount: 123,
            isDef: 0,
            typeId: 3,
            remark: 'mcc充值账号',
            billType: '商家认证',
            ip: '192.168.100.12',
            fee: 0.1,
            address: '3MKSVNPpXbBDv1gQi6aqhxovYLFGWMePqf',
            addHash: '62005fb08901eba9841fe4ed4fc2036c1f5c58883e832665a37a60bed49a8d45',
            memo: 'jaksdfhjksadfhs',
            nickName: '嘿嘿',
            market: 'OMG_USDT',
            trade: 0,
            repayTypes: 2,
            coinImg: 'https://file.gaias.io/image/public/get/20200817/4bb8ce42-43ee-4882-921f-1097fd839c6d.png',
            app: 'Android'
        }, {
            categoryName: '新闻公告',
            createTime: 1568617443000,
            realName: '王五',
            cardTypeName: '其他',
            cardId: 563654141452114441,
            status: 2,
            countryId: 3,
            countryCode: 45,
            id: 3,
            uid: 63,
            isDeleted: 0,
            vipLevel: '2',
            isNewsAnnouncement: 0,
            isRecommend: 1,
            language: 'en',
            orderBy: 1,
            region: 0,
            title: 'otc',
            content: '<p>集卡日时间的话抗裂砂浆等会</p>',
            updateTime: 1071304755000,
            name: '17638825741',
            code: 'readfd',
            phone: '17638825741',
            email: 'a1@qq.com',
            webLoginCount: 11,
            webRegisterCount: 4,
            appLoginCount: 10,
            appRegisterCount: 10,
            loginCount: 21,
            registerCount: 14,
            level: 888,
            levelName: '市值账号',
            point: 0,
            takerFee: 0,
            makerFee: 0,
            isWithdrawOpen: 1,
            isOtcOpen: 1,
            coin: 3,
            number: 64.5,
            amount: 786452,
            isDef: 1,
            typeId: 1,
            remark: '',
            billType: 'OTC-买入',
            ip: '127.0.0.1',
            fee: 0.23,
            address: '2MKSVNPpXbBDv1gQi6aqhxovYLFGWMePqf',
            addHash: '62005fb08901eba9841fe4ed4fc2036c1f5c58883e832665a37a60bed49a8d45',
            memo: 'jaksdfhjksadfhs',
            nickName: '羽梦',
            market: 'OMG_BTC',
            trade: 1,
            repayTypes: 3,
            coinImg: 'https://file.gaias.io/image/public/get/20200817/4bb8ce42-43ee-4882-921f-1097fd839c6d.png',
            app: 'Android'
        }
    ],
    exportExcel: (header, filterVal, filename, list) => {
        import('@/vendor/Export2Excel').then(excel => {
            const data = list.map(v => filterVal.map(j => {
                if (j === 'timestamp') {
                    return parseTime(v[j]);
                } else {
                    return v[j];
                }
            }));
            excel.export_json_to_excel({
                header,
                data,
                filename
            });
        });
    }
    // coinType: (item) => {
    //     console.log(this)
    //     // return coinList[item].name;
    // }
};