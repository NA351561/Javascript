<!-- Reading csv file and conevrting into json-->
const readline = require('readline'); //import readline module
const fs = require('fs'); //import filesystem module

<!-- read data from csv file line by line-->
const rl = readline.createInterface({
  input: fs.createReadStream('Production-Department_of_Agriculture_and_Cooperation_1.csv')
});
	var readcsv=[];		//creating empty array store read data values
	rl.on('line', (line) => {
		var txt=line.split(','); //split line by line
		for(i=0;i<txt.length;i++)
		{
	    	readcsv.push(txt[i].trim()); //remove empty space and push into array
		}
	})
	rl.on('close', () => {
  		out(readcsv);    //pass readdata values into out function after all data readed
 		process.exit(0); 
	
		
});
function out(readcsv)
{
		var readdata=readcsv;
		oilseeds();
		// get oil seeds production value for 2013 year
		function oilseeds()
		{
			var fieldvalue=readdata.indexOf('3-2013')+1; //read index value for 2013 column to get values
			
			var oilobj={};			//empty object 
			var oilobjarr=[];		//empty array for storing read values
			for(var i=25;i<readdata.length;i=i+26) //iterating to get all the first column values
			{
				
				var s=(readdata[i].match(/Agricultural Production Oilseeds/i)||[]).length; // string match ignore case to get oil seed values
				if(s>0)
				{
				oilobj[readdata[i]]=readdata[fieldvalue+i]; //store key as oil seeds and value as production value

				}
			
			}
			oilobjarr.push(oilobj);  // pushing object values into array
			
			fs.writeFileSync('oilSeeds_2013.json',JSON.stringify(oilobjarr)); //converting array values into JSON object
			console.log("Oil seed production value for 2013 is converted into JSON\n");
		}

		//get food grains production value for 2013 year
		foodgrains();
		function foodgrains()
		{
			var fieldvalue=readdata.indexOf('3-2013')+1;  //gettinng index value for year 2013
			
			var foodobj={};
			var foodobjarr=[];
			for(var i=25;i<readdata.length;i=i+26)  //iterating to get all the data of name of foodgrains
			{
				
				var s1=(readdata[i].match(/Agricultural Production Foodgrains/i)||[]).length; //contain only foodgrains
				var s2=(readdata[i].match(/Area/i)||[]).length; //it should not contain area
				var s3=(readdata[i].match(/yield/i)||[]).length; //it should not contain yield
				var s4=(readdata[i].match(/volume/i)||[]).length; //it should not contain volume
				var s5=(readdata[i].match(/Production Foodgrains/g)||[]).length; //contain only one production foodgrains
				if(s1==1&&s2==0&&s3==0&&s4==0&&s5==1)
				{
				foodobj[readdata[i]]=readdata[fieldvalue+i]; //storing read values as key value pair

				}
			
			}
			foodobjarr.push(foodobj); //pushing object into array
			fs.writeFileSync('FoodGrains_2013.json',JSON.stringify(foodobjarr)); //convert into json file
			console.log("food grains of 2013 production value is converted into JSON\n");
		}

		//Aggregate value of commercial crops
		commercialCrops();
		function commercialCrops()
		{
			var comobj={};  
			var comobjarr=[];
			for(f=3;f<25;f++)
			{
				var total=0; //aggregate value calculation
				var num=0; //count number of commercial crops
				for(var i=25;i<readdata.length;i=i+26)
				{
						
					var s1=(readdata[i].match(/Agricultural Production Commercial Crops/i)||[]).length; //match for only commercial crops					if(s1>0)
					{
						num++;
						var temp=readdata[f+i+1]; //values of one year
						if(temp=='NA')   // if 'NA' means assign as 0
						{
							temp=0;
							total+=temp;
						}
						total+=parseInt(temp); //sum of the total values


					}
					
				}
				comobj[readdata[f]]=(total)/num; //average of the values of one year
			}
			comobjarr.push(comobj);  //push all the values into array
			fs.writeFileSync('CommercialCropsVsProduction.json',JSON.stringify(comobjarr)); //converting into JSON
			console.log('Aggregate value of Commercial crops for all the years is converted into JSON\n');
		}
		
		//Rice production for southern States
		southStates();
		function southStates()
		{
			var southobj={};
			var southarr=[];
			for(f=3;f<25;f++)
			{
				var stateobj={};
				var statearr=[];
				for(var i=25;i<readdata.length;i=i+26)  //iterating to get all the values
				{
						//read only four states values
					var s1=(readdata[i].match(/Agricultural Production Foodgrains Rice Yield Andhra Pradesh/i)||[]).length;
					var s2=(readdata[i].match(/Agricultural Production Foodgrains Rice Yield Karnataka/i)||[]).length;
					var s3=(readdata[i].match(/Agricultural Production Foodgrains Rice Yield Kerala/i)||[]).length;
					var s4=(readdata[i].match(/Agricultural Production Foodgrains Rice Yield Tamil Nadu/i)||[]).length;
					if(s1>0||s2>0||s3>0||s4>0)
					{
						
							stateobj[readdata[i]]=readdata[f+i+1];  //store values for patricular state

					}
					
				}
				statearr.push(stateobj); //push into array
				southobj[readdata[f]]=statearr; //key as year and value as all state values and object
			}
			southarr.push(southobj); //push into array
			fs.writeFileSync('SouthernStates.json',JSON.stringify(southarr)); //convert into JSON
			console.log('Rice Production of 4 Southern States is converted into JSON');
			
		}
}