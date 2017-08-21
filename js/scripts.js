$(document).ready(function () {
	//Create Progress bars
	createProgress();
	//Load English XML into Elements
	$.ajax({
		url: 'data/english.xml',
		dataType: 'xml',
		success: function (data) {
			//If XML loaded successfuly fade in the Container
			$("#main_container").removeAttr("style").hide().fadeIn(250);
			//Load Content Blocks into Element ID's
			$(data).find('manifest content').each(function (index) {
				var temp1;
				temp1 = "text" + index;
				var block1 = $(this).find('block').text();
				document.getElementById(temp1).innerHTML = block1;
			});
			//Load Lesson Title into Element ID's
			$(data).find('manifest').each(function () {
				var block2 = $(this).find('title').text();
				$(".page-header").append(block2);
			});
		},
		error: function () {
			console.log("Failed");
		}
	});

	//load pagination based on number of content divs
	var numContentBlocks = $('.PortSwap').length;
	

	for (var i = 1; i <= numContentBlocks; i++) {
		$('#mainPagination').append('<li class="PageSwap' + ((i == 1) ? ' active' : '') + '"><a href="#" id="page_' + i + '">' + i + '</a></li>');
	}

	$('.prevNextBtn').click(function () {
		//Run Progress Bar Update.  Must only run once per Content Page
		runProgressBar();
		prevNext($(this));
	});
	$('.PageSwap').click(function () {
		//Run Progress Bar Update.  Must only run once per Content Page
		runProgressBar();
		prevNext($(this));
	});


	//SCORM Intitialization
	//Declare Scorm Variables
	var scorm = pipwerks.SCORM; //Shortcut
	var lmsConnected = false;
	initCourse();

	videojs('video1').videoJsResolutionSwitcher();


});



//Config For Learning Objective Variables. 
//Lesson Set Item must be Unique per Learning Objective.
//Chapter Set Item must be unique per SCORM file or Chapter
// USE FIND AND REPLACE TO UPDATE ALL LESSON AND CHAPTER ID'S.


//Lesson Length
var lessonLength = 10;
//Chapter Length
var chapterLength = 50;
//Course Length
var courseLength = 452;


//Declare Progress Bar Variables and Store them Locally.
if (typeof (Storage) !== "undefined") {
	//Check if Lesson is Set to Zero.
	//Update Lesson Local Storate ID Per Lesson
	alert(localStorage.c01l01);
	if ((localStorage.c01l01 >= 0) || (localStorage.c01l01 === "undefined")) {
		//alert("test");
		localStorage.setItem("ch01", [1 / chapterLength * 100]);
		//Update Lesson Local Storate ID Per Lesson
		localStorage.setItem("c01l01", [1 / lessonLength * 100]);
		localStorage.setItem("c", [1 / courseLength * 100]);
	}
} else {
	// Sorry! No Web Storage support..
	alert("No Local Storage");
}

// Lesson Progress
//Update Lesson,Chapter Local Storate ID Per Lesson
var lessonProg = Number(localStorage.c01l01);

//Chapter Progress
var chapterProg = Number(localStorage.ch01);

//Course Progress
var courseProg = Number(localStorage.c);



//Dev Function to Remove Local Storage
function removeStorage() {
	localStorage.setItem("ch01", "undefined");
	//Update Lesson,Chapter Local Storate ID Per Lesson
	localStorage.setItem("c01l01", "undefined");
	localStorage.setItem("c", "undefined");
}

