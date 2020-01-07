const catalyst = require('zcatalyst-sdk-node');

module.exports = (event, context) => {

	const catalystApp = catalyst.initialize(context);
	try{
		console.log('Hello from  listen_to_deliveries ');
		let config = {
			from_email: 'shankarr+1001@zohocorp.com',
			to_email: 'md.nishath4@gmail.com',
			subject: 'Pickup Delivery ',
			content: "A sale has occured. Pls pickup delivery from vendor"
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

