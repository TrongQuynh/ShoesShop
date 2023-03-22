
module.exports = {
    formatToMoney(number, type) {
        // 'it-IT' => VND
        // 'vi-VN' => ₫
        let location = type == "D" || !type ? 'vi-VN' : 'it-IT';
        return new Intl.NumberFormat(location, { style: 'currency', currency: 'VND' }).format(number);
    },
    formatDateToTime(date){
        let hour = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
        let time = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
        return `${hour}:${time}`;
    },
    formatDate(date){
        let month = (date.getMonth() + 1);
        let day = date.getDate();
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        return `${day}-${month}-${date.getFullYear()}`;
    },
    getRandomNumber(min = 0, max = 200) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    

}