//Create Progress Bar Function
function createProgress() {

	circle1 = new ProgressBar.Line('#lesson_progess', {
		color: '#000',
		easing: 'easeOut',
		strokeWidth: 8,
		duration: 1500,
		text: {
			value: '0'
		}
	});

	circle2 = new ProgressBar.Line('#chapter_progress', {
		color: '#000',
		easing: 'easeOut',
		strokeWidth: 8,
		duration: 1500,
		text: {
			value: '0'
		}
	});

	circle3 = new ProgressBar.Line('#course_progress', {
		color: '#000',
		easing: 'easeOut',
		strokeWidth: 8,
		duration: 1500,
		text: {
			value: '0'
		}
	});


	circle1.animate((lessonProg / 100), {
		from: {
			color: '#fff'
		},
		to: {
			color: '#ffd920'
		},
		step: function (state, circle, bar) {
			circle.path.setAttribute('stroke', state.color);
			console.log(circle);
			circle.setText("Learning Objective: " + (circle.value() * 100).toFixed(0) + "%");
		}
	});

	circle2.animate((chapterProg / 100), {
		from: {
			color: '#fff'
		},
		to: {
			color: '#d1b31b'
		},
		step: function (state, circle, bar) {
			circle.path.setAttribute('stroke', state.color);
			console.log(circle);
			circle.setText("Chapter: " + (circle.value() * 100).toFixed(0) + "%");
		}
	});

	circle3.animate((courseProg / 100), {
		from: {
			color: '#fff'
		},
		to: {
			color: '#5e7c51c'
		},
		step: function (state, circle, bar) {
			circle.path.setAttribute('stroke', state.color);
			console.log(circle);
			circle.setText("Course: " + (circle.value() * 100).toFixed(0) + "%");
		}
	});
}

//Update Progress Bar
function updateProgress() {

	//var value = ($(this).attr('value') / 100);
	var startColor = '#FC5B3F';
	var endColor = ($(this).attr('pColor'));
	circle1.animate((lessonProg / 100), {
		from: {
			color: '#fff'
		},
		to: {
			color: '#ffd920'
		},
		step: function (state, circle, bar) {
			circle.path.setAttribute('stroke', state.color);
			console.log(circle);
			circle.setText("Learning Objective: " + (circle.value() * 100).toFixed(0) + "%");
		}
	});

	circle2.animate((chapterProg / 100), {
		from: {
			color: '#fff'
		},
		to: {
			color: '#d1b31b'
		},
		step: function (state, circle, bar) {
			circle.path.setAttribute('stroke', state.color);
			console.log(circle);
			circle.setText("Chapter: " + (circle.value() * 100).toFixed(0) + "%");
		}
	});
	circle3.animate((courseProg / 100), {
		from: {
			color: '#fff'
		},
		to: {
			color: '#5e7c51c'
		},
		step: function (state, circle, bar) {
			circle.path.setAttribute('stroke', state.color);
			console.log(circle);
			circle.setText("Course: " + (circle.value() * 100).toFixed(0) + "%");
		}
	});
}

//Function to Run after Next Button or when Content Div is revealed.
//Update Lesson,Chapter Local Storate ID Per Lesson
function runProgressBar() {
	//This code will grab current progress and update LocalStorage.
	//If Statement to stop progressing once you reach 100 percent.
	//Lesson will stop before 100 percent and wait for Interactivity Completed
	//Chapter will stop before 100 percent and wait for Quiz Completed
	//Course will stop before 100 percent and wait for All Quizzes Completed
	if (lessonProg < (100 - ((1 / lessonLength) * 100))) {
		lessonProg = (lessonProg + ((1 / lessonLength) * 100) - 1);
		updateProgress();
		//Store new calculations into Local Storage
		if (typeof (Storage) !== "undefined") {
			//Update Lesson Local Storate ID Per Lesson
			localStorage.c01l01 = lessonProg;

		} else {
			// Sorry! No Web Storage support..
			alert("No Local Storage");
		}

	}
	if (chapterProg < (100 - ((1 / chapterLength) * 100))) {
		chapterProg = (chapterProg + ((1 / chapterLength) * 100) - 1);
		updateProgress();
		//Store new calculations into Local Storage
		if (typeof (Storage) !== "undefined") {
			//Update Lesson Local Storate ID Per Lesson
			localStorage.ch01 = chapterProg;

		} else {
			// Sorry! No Web Storage support..
			alert("No Local Storage");
		}

	}

	if (courseProg < (98 - ((1 / courseLength) * 100))) {
		courseProg = (courseProg + ((1 / courseLength) * 100));
		updateProgress();
		//Store new calculations into Local Storage
		if (typeof (Storage) !== "undefined") {
			//Update Lesson Local Storate ID Per Lesson
			localStorage.c = courseProg;

		} else {
			// Sorry! No Web Storage support..
			alert("No Local Storage");
		}

	}
}

