function getListProduct() {
  apiGetProducts()
    .then(function (result) {
      console.log(result.data); // Kiểm tra dữ liệu nhận được từ API
      renderUI(result.data);
    })
    .catch(function (err) {
      console.log(err);
    });
}

getListProduct();

function renderUI(data) {
  var content = "";
  for (var i = 0; i < data.length; i++) {
    var product = data[i];

    // Kiểm tra nếu product.moTa có giá trị, nếu không thì thay bằng "Mô tả không có sẵn"

    content += `
        <div class="product_item">
          <img src="../img/${product.hinhAnh}" alt="${product.tenSP}">
          <div class="item_title">
            <h3>${product.tenSP}</h3>
            <span>${product.gia.toLocaleString()}</span>
          </div>
          <p class="sub_title">${product.loaiSP}</p>
          <div class="product_action">
            <h4>${product.moTa}</h4>
            <button class="buy_now" id="buy_now" onclick="addToCart('${
              product.tenSP
            }', '${product.hinhAnh}', '${product.gia}','${
      product.id
    }')">Mua Ngay</button>
          </div>
        </div>`;
  }
  document.getElementById("products_list").innerHTML = content;
}

// Hàm chọn sản phẩm để kiểm tra tùy chọn
function SelectProduct() {
  const productSelect = document.getElementById("type");
  const selectedProduct = [];

  for (let i = 0; i < productSelect.length; i++) {
    if (productSelect[i].checked) {
      selectedProduct.push(productSelect[i].value);
    }
  }
  console.log(selectedProduct);
  renderUI(selectedProduct);
}

