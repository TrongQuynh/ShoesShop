function formatToMoney(number, type) {
    // 'it-IT' => VND
    // 'vi-VN' => ₫
    let location = type == "D" || !type ? 'vi-VN' : 'it-IT';
    return new Intl.NumberFormat(location, { style: 'currency', currency: 'VND' }).format(number);
}