//Function to Update Progress Bar if Interactivity is completed
function finishedInt() {
	lessonProg = 100;
	updateProgress();
	if (typeof (Storage) !== "undefined") {
		//Update Lesson Local Storate ID Per Lesson
		localStorage.c01l01 = lessonProg;

	} else {
		// Sorry! No Web Storage support..
		alert("No Local Storage");
	}
}

//Function to Update Progress Bar if Quiz is completed
function finishedQuiz() {
	chapterProg = 100;
	updateProgress();
	if (typeof (Storage) !== "undefined") {
		//Update Lesson Local Storate ID Per Lesson
		localStorage.ch01 = chapterProg;

	} else {
		// Sorry! No Web Storage support..
		alert("No Local Storage");
	}
}

//Function to Update Progress Bar if Course is completed
function finishedCourse() {
	courseProg = 100;
	updateProgress();
	if (typeof (Storage) !== "undefined") {
		//Update Lesson Local Storate ID Per Lesson
		localStorage.c = courseProg;

	} else {
		// Sorry! No Web Storage support..
		alert("No Local Storage");
	}
}






//SCORM Functions

function handleError(msg) {
	console.log(msg);
	//window.close();
}

function initCourse() {
	//scorm.init returns a boolean
	lmsConnected = scorm.init();
	//If the scorm.init function succeeded...
	if (lmsConnected) {
		//handleError("You are connected to LMS.");
		var success = scorm.get("cmi.core.lesson_status", "completed");
		//If the course was successfully set to "completed"...
		if (success) {
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
		if (completionstatus === "completed" || completionstatus === "passed") {
			//...let's display a message and close the browser window
			//handleError("You have already completed this course. You do not need to continue.");
		}
		//Now let's get the username from the LMS
		var learnername = scorm.get("cmi.core.student_name");
		//If the name was successfully retrieved...
		if (learnername) {
			//...let's display the username in a page element named "learnername"
			document.getElementById("learnername").innerHTML = learnername; //use the name in the form
		}
		//If the course couldn't connect to the LMS for some reason...
	} else {
		//... let's alert the user then close the window.
		//handleError("Error: Course could not connect with the LMS");
	}
}

function setComplete() {
	//If the lmsConnection is active...
	lmsConnected = scorm.init();
	if (lmsConnected) {
		//This line will set Course to Complete
		var success = scorm.set("cmi.core.lesson_status", "completed");
		//Use this line to set a Score
		//pipwerks.SCORM.data.set("cmi.core.score.raw",scorm_total);
		//API.LMSCommit(); //save in database
		//API.LMSFinish(); //exit course
		if (success) {
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
//SCORM Functions

$(function () {
	"use strict";
	$('.PortSwap').hide().eq(0).addClass('active').show();
});

$(function () {
	"use strict";
	$('.PageSwap').eq(0).addClass('active');
});

function prevNext(btn) {
	//check to see if the click is one to a pagination element or prev/next
	var navClickType = btn.prop('nodeName');
	//remove the active class from the currently active pagination element
	var $activeLi = $('.pagination').find("li.active");
	$activeLi.removeClass('active');

	var current = $('.PortSwap.active')
	var next = current.next('.PortSwap');
	var prev = current.prev('.PortSwap');
	current.hide().removeClass('active');
	if (navClickType == 'A') { //actions if prev/next is clicked
		var theID = btn.attr('id');
		var direction = theID.split('arrow')[1];
		if (direction == 'Prev') {
			if (prev.length) {
				current.hide().removeClass('active');
				prev.addClass('active').hide().fadeIn(250);
			}
			if ($activeLi.prev().length > 0) {
				$activeLi.prev().addClass('active');
			} else {
				$('.pagination').find("li:last").addClass("active");
			}
		} else if (direction == 'Next') {
			if (next.length) {
				current.hide().removeClass('active');
				next.addClass('active').hide().fadeIn(250);
			}
			if ($activeLi.next().length > 0) {
				$activeLi.next().addClass('active');
			} else {
				$('.pagination').find("li:first").addClass("active");
			}
		}
	} else { //actions if pagination element is clicked
		btn.addClass('active');
		$activeEl = $('.pagination').find("li.active");
		var contentID = '#Content' + $activeEl.find('a').attr('id').split('_')[1];
		$(contentID).addClass('active').hide().fadeIn(250);
	}
}
