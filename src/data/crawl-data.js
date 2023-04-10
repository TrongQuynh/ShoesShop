const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

let productList = [];
let postList = [];
let totalPages = 0;
let productType = "";

function isSlugExit(slug) {
    return productList.filter((product) => product.slug == slug).length > 0 ? true : false;
}

function isExistProductCode(productCode){
    return (productList.filter((product) => product.productCode == productCode)).length > 0 ? true : false;
}

function generateSlug(str, productCode) {
   
    str = str.includes("/") ? str.replaceAll("/","-") : str;
    
    let slug = str.toLocaleLowerCase().replaceAll(" ", "-");
    while (isSlugExit(slug)) {
        slug = isSlugExit(str) ? `${str}-${productCode}-${Date.now()}` : str;
    }
    return slug;
}

function getRandomQuantity() {
    let min = 0, max = 200;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function crawlProductDetail(url) {
    try {
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);

        let productImgs = [];
        $(".ps-product__preview").find(".item").each(function () {
            let image = $(this).find("img").attr("src");
            productImgs.push(image);
        })

        let productName = $(".ps-product__info").find("h1").text();

        let productCode = $(".ps-product__category > strong").text();
        while(isExistProductCode(productCode) || productCode == ""){
            let tmp = String(productName.replaceAll(' ','')).toUpperCase();
            productCode = (tmp.slice(tmp.length > 4 ? 4 : tmp.length)) + String(getRandomQuantity() + 55);
            console.log(productCode);
        }
        

        let newPrice = $(".ps-product__price > .new-price").text();
        newPrice = Number(newPrice.replace(/,/g, "").replace(/ đ/g, ""));
        let oldPrice = $(".ps-product__price > .old-price").text();
        oldPrice = Number(oldPrice.replace(/,/g, "").replace(/ đ/g, ""));
        let discount = $(".ps-product__thumbnail > .product-label-group")
            .find(".ps-badge--sale > span")
            .text()
            .replaceAll("%", "").replaceAll("-", "");
        discount = Number(discount);
        if (!oldPrice) {
            oldPrice = 0;
            discount = 0;
        }else{
            newPrice = oldPrice;
        }
        let productSize = [];
        $("ul.wapper_cb > li.cb").each(function () {
            let size = $(this).find(".rd_in").text();
            productSize.push(size);
        })
        // let reviewList =[];
        //  $(".tab-content-info").find("p").each(function(){
        //     let text = $(this).html().replaceAll("KINGSHOES.VN","HANSHOP.VN");
        //     text = text.replaceAll("/data/upload/media","https://kingshoes.vn/data/upload/media")
        //     reviewList.push(text);
        // })
        let slug = generateSlug(productName, productCode);

        function randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }

        let quantity = getRandomQuantity();

        let note = "";

        let status = true;

        let createdAt = randomDate(new Date(2022, 0, 1), new Date());
        let result = {
            productImgs, productName, productCode, newPrice
            , discount, productSize, slug, productType, createdAt, quantity, note, status
        };
        return result;
    } catch (error) {

    }
}

async function crawlAccessoriesLink() {
    let url = `https://kingshoes.vn/`
    try {
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);

        let preProductList = [];
        $(".ps-owl-root.ps-section").each(function (index, el) {
            let title = $(this).find(".ps-section__title").attr("data-mask");
            if (title === "Accessories") {
                $(this).find(".ps-shoes--carousel > .ps-shoe").each(function () {
                    let productLink = $(this).find(".ps-shoe__name").attr("href");
                    productLink = productLink.replaceAll("./", "https://kingshoes.vn/");
                    let isNewProduct = $(this).find(".product-label > span").text().includes("New") ? true : false;
                    let isHotProduct = $(this).find(".label-hot").text() ? true : false;
                    preProductList.push({ productLink, isHotProduct, isNewProduct });
                })
            }
        })
        productType = "Accessories";
        for (let preProduct of preProductList) {

            let product = await crawlProductDetail(preProduct.productLink);
            product.isHotProduct = preProduct.isHotProduct;
            product.isNewProduct = preProduct.isNewProduct;
            console.log(product);
            productList.push(product);
        }
        preProductList.length = 0;

        return result;
    } catch (error) {

    }
}

