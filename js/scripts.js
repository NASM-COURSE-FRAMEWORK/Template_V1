
$(document).ready(function() {
		//Load English XML into Elements
		$.ajax({
				url: 'data/english.xml',
				dataType: 'xml',
				success: function(data) {
						//If XML loaded successfuly fade in the Container
						$("#main_container").removeAttr( "style" ).hide().fadeIn(250);
						//Load Content Blocks into Element ID's
						$(data).find ('manifest content').each (function(index){
								var temp1;
								temp1 = "text" + index;
								var block1= $(this).find('block').text();
								document.getElementById(temp1).innerHTML = block1;
						});
							//Load Lesson Title into Element ID's
						$(data).find ('manifest').each (function(){
								var block2= $(this).find('title').text();
								$(".page-header").append(block2);
						});
				},
						error: function() {
						console.log("Failed");
				}
		});

		// content nav listeners
		$( "li" ).click(function() {
		    //$( "#pageload" ).toggleClass( "active" );
		});
		$('li.PageSwap').click(function() {

		});

    var $listItems = $('.pagination li');
    $listItems.click(function(){
        $listItems.removeClass('active');
        $(this).addClass('active');
        var activeLink=$(this);
    });
    $('#arrowPrev').on('click',function(){
        var $activeLi=$('.pagination').find("li.active");
        $activeLi.removeClass('active');
        if($activeLi.prev().length>0 ){
            $activeLi.prev().addClass('active');
        }else{
            $('.pagination').find("li:last").addClass("active")
        }
    });
    $('#arrowNext').on('click',function(){
        var $activeLi=$('.pagination').find("li.active");
        $activeLi.removeClass('active');

        if($activeLi.next().length>0){
            $activeLi.next().addClass('active');
        }else{
            $('.pagination').find("li:first").addClass("active")
        }
    });
		//SCORM Intitialization
		//Declare Scorm Variables
		var scorm = pipwerks.SCORM;  //Shortcut
		var lmsConnected = false;
		initCourse();

		videojs('video1').videoJsResolutionSwitcher()
});



//SCORM Functions
function handleError(msg){
   console.log(msg);
   //window.close();
}


function initCourse(){

   //scorm.init returns a boolean
   lmsConnected = scorm.init();

   //If the scorm.init function succeeded...
   if(lmsConnected){


	   //handleError("You are connected to LMS.");
	   var success = scorm.get("cmi.core.lesson_status", "completed");

      //If the course was successfully set to "completed"...
      if(success){

         //... disconnect from the LMS, we don't need to do anything else.
         scorm.quit();

      //If the course couldn't be set to completed for some reason...
      } else {

         //alert the user and close the course window
         //handleError("Error: Course could not be set to complete!");

      }


      //Let's get the completion status to see if the course has already been completed
      var completionstatus = scorm.get("cmi.core.lesson_status");

      //If the course has already been completed...
      if(completionstatus === "completed" || completionstatus === "passed"){

         //...let's display a message and close the browser window
         //handleError("You have already completed this course. You do not need to continue.");

      }

      //Now let's get the username from the LMS
      var learnername = scorm.get("cmi.core.student_name");

      //If the name was successfully retrieved...
      if(learnername){

         //...let's display the username in a page element named "learnername"
         document.getElementById("learnername").innerHTML = learnername; //use the name in the form

      }

   //If the course couldn't connect to the LMS for some reason...
   } else {

      //... let's alert the user then close the window.
      //handleError("Error: Course could not connect with the LMS");

   }

}


function setComplete(){

   //If the lmsConnection is active...
   lmsConnected = scorm.init();
   if(lmsConnected){

	   //This line will set Course to Complete
	   var success = scorm.set("cmi.core.lesson_status", "completed");
	   //Use this line to set a Score
	   //pipwerks.SCORM.data.set("cmi.core.score.raw",scorm_total);
	   //API.LMSCommit(); //save in database
	   //API.LMSFinish(); //exit course

	   if(success){
      //alert("LMS Connected and Code should have ran");
         //... disconnect from the LMS, we don't need to do anything else.
         scorm.quit();

      //If the course couldn't be set to completed for some reason...
      } else {

         //alert the user and close the course window
         handleError("Error: Course could not be set to complete!");

      }
   }

}
$(function(){
	"use strict";
	$('.PortSwap').hide().eq(0).addClass('active').show();

});

$(function(){
	"use strict";
	$('.PageSwap').eq(0).addClass('active');

});


function prevBtn(){
	var current = $('.PortSwap.active'), prev = current.prev('.PortSwap');
	console.log(prev.length, prev)
	if(prev.length){
			current.hide().removeClass('active');
			prev.addClass('active').hide().fadeIn(250);
	}
}
function nextBtn(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	if(next.length){
			current.hide().removeClass('active');
			next.addClass('active').hide().fadeIn(250);
	}
}
function content1(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content1').addClass('active').hide().fadeIn(250);
}
function content2(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content2').addClass('active').hide().fadeIn(250);
}
function content3(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content3').addClass('active').hide().fadeIn(250);
}
function content4(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content4').addClass('active').hide().fadeIn(250);
}
function content5(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content5').addClass('active').hide().fadeIn(250);
}
function content6(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content6').addClass('active').hide().fadeIn(250);
}
function content7(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content7').addClass('active').hide().fadeIn(250);
}
function content8(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content8').addClass('active').hide().fadeIn(250);
}
function content9(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content9').addClass('active').hide().fadeIn(250);
}
function content10(){
	var current = $('.PortSwap.active'), next = current.next('.PortSwap');
	 current.hide().removeClass('active');
			 $('#Content10').addClass('active').hide().fadeIn(250);
}
