# EventListener
Event-driven Programming using FaaS with Zoho Catalyst

Functions-as-a-Service are typically used for Event-driven Programming. So this is about Catalyst’s approach toward Event-driven programming.

Let us begin.

So let me start off with a story. 

We have a Seller and we have a Delivery guy.

Imagine that when a sale happens, the details of the sale is entered into a table called as Sales.  As soon as an entry happens into the Sales table, a notification is generated that triggers the Sales Listener. The Sales Listener as part of its execution, changes the status of the first available Delivery guy to BUSY. This happens as an update to the Deliveries table. So this in turn triggers a notification that triggers the Deliveries Listener in which a mail is sent to the Delivery guy asking him to go and pickup the delivery from the Seller.

Fair enough ?

So let us login to Catalyst at catalyst.zoho.com

Let us make two tables first. 
Go to the Data Store link and create a table called Sales. Create 2 columns in it called Name and Qty.

Make another table called Deliveries. Create 3 columns in it called - name, Status and Email.

So login to at catalyst.zoho.com and create a new SalesListener.

Now go to the command line and create a folder saleslistener.

Then cd to the saleslistener folder.

Run catalyst init

Choose Functions

Choose the project SalesListener

That is it

Now you will find a structure like this inside the saleslistener folder.

  * catalyst.json
  * functions


cd functions



Now we have an empty folder. Now we need to create a folder for the listener function that has the magic in it. 

So type as follows -





shankarr-0701@shankarr-0701 functions % catalyst functions:add 



===> Functions Setup

 which type of function do you like to create ? 

  BasicIO 

❯ Event 

  Cron 





Choose BasicIO

 Which stack do you prefer to write your function? (Use arrow keys)

❯ node10 

  java8 



Choose node10



Now you will need to give the name of the listener function. Let us give as listen_to_sales.

Then just click on Enter for the rest and voila!, you have a folder with some default code ready.



shankarr-0701@shankarr-0701 listen_to_sales % ls

 - catalyst-config.json
 - index.js
 - package-lock.json
 - node_modules
 - package.json

Now let us proceed to put some substance in our index.js file. This is the heart of the process. This is the listener which will be invoked when some event happens. 

I will tell you in a short while how to link it to the Sales table. For now, copy the code and paste in your index.js file.



const catalyst = require('zcatalyst-sdk-node');

module.exports = (event, context) => {

   

    const catalystApp = catalyst.initialize(context);

    let zcql = catalystApp.zcql();

    let zcqlPromise = zcql.executeZCQLQuery("SELECT * FROM Deliveries ORDER BY createdtime DESC LIMIT 1");

    zcqlPromise.then(queryResult => {

    

        if (queryResult.length != 0) {

  			  //note that you can get the ROWID only when you get the select * . as it shows all the columns.

           //   console.log('rowid is ----- ' + queryResult[0].Deliveries.ROWID);

        

        }

        let updatedRowData = {

            Status: `Busy`,

            ROWID: queryResult[0].Deliveries.ROWID

        };

        let datastore = catalystApp.datastore();

        let table = datastore.table('Deliveries');

        let rowPromise = table.updateRow(updatedRowData);

        rowPromise.then((row) => {

            console.log('updated row - ' + row);

            context.closeWithSuccess();

        });

    });

}













The input to the program is the event and context parameters. 

Whatever you need to do, you have to refer these two parameters only. They are our two levers to change the world. 



The next step is to link the Sales Listener code that you have above to the Sales table. This is how you do it.


![Screenshot](https://github.com/shankar-tester901/EventListener/blob/master/Screenshot%202019-12-05%20at%2010.43.46%20AM.png)



Since we are working on the heart of the system, we need to ensure that we get all the packages installed.

So go to saleslistener folder and then install using npm install —-save request, catalyst-sdk-node.





Now, you need to create another event listener (remember for the Deliveries table). 

So again, as earlier, do the following.



shankarr-0701@shankarr-0701 functions % catalyst functions:add 



===> Functions Setup

 which type of function do you like to create ? 

  BasicIO 

❯ Event 

  Cron 





Choose BasicIO

 Which stack do you prefer to write your function? (Use arrow keys)

❯ node10 

  java8 



Choose node10



Now you will need to give the name of the listener function. Let us give as listen_to_deliveries.

Then just click on Enter for the rest and voila!, you have a folder with some default code ready.



shankarr-0701@shankarr-0701 listen_to_deliveries % ls

catalyst-config.json
index.js
package-lock.json
node_modules
package.json

Open the index.js file in the listen_to_deliveries folder and paste the following code :



const catalyst = require('zcatalyst-sdk-node');



module.exports = (event, context) => {



    const catalystApp = catalyst.initialize(context);

    try{

        console.log('Hello from  listen_to_deliveries ');

        let config = {

            from_email: 'shankarr+1001@zohocorp.com',

            to_email: 'shankarr+1001@zohocorp.com',

            subject: 'Pickup Delivery ',

            content: "A sale has occurred. Pls pickup delivery from vendor"

        };





        //Send the mail by passing the config object to the method which in turn returns a promise

        let email = catalystApp.email();

        let mailPromise = email.sendMail(config);

        mailPromise.then((mailObject) => {

            console.log("Mail sent successfully!");

            context.closeWithSuccess();

        });

    }

    catch(err){

        console.log("Error"+err);

    }

    

};





As usual, ensure that you have all the packages added.



Now how to test this ? That is interesting.

Go to the Data Store. Go to the Sales table and add an entry.

Wait for 10 mins and you will receive the email with the message - “A sale has occurred. Pls pick up delivery from the vendor”

You can verify if the event triggers have been invoked or not by going to the Event Listeners link. Click on any of the listeners.

<insert snapshot pls>



Number of Requests





10

0

1

2

3

4

5

6

7

10

No. of Request : 6

Started Time

Execution Time(ms)

Status

Dec 26, 2019 10:47:51:652 AM

1164

Success

Dec 26, 2019 10:37:07:656 AM

1114

Success

Dec 26, 2019 10:37:06:674 AM

955

Success

Dec 26, 2019 10:37:05:626 AM

1019

Success

Dec 26, 2019 10:37:04:472 AM

1138

Success





