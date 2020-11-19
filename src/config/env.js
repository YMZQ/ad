let baseImg = '';
let issuer = '';

if (process.env.NODE_ENV == 'development') {
    baseImg = 'http://tfile.ex.com/image/public/get/';
} else if (process.env.NODE_ENV == 'production') {
    baseImg = 'https://api.super-radar.com/image/public/get/';
    // issuer = 'rGRryPusPYV4VySEncpV3SvHBDEnLv5zhR';
} else if (process.env.NODE_ENV == 'test') {
    baseImg = 'https://testapi.chaying9.com/image/public/get/';
    // issuer = 'rUBWU8f9EpKRxCKT3xoHD6Bj5rLLrwJrGn';
}
export {
    baseImg,
    issuer
};

