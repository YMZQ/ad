import fetch from '@/utils/fetch';
const ADMIN = '/admin';
const API_ADMIN = '/api/admin';

//权限
export const getUserInfo = (params) => fetch('/agent/user' + '/index', params, 'get');
export const getMenu = (params) => fetch(API_ADMIN + '/menu', params, 'get');
export const addMenu = (params) => fetch(API_ADMIN + '/menu', params, 'post');
export const updateMenu = (params) => fetch(API_ADMIN + '/menu', params, 'patch');
export const deleteMenu = (menuId, params) => fetch(API_ADMIN + '/menu/' + menuId, params, 'delete');

export const getRole = (params) => fetch(API_ADMIN + '/role', params, 'get');
export const addRole = (params) => fetch(API_ADMIN + '/role', params, 'post');
export const updataRole = (params) => fetch(API_ADMIN + '/role', params, 'patch');
export const deleteRole = (roleId, params) => fetch(API_ADMIN + '/role/' + roleId, params, 'delete');

export const getUser = (params) => fetch(API_ADMIN + '/user', params, 'get');
export const addUser = (params) => fetch(API_ADMIN + '/user', params, 'post');
export const updataUser = (params) => fetch(API_ADMIN + '/user', params, 'patch');
export const deleteUser = (userId, params) => fetch(API_ADMIN + '/user/' + userId, params, 'delete');

//导入
export const excelMenu = (params) => fetch(API_ADMIN + '/excel/menu', params, 'post');
//路由
export const getRouting = (params) => fetch(API_ADMIN + '/menu/routing', params, 'get');
//修改密码
export const editPassword = (params) => fetch(API_ADMIN + '/user/password ', params, 'put');

//登录
export const login = (params) => fetch(ADMIN + '/user/login', params, 'post');
export const getInfo = (params) => fetch(ADMIN + '/user/info', params, 'get');
export const getAsset = (params) => fetch(ADMIN + '/asset', params, 'get');
export const getAssetAddr = (addr, params) => fetch(ADMIN + '/asset/' + addr, params, 'get');
export const getAssetSub = (params) => fetch(ADMIN + '/asset/sub', params, 'get');

//googleCode
export const getGoogleCode = (params) => fetch(ADMIN + '/user/google_code', params, 'get');
export const addGoogleCode = (params) => fetch(ADMIN + '/user/google_code', params, 'post');
export const updataGoogleCode = (params) => fetch(ADMIN + '/user/google_code', params, 'patch');
export const deleteGoogleCode = (params) => fetch(ADMIN + '/user/google_code', params, 'delete');

// 上传/获取图片
export const getUpdataFile = (params) => fetch(ADMIN + '/file', params, 'get');
export const updataFile = (params) => fetch(ADMIN + '/file/upload', params, 'post');
export const getImgUrl = (params) => fetch(ADMIN + '/config/img', params, 'get');

// 文章列表
export const getNews = (params) => fetch(ADMIN + '/news', params, 'get');
export const addNews = (params) => fetch(ADMIN + '/news', params, 'post');
export const updataNews = (params) => fetch(ADMIN + '/news', params, 'patch');
export const deleteNews = (Id, params) => fetch(ADMIN + '/news/' + Id, params, 'delete');

//  APP版本
export const getApp = (params) => fetch(ADMIN + '/app', params, 'get');
export const addApp = (params) => fetch(ADMIN + '/app', params, 'post');
export const updataApp = (params) => fetch(ADMIN + '/app', params, 'patch');
export const deleteApp = (Id, params) => fetch(ADMIN + '/app/' + Id, params, 'delete');

//  banner
export const getImgs = (params) => fetch(ADMIN + '/imgs', params, 'get');
export const addImgs = (params) => fetch(ADMIN + '/imgs', params, 'post');
export const updataImgs = (params) => fetch(ADMIN + '/imgs', params, 'patch');
export const deleteImgs = (Id, params) => fetch(ADMIN + '/imgs' + '/' + Id, params, 'delete');

// 审核
export const getAssetCoin = (params) => fetch(ADMIN + '/defi', params, 'get');
export const updataAssetCoin = (params) => fetch(ADMIN + '/defi', params, 'patch');

// 提币审核
export const getAssetWithdraw = (params) => fetch(ADMIN + '/withdraw', params, 'get');
export const updateAssetWithdraw = (params) => fetch(ADMIN + '/withdraw', params, 'patch');

//充币记录
export const getDeposit = (params) => fetch(ADMIN + '/deposit', params, 'get');

export const getFconfig = (params) => fetch(ADMIN + '/config', params, 'get');
export const updateconfig = (params) => fetch(ADMIN + '/config', params, 'patch');
export const addSysConfig = (params) => fetch(ADMIN + '/config', params, 'post');

