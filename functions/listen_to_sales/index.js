const catalyst = require('zcatalyst-sdk-node');
module.exports = (event, context) => {
	console.log(' in sales listener 111 ');

	const catalystApp = catalyst.initialize(context);
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery("SELECT * FROM Deliveries ORDER BY createdtime DESC LIMIT 1");
	zcqlPromise.then(queryResult => {
	
		if (queryResult.length != 0) {
	//note that you can get the ROWID only when you get the select * . as it shows all the columns.
			  console.log('rowid is ----- ' + queryResult[0].Deliveries.ROWID);
		
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








