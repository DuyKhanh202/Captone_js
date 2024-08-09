var api = new CallApi();
function getEle(id) {
    return document.getElementById(id);
}
//lấy danh sách sản phẩm 
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
//hiển thị sản phẩm ra trang admin
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
                <button class="btn btn-warning" data-toggle="modal" data-target="#myModal" onclick="editProduct(${product.id
            })">Sửa</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id
            })">Xóa</button>
                </td>
            </tr>
        `;
    }

    getEle("tblDanhSachSP").innerHTML = content;
}
getEle("btnThemSP").onclick = function () {
    //sửa lại tiêu đề cho modal
    document.getElementsByClassName("modal-title")[0].innerHTML = "Add Product";

    //tạo nút "Add" => gắn vào footer của modal
    var btnAdd = `<button class="btn btn-primary" onclick="addProduct()">Thêm Sản Phẩm</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnAdd;
};
// thêm sản phẩm mới 
function addProduct() {
    // lấy thông tin từ user nhập liệu
    var tenSP = getEle("TenSP").value;
    var gia = getEle("GiaSP").value;
    var hinhAnh = getEle("HinhSP").value;
    var loaiSP = getEle("loai_SP").value;
    var moTa = getEle("MoTa").value;
    var soLuong = getEle("soLuong").value;
    var product = new Product("", tenSP, gia, hinhAnh, loaiSP, moTa, soLuong);
    var promise = api.addProductApi(product);
    var isValid = true;
    isValid &= kiemTraRong(tenSP, "spanTen", "Vui lòng không để trống");
    isValid &=
        kiemTraSo(gia, "spanGia", "vui lòng nhập số") &&
        kiemTraRong(gia, "spanAnh", "Vui lòng không để trống");
    isValid &= kiemTraRong(hinhAnh, "spanAnh", "Vui lòng không để trống");
    isValid &= kiemTraRong(loaiSP, "spanloaiSP", "Vui lòng không để trống");
    isValid &= kiemTraRong(moTa, "spanMoTa", "Vui lòng không để trống");
    isValid &= kiemTraRong(soLuong, "spansoLuong", "Vui lòng không để trống");
    if (!isValid) {
        return null;
    }

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
            //close modal
            document.getElementsByClassName("close")[0].click();
            //xoá thành công => render lại giao diện
            getListProduct();
        })
        .catch(function (err) {
            console.log(err);
        });
}
//delete sản phẩm
function deleteProduct(id) {
    Swal.fire({
        title: "Bạn có muốn xóa sản phẩm này ?",
        text: "Sau khi xóa không thể khôi phục!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa "
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
                });
        }
    });
}
