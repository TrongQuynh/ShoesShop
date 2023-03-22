$(document).ready(function () {
    (function () {
        [40, 41, 42, 48, 37].forEach((size) => {
            let html = `<option value="${size}">${size}</option>`;
            $("#size-select").append(html);
        })
    })();

    function formatToMoney(number, type) {
        // 'it-IT' => VND
        // 'vi-VN' => ₫
        let location = type == "D" || !type ? 'vi-VN' : 'it-IT';
        return new Intl.NumberFormat(location, { style: 'currency', currency: 'VND' }).format(number);
    }

    async function sendData(search) {
        let res = await fetch("/tim-kiem/suggest-product", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ search })
        });
        return await res.json();
    }

    function getHTML(product) {
        let oldPrice = product.oldPrice === 0 ? "" : product.oldPrice;
        return `
        <div class="product-suggest">
            <div class="img-side">
                <img src="${product.productImgs[0]}" alt="${product.productName}">
            </div>
            <div class="info-side">
                <a href="/san-pham/${product.slug}">${product.productName}</a>
                <br>
                <span class="price">${formatToMoney(product.newPrice, 'vi-VN')}</span>
                <br>
                <del><del class="old-price">${oldPrice}</del></del>
            </div>
            <div class="clear"></div>
        </div>
        `
    }


    // Search Product by name 
    // then show suggestion box
    $(".form-control").keyup(async function () {
        let search = $(".form-control").val();
        console.log(search);
        if (search !== "") {
            let products = (await sendData(search)).products;
            $(".suggestion-box").empty();
            console.log(products);
            for (let product of products) {
                let html = getHTML(product);
                $(".suggestion-box").append(html);
            }
            $(".suggestion-box").append(`
                <div class="show-all-product">
                    <a href="/san-pham">
                        <span class="red">Xem tất cả sản phẩm</span>
                    </a>
                </div>
            `)
            $(".suggestion-box").addClass("active-suggest-box");
        }
        else {
            $(".suggestion-box").removeClass("active-suggest-box");
        }

    });

    $(".form-control").on('keypress', async function (e) {
        if (e.which == 13) {
            e.preventDefault()
            let search = $(this).val();
            window.location.replace(`/tim-kiem?search=${search}`);
        }
    });

    // Fillter Product
    $("#btn-search-section").click(function (e) {
        e.preventDefault();
        let size = $("#size-select").val() || "";
        let price = $("#price-select").val() || "";
        let sort = $("#sort-select").val() || "";

        window.location.replace(`/tim-kiem?size=${size}&rangePrice=${price}&sort=${sort}`);
    });

    // $(".page-link").click(function (e) {
    //     e.preventDefault();
    //     let currentUrl = window.location.href;
    //     let currentPage = $(this).data("page");
    //     let queryString = (window.location.href).replaceAll(window.location.pathname, "").replaceAll(window.location.origin, "");
    //     if (String(queryString).includes("&page=")) {
    //         queryString = queryString.slice(0, String(queryString).indexOf("&page="));
    //     }
    //     window.location.replace(`/tim-kiem${queryString}&page=${currentPage}`);
    // });
});