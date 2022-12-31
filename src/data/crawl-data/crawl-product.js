const axios = require("axios");
const cheerio = require("cheerio");


let productList = [];

let totalPages = 0;
let tagNameList = [];

async function crawlProduct(url, currentPage) {
    try {
        // array shoes
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);

        // Crawl data
        $(".itemPro").each(function (index, el) {
            // Crawl thubnail
            let thumbnail = $(this).find(".ps-shoe__thumbnail > img").attr("data-src");
            let shoesName = $(this).find(".ps-shoe__detail > .ps-shoe__name").text();
            let oldprice = $(this).find(".old-price").text();
            let price = $(this).find(".ps-shoe__price").text().replaceAll(oldprice, "").trim();
            let productLink = $(this).find(".ps-shoe__detail > .ps-shoe__name").attr("href");
            productLink = productLink.replaceAll("./","").replaceAll(".html","");

            let isNewProduct = $(this).find(".product-label > span").text().includes("New") ? true : false;
            let isHotProduct = $(this).find(".label-hot").text() ? true : false;
            let discountPercent = 0;
            if (oldprice) {
                discountPercent = $(this).find(".product-label-group > .ps-badge--sale > span").text();
            }

            productList.push({
                thumbnail,
                shoesName,
                price,
                oldprice,
                productLink,
                isNewProduct,
                isHotProduct,
                discountPercent
            });
        })

        if (currentPage == 0) {
            // Check if have a next page
            let href = $(".ps-pagination > .pagination >.page-item:last > a").attr("href");
            totalPages = href ? href.replaceAll("https://kingshoes.vn/san-pham?page=", "") : 0;
        }


    } catch (error) {

    }
}

async function crawlSidebarData(url) {
    let sidebarData = {};
    try {
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);

        // Crawl sidebar data
        // News post section
        $("aside.ps-widget--sidebar").each(function (index, el) {
            let header = $(this).find(".ps-widget__header > h3").text();
            if (header == "Tin tức mới") {
                let postList = [];
                $(this).find(".ps-post--sidebar").each(function () {
                    let thumbnail = $(this).find(".ps-post__thumbnail > img").attr("data-src");
                    let title = $(this).find(".ps-post__title").text();
                    let text = $(this).find(".ps-post__content > span").text().trim().split("-");
                    let date = text[0];
                    let time = text[1];
                    postList.push({ thumbnail, title, date, time });
                })
                sidebarData["postData"] = postList;
            }
            else if (header == "Sản phẩm mới") {
                let newProductList = [];
                $(this).find(".ps-shoe--sidebar").each(function () {
                    let thumbnail = $(this).find(".ps-shoe__thumbnail > img").attr("data-src");
                    let title = $(this).find(".ps-shoe__title").text();
                    let price = $(this).find(".ps-shoe__content > p").text();
                    newProductList.push({ thumbnail, title, price });
                })
                sidebarData["newProduct"] = newProductList;
            }
        })
        return sidebarData;
    } catch (error) { }
}

async function crawlProductOfAllSection(section) {
    let url = "https://kingshoes.vn";

    try {
        let result = []
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);
        if (section == "news") {
            $(".ps-home-blog").find(".ps-post").each(function () {
                let thumbnail = $(this).find(".ps-post__thumbnail > img").attr("data-lazy");
                let postTitle = $(this).find(".ps-post__content > .ps-post__title").text();
                let descript = $(this).find(".ps-post__content > .description").text().trim();
                let postLink = $(this).find(".ps-post__content > .ps-post__title").attr("href");
                postLink = postLink.replaceAll("./","").replaceAll(".html","");

                result.push({
                    thumbnail,
                    postLink,
                    postTitle,
                    descript
                })
            })
        }
        else if (section == "products") {

            $(".ps-section--features-product").find(".ps-shoe").each(function (index, el) {
                let thumbnail = $(this).find(".ps-shoe__thumbnail > img").attr("data-src");
                let shoesName = $(this).find(".ps-shoe__name").text();
                let oldprice = $(this).find(".old-price").text();
                let price = $(this).find(".ps-shoe__price").text().replaceAll(oldprice, "").trim();
                let discount = $(this).find(".ps-badge--sale > span").text();
                let isNewProduct = $(this).find(".product-label > span").text().includes("New") ? true : false;
                let isHotProduct = $(this).find(".label-hot").text() ? true : false;
                if (!discount) {

                    discount = 0;
                    oldprice = 0;
                }
                let productLink = $(this).find(".ps-shoe__name").attr("href");
                productLink = productLink.replaceAll("./","").replaceAll(".html","");

                result.push({
                    thumbnail,
                    shoesName,
                    productLink,
                    price,
                    discount,
                    oldprice,
                    isHotProduct,
                    isNewProduct
                })
                // console.log({shoesName,thumbnail,oldprice,price,discount,isHotProduct,isNewProduct});
            })
        }
        else {
            $(".ps-owl-root.ps-section").each(function (index, el) {
                let title = $(this).find(".ps-section__title").attr("data-mask");
                // Ex: if(title === "HOT")
                if (title === section) {
                    $(this).find(".ps-shoes--carousel > .ps-shoe").each(function () {
                        let thumbnail = $(this).find(".ps-shoe__thumbnail > img").attr("data-lazy");
                        let name = $(this).find(".ps-shoe__name").text();
                        let oldprice = $(this).find(".old-price").text();
                        let price = $(this).find(".ps-shoe__price").text().replaceAll(oldprice, "").trim();
                        let discount = $(this).find(".ps-badge--sale > span").text();
                        let isNewProduct = $(this).find(".product-label-group > .product-label > span").text().includes("New") ? true : false;
                        let isHotProduct = title === "HOT" ? true : false;
                        if (!discount) {
                            discount = 0;
                            oldprice = 0;
                        }
                        let productLink = $(this).find(".ps-shoe__name").attr("href");
                        productLink = productLink.replaceAll("./","").replaceAll(".html","");

                        result.push({
                            thumbnail,
                            name,
                            productLink,
                            price,
                            discount,
                            oldprice,
                            isHotProduct,
                            isNewProduct

                        })
                    })
                }
            })
        }

        return result;
    } catch (error) { }
}

