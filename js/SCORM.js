
  


//SCORM Functions
function handleError(msg){
   alert(msg);
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
