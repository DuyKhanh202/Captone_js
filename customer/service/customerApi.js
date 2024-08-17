// GET PRODUCT
function apiGetProducts(searchValue) {
  // PHẢI CÓ TỪ KHÓA RETURN ĐỂ .THEN VÀ .CATCH
  return axios({
    url: "https://66a7892853c13f22a3d01ae2.mockapi.io/product",
    method: "GET",
    params: {
      loaiSP: searchValue || undefined,
    },
  });
}