export const updateBatchConfig = (params) => fetch(ADMIN + '/batch_config', params, 'patch');

// 转账
export const getFlow = (params) => fetch(ADMIN + '/flow', params, 'get');

//合计
export const getDepositSum = (params) => fetch(ADMIN + '/deposit/sum', params, 'get');
export const getWithdrawSum = (params) => fetch(ADMIN + '/withdraw/sum', params, 'get');
export const getFlowSum = (params) => fetch(ADMIN + '/flow/sum', params, 'get');

// 矿池-- 矿池收益   -- 矿池列表
export const getOre = (params) => fetch(ADMIN + '/ore', params, 'get');

export const getOreConfig = (params) => fetch(ADMIN + '/ore/config', params, 'get');
export const addOreConfig = (params) => fetch(ADMIN + '/ore/config', params, 'post');
export const updateOreConfig = (params) => fetch(ADMIN + '/ore/config', params, 'patch');

export const getOreRecord = (params) => fetch(ADMIN + '/ore/record', params, 'get');
export const getOreRecordSum = (params) => fetch(ADMIN + '/ore/record/sum', params, 'get');
export const getOreSum = (params) => fetch(ADMIN + '/ore/sum', params, 'get');

// 公募
export const getExchange = (params) => fetch(ADMIN + '/exchange', params, 'get');
export const addPublicConfig = (params) => fetch(ADMIN + '/public/config', params, 'post');
export const getPublicConfig = (params) => fetch(ADMIN + '/public/config', params, 'get');
export const updatePublicConfig = (params) => fetch(ADMIN + '/public/config', params, 'patch');
export const exportPublicConfig = (params) => fetch(ADMIN + '/public/config/export', params, 'get');

// 创世
export const getDeif = (params) => fetch(ADMIN + '/defi/record', params, 'get');
export const updateDeif = (id,params) => fetch(ADMIN + '/defi/record/'+id, params, 'patch');
export const toExamine = (params) => fetch(ADMIN + '/defi/record', params, 'patch');
export const getDeifCoin = (params) => fetch(ADMIN + '/defi/record/coin', params, 'get');

export const getAddr = (params) => fetch(ADMIN + '/config/addr', params, 'get');
export const updateAddr = (params) => fetch(ADMIN + '/config/addr', params, 'patch');
export const addAddr = (params) => fetch(ADMIN + '/config/addr', params, 'post');

// 成交
export const getEntrust = (params) => fetch(ADMIN + '/entrust', params, 'get');
export const getMatch = (params) => fetch(ADMIN + '/match', params, 'get');

//币对(市场)
export const getMarket = (params) => fetch(ADMIN + '/market', params, 'get');
export const addMarket = (params) => fetch(ADMIN + '/market', params, 'post');
export const updateMarket = (params) => fetch(ADMIN + '/market', params, 'patch');

//币种
export const getCoinList = (params) => fetch(ADMIN + '/coin', params, 'get');
export const addCoin = (params) => fetch(ADMIN + '/coin', params, 'post');
export const updateCoin = (params) => fetch(ADMIN + '/coin', params, 'patch');
export const getAllCoin = (params) => fetch(ADMIN + '/coin/list', params, 'get');

//设备查询
export const getDevice = (params) => fetch(ADMIN + '/device/Address', params, 'get');

//系统时间
export const getConfigTime = (params) => fetch(ADMIN + '/config/time', params, 'get');

//公募
export const getDeifList = (params) => fetch(ADMIN + '/defi/record/list', params, 'get');

export const getVoteConfig = (params) => fetch(ADMIN + '/vote/config', params, 'get');
export const addVoteConfig = (params) => fetch(ADMIN + '/vote/config', params, 'post');
export const updateVoteConfig = (params) => fetch(ADMIN + '/vote/config', params, 'patch');
export const getVoteRecord = (params) => fetch(ADMIN + '/vote/record', params, 'get');
export const VoteRecordExport = (params) => fetch(ADMIN + '/vote/record/export', params, 'get');

//空投
export const importAir = (params) => fetch(ADMIN + '/air', params, 'post');
export const addGetAirToken = (params) => fetch(ADMIN + '/air/token', params, 'get');
export const getAirRecord = (params) => fetch(ADMIN + '/air/record/list', params, 'get');
export const getAirList = (params) => fetch(ADMIN + '/air/list', params, 'get');

//K线
export const getChart = (params) => fetch(ADMIN + '/chart', params, 'get');
export const updateChart = (params) => fetch(ADMIN + '/chart', params, 'put');



