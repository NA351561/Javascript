// fetch data from json and process those data
$(document).ready(function(){  //prevents the function to be called befor page loads
    $('#searchBtn').click(function(){  // button click function called
      var url="http://www.omdbapi.com/?s="+document.getElementById('searchInput').value; //get input from text box and appedn into url
        $.getJSON(url, function(result){  //get the json from particular url
          if(result.Response=='False'){  // reponse of the page is false
              $('div').remove('#imagesList');  // remove all the present tags
              $('div').remove('#displayAlert');
              var alertMsg="<div class='alert alert-danger' id='displayAlert'>No Movies Found..Try Something New..</div>";
              $('.container').append(alertMsg); //display error msg
          }
          else {                              //reponse of the page is true
            $('div').remove('#displayAlert');  //remove any of the tag present
            var createDiv="<div class='row' id='imagesList'></div>"; //create row tag
           $('div').remove('#imagesList'); //remove any of image list present
            $('.container').append(createDiv);  // append to whole container tag
            $.each(result,function(index,value){  //iterate result json object and get values
            $.each(value,function(key,val){
              if(val.Poster=='N/A') val.Poster="img/No_image_available.png";  //if image is not present use my image
                var createImg="<a href='https://www.google.co.in/search?q="+val.Title+"' target='_blank'>\
                <div class='col-md-4' id='backgroundCss'><div class='thumbnail'><img src='"+val.Poster+"' alt='Image is Loading'>\
                <div class='caption'><p>"+val.Title+"</p><p>"+val.Year+"</p>\
                </div></div></div></a>";
                $('#imagesList').append(createImg); //create image tag and append into row tag
            });

          });
          }
        });
    });
});
