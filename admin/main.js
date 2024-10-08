var api = new CallApi();
function getEle(id) {
    return document.getElementById(id);
}

// Lấy danh sách sản phẩm
function getListProduct() {
    var promise = api.fectchData();

    promise
        .then(function (result) {
            renderUI(result.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}
getListProduct();

// Hiển thị sản phẩm ra trang admin
function renderUI(data) {
    var content = "";

    for (var i = 0; i < data.length; i++) {
        var product = data[i];
        content += `
            <tr>
                <td>${i + 1}</td>
                <td>${product.tenSP}</td>
                <td>${product.gia}</td>
                <td>
                    <img width="100" src="./img/${product.hinhAnh}" />
                </td>
                <td>${product.loaiSP}</td>
                <td>${product.moTa}</td>
                <td>${product.soLuong}</td>
                <td>
                    <button class="btn btn-warning" data-toggle="modal" data-target="#myModal" onclick="editProduct(${product.id})">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Xóa</button>
                </td>
            </tr>
        `;
    }

    getEle("tblDanhSachSP").innerHTML = content;
    // Thêm sự kiện click cho nút tìm kiếm
    document.getElementById('searchButton').onclick = function () {
        var searchName = document.getElementById('searchInput').value;
        getListProduct(searchName);  // Gọi hàm tìm kiếm với từ khóa
    };
}
getEle("btnThemSP").onclick = function () {
    // Sửa lại tiêu đề cho modal
    document.getElementsByClassName("modal-title")[0].innerHTML = "Add Product";

    // Tạo nút "Add" => gắn vào footer của modal
    var btnAdd = `<button class="btn btn-primary" onclick="addProduct()">Thêm Sản Phẩm</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnAdd;
};

// Thêm sản phẩm mới
function addProduct() {
    // Lấy thông tin từ user nhập liệu
    var tenSP = getEle("TenSP").value;
    var gia = getEle("GiaSP").value;
    var hinhAnh = getEle("HinhSP").value;
    var loaiSP = getEle("loai_SP").value;
    var moTa = getEle("MoTa").value;
    var soLuong = getEle("soLuong").value;

    // Tạo đối tượng sản phẩm mới
    var product = new Product("", tenSP, gia, hinhAnh, loaiSP, moTa, soLuong);

    // Kiểm tra tính hợp lệ
    var isValid = true;
    isValid &= kiemTraRong(tenSP, "spanTen", "Vui lòng không để trống");
    isValid &= kiemTraSo(gia, "spanGia", "Vui lòng nhập số") && kiemTraRong(gia, "spanGia", "Vui lòng không để trống");
    isValid &= kiemTraRong(hinhAnh, "spanAnh", "Vui lòng không để trống");
    isValid &= kiemTraRong(loaiSP, "spanloaiSP", "Vui lòng không để trống");
    isValid &= kiemTraRong(moTa, "spanMoTa", "Vui lòng không để trống");
    isValid &= kiemTraRong(soLuong, "spansoLuong", "Vui lòng không để trống");

    if (!isValid) {
        return null;
    }

    // Gọi API thêm sản phẩm mới
    var promise = api.addProductApi(product);

    promise
        .then(function (result) {
            // Hiển thị thông báo thành công với SweetAlert2
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Thêm sản phẩm thành công: ${result.data.tenSP}`,
                showConfirmButton: false,
                timer: 1500
            });
            // Đóng modal
            document.getElementsByClassName("close")[0].click();
            // Xóa thành công => render lại giao diện
            getListProduct();
        })
        .catch(function (err) {
            console.log(err);
        });
}

// Xóa sản phẩm
function deleteProduct(id) {
    Swal.fire({
        title: "Bạn có muốn xóa sản phẩm này?",
        text: "Sau khi xóa không thể khôi phục!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa"
    }).then((result) => {
        if (result.isConfirmed) {
            var promise = api.deleteProductById(id);

            promise
                .then(function (result) {
                    // Xóa thành công => cập nhật lại giao diện
                    getListProduct();

                    // Hiển thị thông báo thành công
                    Swal.fire({
                        title: "Đã xóa!",
                        text: "Sản phẩm của bạn đã được xóa.",
                        icon: "success"
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    });
}
//  tìm kiếm sản phẩm
function getListProduct(tenSP) {
    var promise;

    if (tenSP) {
        // Nếu có tên sản phẩm, gọi API tìm kiếm
        promise = api.searchProductByName(tenSP);
    } else {
        // Nếu không có tên sản phẩm, gọi API lấy toàn bộ danh sách
        promise = api.fectchData();
    }

    promise
        .then(function (result) {
            renderUI(result.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}//sửa sản phẩm
function editProduct(id) {
    //sửa lại tiêu đề cho modal
    document.getElementsByClassName("modal-title")[0].innerHTML = "Edit Product";

    //tạo nút "Update" => gắn vào footer của modal
    var btnUpdate = `<button class="btn btn-info" onclick="updateProduct(${id})">Cập nhật sản phẩm</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnUpdate;

    //lấy thông tin chi tiết của product dựa vào id
    var promise = api.getProductById(id);

    promise
        .then(function (result) {
            var product = result.data;
            //show data ra ngoài các thẻ input
            getEle("TenSP").value = product.tenSP;
            getEle("GiaSP").value = product.gia;
            getEle("HinhSP").value = product.hinhAnh;
            getEle("MoTa").value = product.moTa;
            getEle("loai_SP").value = product.loaiSP;
            getEle("soLuong").value = product.soLuong;
        })
        .catch(function (error) {
            console.log(error);
        });
}
function updateProduct(id) {
    // lấy thông tin từ user nhập liệu
    var tenSP = getEle("TenSP").value;
    var gia = getEle("GiaSP").value;
    var hinhAnh = getEle("HinhSP").value;
    var loaiSP = getEle("loai_SP").value;
    var moTa = getEle("MoTa").value;
    var soLuong = getEle("soLuong").value;
    var product = new Product(id, tenSP, gia, hinhAnh, loaiSP, moTa, soLuong);

    api
        .updateProductApi(product)
        .then(function () {
            //close modal
            document.getElementsByClassName("close")[0].click();
            getListProduct();
        })
        .catch(function (error) {
            console.log(error);
        });
}

