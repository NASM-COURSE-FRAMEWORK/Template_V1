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
		$('.prevNextBtn').click(function(){ prevNext($(this)); });
		$('.PageSwap').click(function(){ swapContent($(this)); });
		//SCORM Intitialization
		//Declare Scorm Variables
		var scorm = pipwerks.SCORM;  //Shortcut
		var lmsConnected = false;
		initCourse();

		videojs('video1').videoJsResolutionSwitcher();
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

function prevNext(btn){
		var $activeLi = $('.pagination').find("li.active");
		$activeLi.removeClass('active');
		var theID = btn.attr('id');
		var current = $('.PortSwap.active');
		var prev = null, next = null;
		if(theID.split('arrow')[1] == 'Prev'){
				prev = current.prev('.PortSwap');
				if(prev.length){
						current.hide().removeClass('active');
						prev.addClass('active').hide().fadeIn(250);
				}
				if($activeLi.prev().length>0 ){
						$activeLi.prev().addClass('active');
				} else {
						$('.pagination').find("li:last").addClass("active")
				}
		} else if(theID.split('arrow')[1] == 'Next'){
				next = current.next('.PortSwap');
				if(next.length){
						current.hide().removeClass('active');
						next.addClass('active').hide().fadeIn(250);
				}
				if($activeLi.next().length>0){
						$activeLi.next().addClass('active');
				} else {
						$('.pagination').find("li:first").addClass("active")
				}
		}
		var $activeEl = $('.pagination').find("li.active");
		swapContent($activeEl);
}

function swapContent(el){
		var current = $('.PortSwap.active'), next = current.next('.PortSwap');
		current.hide().removeClass('active');
		var contentID = '#Content' + el.find('a').attr('id').split('_')[1];
		$(contentID).addClass('active').hide().fadeIn(250);
}
