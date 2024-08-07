var api = new CallApi();
function getEle(id) {
    return document.getElementById(id);
}
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
              <td>${product.moTa}</td>
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