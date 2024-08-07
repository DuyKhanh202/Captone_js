function kiemTraRong(value, idCanhBao, mess) {
    var domSpan = document.getElementById(idCanhBao);
    if (value == "") {
        domSpan.innerHTML = mess;
        return false;
    } else {
        domSpan.innerHTML = "";
        return true;
    }
}
function kiemTraKyTu(value, idCanhBao, mess) {
    var domSpan = document.getElementById(idCanhBao);
    var regexString = /^[a-zA-Z ]+$/;
    var isValid = regexString.test(value);
    if (isValid == true) {
        domSpan.innerHTML = "";
        return true;
    } else {
        domSpan.innerHTML = mess;
        return false;
    }
}
function kiemTraSo(value, idCanhBao, mess) {
    var domSpan = document.getElementById(idCanhBao);

    var regexNumber = /^\d+$/;

    var isValid = regexNumber.test(value);
    console.log(isValid);
    if (isValid) {
        domSpan.innerHTML = "";
        return true;
    } else {
        domSpan.innerHTML = mess;
        return false;
    }
}
