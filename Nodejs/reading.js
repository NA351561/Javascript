var fs = require('fs');

fs.readFile('Production-Department_of_Agriculture_and_Cooperation_1.csv','utf-8', function (err, data) {
    if (err)
    	console.log(err);
    else
    { 
    	var txt=data.split(',');
    	for(var i of txt)
    		{
    		    	console.log(i);
    		 }
    }
});