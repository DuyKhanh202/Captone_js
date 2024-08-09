function CallApi() {
    this.fectchData = function () {
        var promise = axios({
            url: "https://66a7892853c13f22a3d01ae2.mockapi.io/product",
            method: "GET",
        });
        return promise;
    };
    this.addProductApi = function (product) {
        var promise = axios({
            url: "https://66a7892853c13f22a3d01ae2.mockapi.io/product",
            method: "POST",
            data: product,
        });
        return promise;
    };
    //xóa sản phẩm
    this.deleteProductById = function (id) {
        var promise = axios({
            url: "https://66a7892853c13f22a3d01ae2.mockapi.io/product/" + id,
            method: "DELETE",
        });
        return promise;
    };
}