async function crawlProductDetail(url){
    try {
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);

        let images = [];
        $(".ps-product__preview").find(".item").each(function(){
            let image = $(this).find("img").attr("src");
            images.push(image);
        })

        let shoeName = $(".ps-product__info").find("h1").text();
        let category = $(".ps-product__category > strong").text();
        let newPrice = $(".ps-product__price > .new-price").text();
        let oldPrice = $(".ps-product__price > .old-price").text();
        let percentDisount = $(".ps-product__thumbnail > .product-label-group").find(".ps-badge--sale > span").text();
        if(!oldPrice){
            oldPrice = 0;
            percentDisount = "";
        }
        let sizeList = [];
        $("ul.wapper_cb > li.cb").each(function(){
            let size = $(this).find(".rd_in").text();
            sizeList.push(size);
        })
        let reviewList =[];
         $(".tab-content-info").find("p").each(function(){
            let text = $(this).html().replaceAll("KINGSHOES.VN","HANSHOP.VN");
            text = text.replaceAll("/data/upload/media","https://kingshoes.vn/data/upload/media")
            reviewList.push(text);
        })

        let result = {images, shoeName, category, newPrice, oldPrice, percentDisount, reviewList, sizeList};
        return result;
    } catch (error) {}
}

async function switchPage(baseurl, atPage) {
    totalPages = 0;
    // crawl single page and all pages
    if (atPage >= 0) {
        let url = atPage < 1 ? baseurl : `${baseurl}?page=${atPage}`;
        await crawlProduct(url, 0);
        return;
    }

    let currentPage = 0;
    do {
        let url = currentPage < 1 ? baseurl : `${baseurl}?page=${currentPage}`;
        await crawlProduct(url, currentPage);
        currentPage++;
    } while (currentPage <= totalPages);
    return;
}

async function crawlTagName() {
    const url = "https://kingshoes.vn";
    try {
        const res = await axios(url);
        let html = res.data;
        const $ = cheerio.load(html);
        $(".navigation__column > .main-menu > .menu-item-has-children").each(function () {
            tagNameList.push($(this).find("a").attr("href"));
            $(this).find(".sub-menu > li").each(function () {
                tagNameList.push($(this).find('a').attr("href"))
            })
        })
    } catch (error) { }
}

// Run

async function runCrawlProductAtPage(atPage) {
    productList.length = 0;

    let baseUrl = `https://kingshoes.vn/san-pham`;
    // because web crawled is from 0 -> n (Crawl web)
    // But this web will show from 1 -> n (My web)
    // Ex: My web: page = 1 => Crawl web: page = 0
    let page = atPage - 1;

    await switchPage(baseUrl, page);
    let sidebarData = await crawlSidebarData(baseUrl);

    return {
        productList,
        totalPages,
        sidebarData
    };
}

async function runCrawlAllProduct() {
    productList.length = 0;
    let baseUrl = `https://kingshoes.vn/san-pham`;
    await switchPage(baseUrl, -100);
    return productList;
}

async function runCrawlAllProductByTagName() {
    tagNameList.length = 0;
    let data = [];
    await crawlTagName();
    for (let tagName of tagNameList) {
        productList.length = 0;
        let url = `https://kingshoes.vn/${tagName}`;
        await switchPage(url, -100);
        data.push({
            tagName,
            "productList": productList
        })

    }
    return data;
}

async function runcrawlProductOfAllSection() {
    let result = {};
    for (let section of ["HOT", "discount", "Accessories", "news", "products"]) {
        let dataSection = await crawlProductOfAllSection(section);
        result[section.toLowerCase()] = dataSection;
    }
    return result;
}

async function runCrawlproductDetail(url){
    return await crawlProductDetail(url);
}

// runCrawlAllProductByTagName();
// runcrawlProductOfAllSection()
// runCrawlProductAtPage(14);
runCrawlAllProduct();
// runCrawlproductDetail("https://kingshoes.vn/superstar-c77124.html");

module.exports = {
    runCrawlAllProductByTagName,
    runcrawlProductOfAllSection,
    runCrawlAllProduct,
    runCrawlProductAtPage,
    runCrawlproductDetail
}
