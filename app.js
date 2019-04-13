const express = require ('express');
var xml = require ('xml');
// Set up the express app
const app = express();
const PORT = 9000;

var sids = {};

//get Kookoo query requests
app.get('/', (req, res) => {        
    var event = req.query.event;
	var data = req.query.data;
	SID = req.query.sid;
	console.log("   Request caught.   ");
	console.log(sids);
	console.log(req.query);

	//first action : NewCall
	if (event==="NewCall" ){
		res.set('Content-Type', 'text/xml');
		xmlResponse = xml(
			{ Response : [{ _attr: { sid: SID }}, 
				{collectdtmf : [{ _attr: { l : '1', o: '3000' }}, 
					{playtext : [{ _attr: { quality:'best' }},
					'Enter 1 if you are male Enter 2 if you are female']}
				]}
			]}, 
			{ declaration: true }
		);
		sids[req.query.sid] = "0"; 
		console.log(xmlResponse);
		res.send(xmlResponse);
	}

	//second action : after Gender selection
	else if(event==="GotDTMF"&& sids[req.query.sid]==="0"){
		if ( data==="1" ){
			res.set('Content-Type', 'text/xml');
			xmlResponse = xml(
				{ Response : [{ _attr: { sid: SID }}, 
					{collectdtmf : [{ _attr: { l : '1', o: '3000' }}, 
						{playtext : [{ _attr: { quality:'best' }},
						'Enter 1 if you are above 21 Enter 2 if you are below 21']}
					]}
				]}, 
				{ declaration: true }
			);
			sids[req.query.sid] = "1"; 
			console.log(xmlResponse);
			res.send(xmlResponse);
		}
		else if( data==="2" ){
			res.set('Content-Type', 'text/xml');
			xmlResponse = xml(
				{ Response : [{ _attr: { sid: SID }}, 
					{collectdtmf : [{ _attr: { l : '1', o: '3000' }}, 
						{playtext : [{ _attr: { quality:'best' }},
						'Enter 1 if you are above 18 Enter 2 if you are below 18']}
					]}
				]}, 
				{ declaration: true }
			);
			sids[req.query.sid] = "1"; 
			console.log(xmlResponse);
			res.send(xmlResponse);
		}
		else{
			res.set('Content-Type', 'text/xml');
			xmlResponse = xml(
				{ Response : [{ _attr: { sid: SID }}, 
					{collectdtmf : [{ _attr: { l : '1', o: '3000' }}, 
						{playtext : [{ _attr: { quality:'best' }},
						'Please entry valid input']}
					]}
				]}, 
				{ declaration: true }
			);
			console.log(xmlResponse);
			res.send(xmlResponse);
		}
	}

	//third action : after Age selection
	else if(event==="GotDTMF"&& sids[req.query.sid]==="1"){
		if ( data==="1" ){
			res.set('Content-Type', 'text/xml');
			xmlResponse = xml(
				{ Response : [{ _attr: { sid: SID }},
					{playtext : [{ _attr: { quality:'best' }},
					'You are an adult']},
					{hangup : ''}
				]}, 
				{ declaration: true }
			);
			sids[req.query.sid] = "2"; 
			console.log(xmlResponse);
			res.send(xmlResponse);
		}
		else if(data==="2" ){
			res.set('Content-Type', 'text/xml');
			xmlResponse = xml(
				{ Response : [{ _attr: { sid: SID }},  
						{playtext : [{ _attr: { quality:'best' }},
						'Minors not allowed']},
						{hangup : ''}
				]}, 
				{ declaration: true }
			);
			sids[req.query.sid] = "2"; 
			console.log(xmlResponse);
			res.send(xmlResponse);
		}
		else{
			res.set('Content-Type', 'text/xml');
			xmlResponse = xml(
				{ Response : [{ _attr: { sid: SID }}, 
					{collectdtmf : [{ _attr: { l : '1', o: '3000' }}, 
						{playtext : [{ _attr: { quality:'best' }},
						'Please entry valid input']}
					]}
				]}, 
				{ declaration: true }
			);
			console.log(xmlResponse);
			res.send(xmlResponse);
		}
	}

	//fourth action : Deleting sid logs and handling Diconnect and Hangup events
	else if( event==="Disconnected" || event==="Hangup" || data===""){

		delete sids[req.query.sid];
		res.end();
	}
});

app.listen(PORT, () => {
console.log(`server running on port ${PORT}`)
});
