
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

# Usage technology
#### ***Front-End :***
* ***EJS template, Bootstrap 4, HTML,CSS.***
#### ***Back-End :***
* ***NodeJS, ExpressJS, MongoDB,.***
* Mongoose library, JWT, passport, cheerio.

# More Info
* User can login/ register (traditional way or oauth)
* See detail product
* 2 roles: Normal user and Admin user.
* Add/Remove product to cart.
* See order history and order history
* Admin user can CRUD data of product, manage the current status of the order.

# Picture Demo
#### ***Home Page***
![image](https://user-images.githubusercontent.com/90363223/231155762-37f0ebad-71e5-4269-8d30-5f8181af1828.png)
![image](https://user-images.githubusercontent.com/90363223/231157145-98d3f5d1-9e85-4bc8-91d0-16edc11c85d6.png)
![image](https://user-images.githubusercontent.com/90363223/231157201-d824427e-c582-4fcb-864e-04f75d7867f4.png)
![image](https://user-images.githubusercontent.com/90363223/231157269-5f437e23-c38c-46c3-b0b8-0632f6f053fb.png)
#### ***Register/Login***
![image](https://user-images.githubusercontent.com/90363223/231157497-d1e1292a-b29a-43a3-a203-92dcc9bc9578.png)
![image](https://user-images.githubusercontent.com/90363223/231157340-9b60930a-3aac-4a65-9ee8-3c48ada35fba.png)
#### ***Product Detail***
![image](https://user-images.githubusercontent.com/90363223/231157704-91ae937e-1cf1-4b28-ae47-a1ee526b1897.png)

#### ***Cart***
![image](https://user-images.githubusercontent.com/90363223/231158839-5cd45d55-e241-4ba0-ae06-26a7504b181d.png)
![image](https://user-images.githubusercontent.com/90363223/231157893-dd6f5143-bab0-4b5a-a9e6-fdd68715620e.png)
![image](https://user-images.githubusercontent.com/90363223/231158928-068b0046-34d6-463a-85c0-72c48585d14b.png)
#### ***Admin Management***
![image](https://user-images.githubusercontent.com/90363223/231159035-1b0204d1-4947-480f-a8c8-16a0a1cc992b.png)







