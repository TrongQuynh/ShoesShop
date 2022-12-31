// Delete product in cart navbar
// Mini Cart
$(document).ready(function () {
    let productID = "";
    $("#delete-product-cart").on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        productID = button.data('id') // Extract info from data-* attributes

        let productName = $(this).parent().find(".cart-item-namePro").text()
        $(".modal-body").text(`Bạn có muốn xóa sản phẩm ${productName} ?`)
    })
    $("#btn-confirm-delete").click(function () {
        let formDelete = document.forms["remove-product-form"];
        formDelete.action = `/gio-hang/delete/${productID}?_method=DELETE`;
        formDelete.submit();
    })
})
