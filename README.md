
# Shoes Store

This is an ecommerce website. There are two main roles: normal users and admins. Most of the features on the website require users to log in, we can log in using traditional methods or using Google or Facebook accounts.. Normal users can add products to their shopping cart, make payments, and see the current status of their orders.For the Admin role, there are additional functions such as adding new products and confirming orders.

# Installation
#### 1. Clone the project repository from GitHub by running the following command:

```bash
git clone https://github.com/TrongQuynh/ShoesShop
```

#### 2. Install the project dependencies by running the following command:

```bash
npm start
```

#### 3. Open your web browser and navigate to: http://localhost:8080

#### 4. Import data: 

- **products collection** by using ***productData.json*** in ***data*** folder.

- **user collection** by using ***accounts.json*** in ***data*** folder.
 In ***accounts.json*** have admin account
 * Phonenumber: ***0987685043***
 * Password: ***123123123***

#### 5. Crawl Data: 
To update data of products
```bash
node .\src\data\crawl-data.js 
```

# More Info
* User can login/ register (traditional way or oauth)
* See detail product
* 2 roles: Normal user and Admin user.
* Add/Remove product to cart.
* See order history and order history
* Admin user can CRUD data of product, manage the current status of the order.