async function crawlPostData() {
    let url = `https://kingshoes.vn/san-pham`;
    try {
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);
        function randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }

        $("aside.ps-widget--sidebar").each(function (index, el) {
            let header = $(this).find(".ps-widget__header > h3").text();
            if (header == "Tin tức mới") {
                $(this).find(".ps-post--sidebar").each(function () {
                    let postImgs = $(this).find(".ps-post__thumbnail > img").attr("data-src");
                    let title = $(this).find(".ps-post__title").text();
                    let createdAt = randomDate(new Date(2022, 0, 1), new Date());

                    postList.push({ postImgs, title, createdAt });
                })
            }
        })
    } catch (error) { }
}

async function crawlHotandNewsProductLink() {
    try {
        let url = `https://kingshoes.vn`;
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);

        let result = {};

        $(".ps-owl-root.ps-section").each(function (index, el) {
            let title = $(this).find(".ps-section__title").attr("data-mask");
            // Ex: if(title === "HOT")
            let data = [];
            if (title === "HOT") {
                $(this).find(".ps-shoes--carousel > .ps-shoe").each(function () {
                    let productLink = $(this).find(".ps-shoe__name").attr("href");
                    productLink = productLink.replaceAll("./", "https://kingshoes.vn/");
                    data.push(productLink);
                })
                result[title.toLocaleLowerCase()] = data;
            }
        })

        let data = [];
        $(".ps-section--features-product").find(".ps-shoe").each(function (index, el) {
            let productLink = $(this).find(".ps-shoe__name").attr("href");
            productLink = productLink.replaceAll("./", "https://kingshoes.vn/");
            data.push(productLink);
        })

        result["products"] = data;
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function crawlProductLink(url, currentPage) {
    try {
        // array shoes
        const res = await axios(url);
        const html = res.data;
        const $ = cheerio.load(html);

        let preProductList = [];
        let hotProduct = (await crawlHotandNewsProductLink()).hot;
        let newProduct = (await crawlHotandNewsProductLink()).products;
        // Crawl data
        $(".itemPro").each(async function (index, el) {
            // https://kingshoes.vn/air-max-pre-day-be-true-dd3025-400-5555.html
            let productLink = $(this).find(".ps-shoe__detail > .ps-shoe__name").attr("href");
            productLink = productLink.replaceAll("./", "https://kingshoes.vn/");

            let isNewProduct = newProduct.includes(productLink) ? true : false;
            let isHotProduct = hotProduct.includes(productLink) ? true : false;

            preProductList.push({ productLink, isHotProduct, isNewProduct });
        })
        productType = "Shoes";
        for (let preProduct of preProductList) {
            let product = await crawlProductDetail(preProduct.productLink);
            product.isHotProduct = preProduct.isHotProduct;
            product.isNewProduct = preProduct.isNewProduct;
            productList.push(product);
        }
        preProductList.length = 0;
        if (currentPage == 0) {
            // Check if have a next page
            let href = $(".ps-pagination > .pagination >.page-item:last > a").attr("href");
            totalPages = href ? href.replaceAll("https://kingshoes.vn/san-pham?page=", "") : 0;
        }


    } catch (error) {
        console.log(error);
    }
}

async function switchPage(baseurl) {
    totalPages = 0;

    let currentPage = 0;
    do {
        let url = currentPage < 1 ? baseurl : `${baseurl}?page=${currentPage}`;
        await crawlProductLink(url, currentPage);
        currentPage++;
    } while (currentPage <= totalPages);
    return;
}

async function run() {

    productList.length = 0;
    let baseUrl = `https://kingshoes.vn/san-pham`;
    await switchPage(baseUrl);

    await crawlAccessoriesLink();
    console.log(productList);
    await saveFile("products");


    // productList.length = 0;
    // await crawlPostData();
    // console.log(postList);
    // await saveFile("post");
}

async function saveFile(collection) {
    let content = productList;
    let fileName = 'productData.json';
    if (collection == "post") {
        fileName = "postData.json"
        content = postList;
    }
    await fs.writeFileSync(`${__dirname}/${fileName}`, JSON.stringify(content));
    console.log(`"Write ${fileName} success"`);
    // fs.writeFile(`${__dirname}/${fileName}`, JSON.stringify(content), err => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     console.log(`"Write ${fileName} success"`);
    // });

}



run();
// crawlProductDetail("https://kingshoes.vn/yeezy-boost-350-v2-black-red-cp9652-5993.html")

// module.exports = {
//     runCrawlAllProduct
// }