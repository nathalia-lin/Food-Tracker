# Food-Tracker
Title: Happy Eats

https://happyeats.herokuapp.com/

**OVERVIEW:**

As a college student and a foodie, trying to budget and achieve ideal weight seems so hard, especially when there are so many good foods around you. Happy Eats helps solve these problem by helping you keep track of your daily expenses and calorie intake. 

Happy Eats is a web app that allow users to keep track of their expenses and calories intake. Users can register and login. Once they’re logged in, everyday they can add, read, and delete the food they’ve eaten and money spent. For every expense they add, it will add to their total expenses. If they delete anything, it will also be removed from their total expense. 

 
**DATA MODEL:**

The application will store Users, Day, and Food
- Each user can have multiple days (reference)
- Each user can have multiple food items (embedding)
 
User
```
{
	username: // an username
	daily budget: // a value
	daily calorie intake: // a value
}
```

Day
```
{
	user: // reference to User
	details: [ //reference to Food ]
	date: // a value
}
```

Food
```
{
	food: // food name or description
	price: // a value
	cal: // a value
	date: // a value
}
```

**[LINK TO COMMENTED FIRST DRAFT SCHEMA](https://github.com/nyu-csci-ua-0480-001-003-fall-2018/nathalia-lin-final-project/blob/master/src/db.js)**

 
**WIDEFRAME:**

/happyeats - home page that displays daily expense and calorie

![alt text](https://github.com/nyu-csci-ua-0480-001-003-fall-2018/nathalia-lin-final-project/blob/master/Documentation/happyeats.jpg)

/details - displays all the inputs separated based on dates

![alt text](https://github.com/nyu-csci-ua-0480-001-003-fall-2018/nathalia-lin-final-project/blob/master/Documentation/details.jpg)

/add - form to add new food 

![alt text](https://github.com/nyu-csci-ua-0480-001-003-fall-2018/nathalia-lin-final-project/blob/master/Documentation/add.jpg)


**SITE MAP:**
```
	-------------
	| HAPPYEATS |
	-------------
	   /       \
	——————————-   ———————
	| DETAILS |   | ADD |
	——————————-   ———————
```

**USER STORIES OR USE CASES:**

1. As non-registered user, I can register a new account with the site
2. As a user, I can log in to the site
3. As a user, I can view at my overall food expense
4. As a user, I can view my detailed food expense
5. As a user, I can add to my daily food expense
6. As a user, I can remove my daily food expense
7. As a user, I can modify my daily food expense

**ANNOTATIONS / REFERENCES USED:**

1. http://www.passportjs.org/docs/authenticate/
2. https://getbootstrap.com/docs/4.1/getting-started/introduction/
3. https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274

 
 
 
