const express = require('express');
const cors = require('cors');
const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');

const app = express();
app.use(cors());
app.use(express.json());

// ==============================================================
// CẤU HÌNH VNPAY SANDBOX
// ==============================================================
const tmnCode = "B7UNV5NJ";
const secretKey = "6NO4L878MZ2BMKF1Q1MSX6RBLB8R70EG";
const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const returnUrl = "http://localhost:5173/vnpay_return";

// --- HÀM SẮP XẾP + ENCODE THAM SỐ THEO CHUẨN VNPAY ---
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

// --- HÀM TẠO URL THANH TOÁN VNPAY ---
function createVNPayUrl(amount, orderId) {
    let vnp_Params = {};

    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = Math.round(amount * 100);
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '127.0.0.1';
    vnp_Params['vnp_CreateDate'] = moment().format('YYYYMMDDHHmmss');

    // Sắp xếp + encode theo chuẩn VNPay
    vnp_Params = sortObject(vnp_Params);

    // Tạo chữ ký bảo mật
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    vnp_Params['vnp_SecureHash'] = signed;

    // Trả về link cuối cùng
    return vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });
}

// --- API: TẠO LINK THANH TOÁN ---
app.post('/api/vnpay/create-payment', (req, res) => {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
        return res.status(400).json({ message: 'Thiếu thông tin amount hoặc orderId' });
    }

    const paymentUrl = createVNPayUrl(amount, orderId);
    return res.json({ paymentUrl });
});

// --- API: XÁC NHẬN KẾT QUẢ THANH TOÁN ---
app.get('/api/vnpay/return', (req, res) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        const responseCode = vnp_Params['vnp_ResponseCode'];
        if (responseCode === '00') {
            return res.json({ status: 'success', message: 'Thanh toán thành công!', data: vnp_Params });
        } else {
            return res.json({ status: 'failed', message: 'Thanh toán thất bại!', code: responseCode });
        }
    } else {
        return res.json({ status: 'error', message: 'Sai chữ ký!' });
    }
});

const PORT = 3004;
app.listen(PORT, () => console.log(`Payment Service (VNPay) running on port ${PORT}`));
