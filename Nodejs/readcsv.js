<!-- Reading csv file and converting into json-->
const readline = require('readline'); //import readline module
const fs = require('fs'); //import filesystem module

<!-- read data from csv file line by line-->
const rl = readline.createInterface({
  input: fs.createReadStream('Production-Department_of_Agriculture_and_Cooperation_1.csv')
});
	var readcsv=[];		//creating empty array store read data values
	rl.on('line', (line) => {
		var txt=line.split(','); //split line by line
		for(index=0;index<txt.length;index++)
		{
	    	readcsv.push(txt[index].trim()); //remove empty space and push into array
		}
	})
	rl.on('close', () => {
    gettingData(readcsv);    //pass readdata values into out function after all data read
 		//process.exit(0);
});
function gettingData(readcsv)
{
		var readdata=readcsv;
		oilseeds();
		// get oil seeds production value for 2013 year
		function oilseeds()
		{
			var fieldvalue=readdata.indexOf('3-2013'); //read index value for 2013 column to get values
			var oilobjarr=[];		//empty array for storing read values
			for(var i=25;i<readdata.length;i=i+26) //iterating to get all the first column values
			{
				var oilobj={};			//empty object
				var s=(readdata[i].match(/Agricultural Production Oilseeds /i)||[]).length; // string match ignore case to get oil seed values
				if(s>0)
				{
					var temp=readdata[fieldvalue+i+1];
					if(temp=='NA') //converting 'NA' into 0
					{
						temp=0;
					}
					oilobj[readdata[0]]=readdata[i].replace('Agricultural Production Oilseeds ','');
					oilobj['value']=Number(temp); //store key value pair
					oilobjarr.push(oilobj);  // pushing object values into array

				}

			}
			fs.writeFileSync('oilSeeds_2013.json',JSON.stringify(oilobjarr)); //converting array values into JSON object
			console.log("Oil seed production value for 2013 is converted into JSON\n");
		}

		//get food grains production value for 2013 year
		foodgrains();
		function foodgrains()
		{
			var fieldvalue=readdata.indexOf('3-2013');  //getting index value for year 2013
			var foodobjarr=[];
			for(var i=25;i<readdata.length;i=i+26)  //iterating to get all the data of name of foodgrains
			{
				var foodobj={};

				var s1=(readdata[i].match(/Agricultural Production Foodgrains /i)||[]).length; //contain only foodgrains
				var s2=(readdata[i].match(/Area/i)||[]).length; //it should not contain area
				var s3=(readdata[i].match(/yield/i)||[]).length; //it should not contain yield
				var s4=(readdata[i].match(/volume/i)||[]).length; //it should not contain volume
				var s5=(readdata[i].match(/Production Foodgrains/g)||[]).length; //contain only one production foodgrains
				if(s1==1&&s2==0&&s3==0&&s4==0&&s5==1)
				{
					var temp=readdata[fieldvalue+i+1];
						if(temp=='NA') //converting 'NA' into 0
						{
							temp=0;
						}
					foodobj[readdata[0]]=readdata[i].replace('Agricultural Production Foodgrains ','');
					foodobj['value']=Number(temp); //storing read values as key value pair
					foodobjarr.push(foodobj); //pushing object into array
				}

			}

			fs.writeFileSync('FoodGrains_2013.json',JSON.stringify(foodobjarr)); //convert into json file
			console.log("food grains of 2013 production value is converted into JSON\n");
		}

		//Aggregate value of commercial crops
		commercialCrops();
		function commercialCrops()
		{

			var comobjarr=[];
			for(f=3;f<25;f++)
			{
        var comobj={};
				var total=0; //aggregate value calculation
				for(var i=25;i<readdata.length;i=i+26)
				{

					var strcmp1=(readdata[i].match(/Agricultural Production Commercial Crops/i)||[]).length; //match for only commercial Crops
          var strcmp2=(readdata[i].match(/and/i)||[]).length; //eleminate 2 types of crops
					if(strcmp1>0&&strcmp2==0)
					{

						var temp=readdata[f+i+1]; //values of one year
						if(temp==='NA')   // if 'NA' means assign as 0
						{
							temp=0;
							total+=temp;
						}
						total+=Number(temp); //sum of the total values
					}

				}
        comobj['year']=readdata[f];
				comobj['value']=total; //aggregate value of one year
        comobjarr.push(comobj);  //push all the values into array
			}

			fs.writeFileSync('CommercialCrops.json',JSON.stringify(comobjarr)); //converting into JSON
			console.log('Aggregate value of Commercial crops for all the years is converted into JSON\n');
		}

		//Rice production for southern States
		southStates();
		function southStates()
		{
      var statearr=[]; //store all state values
      for(fieldvalue=3;fieldvalue<25;fieldvalue++)
      {
          var stateobj={}; //empty object to store values
          for(var i=25;i<readdata.length;i=i+26) //iterating to get all the values
          {
            stateobj['year']=readdata[fieldvalue];
            //read only four states values
            var s1=(readdata[i].match(/Agricultural Production Foodgrains Rice Yield Andhra Pradesh/i)||[]).length;
            var s2=(readdata[i].match(/Agricultural Production Foodgrains Rice Yield Karnataka/i)||[]).length;
            var s3=(readdata[i].match(/Agricultural Production Foodgrains Rice Yield Kerala/i)||[]).length;
            var s4=(readdata[i].match(/Agricultural Production Foodgrains Rice Yield Tamil Nadu/i)||[]).length;
            if(s1>0||s2>0||s3>0||s4>0)
            {
              var temp=readdata[fieldvalue+i+1];
              if(temp=='NA')
              {
                temp=0;
              }
              stateobj[readdata[i].replace('Agricultural Production Foodgrains Rice Yield ','')]=Number(temp);
            }
          }
          statearr.push(stateobj); //push into array
      }
      fs.writeFileSync('SouthernStates.json',JSON.stringify(statearr)); //convert into JSON
      console.log('Rice Production of 4 Southern States is converted into JSON');
		}
}
