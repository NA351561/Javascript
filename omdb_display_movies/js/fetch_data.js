// fetch data from json and process those data
$(document).ready(function(){  //prevents the function to be called befor page loads
    $('#searchBtn,#searchInput').on('click keyup',function(){  // button click function called
      var url="http://www.omdbapi.com/?s="+document.getElementById('searchInput').value; //get input from text box and appedn into url
        $.getJSON(url, function(result){  //get the json from particular url
          if(result.Response=='False'){  // reponse of the page is false
              $('div').remove('#imagesList');  // remove all the present tags
              $('div').remove('#displayAlert');
              $('div').remove('#imgPagination');
              var alertMsg="<div class='alert alert-success' id='displayAlert'>No Movies Found..Try Something New..</div>";
              $('.container').append(alertMsg); //display error msg
          }
          else {                              //reponse of the page is true
            $('div').remove('#displayAlert');  //remove any of the tag present
            $('div').remove('#imgPagination');
            var createDiv="<div class='row' id='imagesList'></div>"; //create row tag
            var createPagination="<div class='row' id='imgPagination'><ul class='pagination'></ul></div>"; //creating pagination
           $('div').remove('#imagesList'); //remove any of image list present
            $('.container').append(createDiv);  // append div tag to whole container tag
            var idArray=[]; //create empty array to store id;
            $.each(result.Search,function(key,val){ //iterate result json object and get values
              var imgId='id'+key;  //create id for each image
              idArray.push(imgId);
              if(val.Poster=='N/A') val.Poster="img/No_image_available.png";  //if image is not present use my image
                var createImg="<a class='hidding' id='"+imgId+"' href='https://www.google.co.in/search?q="+val.Title+"' target='_blank'>\
                <div class='col-md-4'><div class='thumbnail'><img src='"+val.Poster+"' alt='Image is Loading'>\
                <div class='caption'><p>"+val.Title+"</p><p>"+val.Year+"</p>\
                </div></div></div></a>";
                $('#imagesList').append(createImg); //create image tag and append into row tag
            });//end of value foreach
            var pageLength=Math.ceil(idArray.length/3); //finding number of pages
            if(idArray.length>3) //if imagesList are greater than 3 create pagination
            {
              $('.container').append(createPagination);
              for(var index=0;index<pageLength;index++){
              var createPages="<li><a class='anchor' id='"+index+"' href='#'>"+(index+1)+"</a></li>"

                $('.pagination').append(createPages);
              }
            }
            var tempArray=idArray.slice();
            (tempArray.splice(0,3)).forEach(function(value,index){
              $('#'+value).removeClass('hidding');
          });

            $('.anchor').on('click',function () {
              var curId=$(this).attr('id');
              var tempArray=idArray.slice();
              var tempArray2=tempArray.splice(3*curId,3);
              tempArray2.forEach(function (value,index) {
                $("#"+value).removeClass("hidding");
              })
              tempArray.forEach(function (value,index) {
                $("#"+value).removeClass("hidding");
                $("#"+value).addClass("hidding");
              })
            })
        } //end of else
        });
    });
});