// Hàm xử lý sự kiện khi chọn tùy chọn trong select
function onProductSelectChange() {
  const productSelect = document.getElementById("productSelect");
  const selectedProduct = productSelect.value;

  if (selectedProduct === "Apple") {
    // Xuất ra sản phẩm Apple
    apiGetProducts(selectedProduct)
      .then((result) => {
        renderUI(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (selectedProduct === "Samsung") {
    // Xuất ra sản phẩm của Samsung
    apiGetProducts(selectedProduct)
      .then((result) => {
        renderUI(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    // Xuất ra tất cả sản phẩm
    getListProduct();
  }
}

// Gán sự kiện onchange cho select
const productSelect = document.getElementById("productSelect");
productSelect.addEventListener("change", onProductSelectChange);

// Tiền đơn hàng
let total = 0;

// Object giỏ hàng
const cart = {
  items: [],
};

// Object sản phẩm thanh toán
let product = {
  name: "",
  img: "",
  price: 0,
  quantity: 0,
};

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(name, productImg, productPrice) {
  const price = parseFloat(productPrice);
  total += price;
  console.log(name);

  const existingProduct = cart.items.find((item) => {
    return item.name === name;
  });

  console.log(existingProduct);

  if (existingProduct) {
    // Nếu sản phẩm đã có trong giỏ hàng, chỉ tăng số lượng của sản phẩm đó
    existingProduct.quantity++;

    saveCartToLocalStorage();
  } else {
    // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
    product = {
      name: name,
      img: productImg,
      price: price,
      quantity: 1,
    };
    cart.items.push(product);
    displayCartItem(cart.items);
    saveCartToLocalStorage();
  }

  displayTotalPrice();

  Swal.fire({
    position: "center",
    icon: "success",
    title: "Đã thêm vào giỏ hàng",
    showConfirmButton: false,
    timer: 1500,
  });
}

// Hàm hiển thị thông tin sản phẩm trong giỏ hàng
function displayCartItem(products) {
  let html = products.reduce((result, value) => {
    return (
      result +
      `
          <div class="cart_item mt-3" data-product-name="${
            value.name
          }" data-quantity="1">
            <div class="cart_item_img">
              <img src="../img/${value.img}" alt="" />
            </div>
    
            <div class="cart_item_info">
              <p>Sản phẩm: ${value.name}</p>
              <p>Số lượng: ${value.quantity}</p>
              <p>Giá tiền: ${value.price.toLocaleString()}$</p>
            </div>
    
            <div class="cart_item_buttons">
              <button onclick="increaseQuantity('${
                value.name
              }')"><i class="fa fa-plus"></i></button>
              <button onclick="decreaseQuantity('${
                value.name
              }')"><i class="fa fa-minus"></i></button>
              <button onclick="removeProductFromCart('${
                value.name
              }')"><i class="fa fa-trash"></i></button>
            </div>
          </div>
        `
    );
  }, "");

  document.getElementById("cart").innerHTML = html;
}

// Hàm tăng số lượng sản phẩm
function increaseQuantity(productName) {
  const existingProduct = cart.items.find((item) => item.name === productName);

  if (existingProduct) {
    // Nếu sản phẩm đã có trong giỏ hàng, chỉ tăng số lượng của sản phẩm đó
    existingProduct.quantity++;
    total += existingProduct.price;

    displayCartItem(cart.items);
    displayTotalPrice();
    saveCartToLocalStorage();
  }
}

// Hàm giảm số lượng sản phẩm
function decreaseQuantity(productName) {
  const existingProduct = cart.items.find((item) => item.name === productName);

  if (existingProduct && existingProduct.quantity > 1) {
    // Nếu sản phẩm đã có trong giỏ hàng và số lượng lớn hơn 1, giảm số lượng của sản phẩm đó
    existingProduct.quantity--;
    total -= existingProduct.price;
    displayCartItem(cart.items);
    displayTotalPrice();
    saveCartToLocalStorage();
  }
}

// Hàm hiển thị tổng tiền
function displayTotalPrice() {
  let html = `<p>TỔNG TIỀN: ${total.toLocaleString()}$</p>`;
  document.getElementById("totalPrice").innerHTML = html;
}

// Hàm khởi tạo giỏ hàng còn lưu trong LocalStorage
function init() {
  cart.items = JSON.parse(localStorage.getItem("productsInCart")) || [];
  console.log(cart.items.length);
  if (cart.items.length === 0) {
    let html = `<p>Hiện chưa có sản phẩm trong giỏ hàng</p>`;
    document.getElementById("cart").innerHTML = html;
  } else {
    cart.items.forEach((item) => {
      total += item.price * item.quantity;
    });
    displayCartItem(cart.items);
    displayTotalPrice();
  }
}

// Chạy hàm tạo giỏ hàng còn lưu trong LocalStorage
init();

// Sự kiện thanh toán
document.getElementById("thanhToan").onclick = function () {
  if (cart.items.length === 0) {
    html = `<p>Không có sản phẩm nào để thanh toán</p>`;
    document.getElementById("cart").innerHTML = html;
    displayTotalPrice();
  } else {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "THANH TOÁN THÀNH CÔNG",
      showConfirmButton: false,
      timer: 1500,
    });
    localStorage.removeItem("productsInCart");
    cart.items = [];
    total = 0;
    html = `<p>Bạn đã thanh toán hết sản phẩm trong giỏ hàng</p>`;
    document.getElementById("cart").innerHTML = html;
    displayTotalPrice();
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng và cập nhật local storage
function removeProductFromCart(productName) {
  Swal.fire({
    title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng?",
    showDenyButton: true,
    confirmButtonText: "Có",
    denyButtonText: "Không",
  }).then((result) => {
    if (result.isConfirmed) {
      // Tìm sản phẩm có tên là productName trong giỏ hàng
      const productIndex = cart.items.findIndex(
        (item) => item.name === productName
      );

      if (productIndex !== -1) {
        // Xóa sản phẩm khỏi giỏ hàng
        const removedProduct = cart.items.splice(productIndex, 1)[0];

        // Giảm tổng tiền sau khi xóa sản phẩm
        total -= removedProduct.price * removedProduct.quantity;

        // Lưu giỏ hàng đã cập nhật vào local storage
        saveCartToLocalStorage();
      }
      displayCartItem(cart.items);
      displayTotalPrice();
      Swal.fire("Đã Xóa!", "", "success");
    }
  });
}

// Hàm lưu giỏ hàng vào localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("productsInCart", JSON.stringify(cart.items));
}
