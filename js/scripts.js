var settingsArray = [];
var paragraphsArray = [];
var headersArray = [];
var linksNameArray = [];
var linksLinksArray = [];
var xmlMenu = "data/c01ch01menu.xml";
var xmlData = "data/c01ch01data.xml";
var newID, $activeEl, contentID, $activeLi;
var lessonLength = 0;
var chapterLength, courseLength,lessonProg, courseProg, chapterProg;

$(document).ready(function () {
	"use strict";
	//Load Data XML into Arrays
	$.ajax({
		type: "POST",
		url: xmlData,
		dataType: "xml",
		success: function (xml) {
			//If XML loaded successfuly fade in the Container
			$("#main_container").removeAttr("style").hide().fadeIn(250);
			//Load All Course Settings Into Array
			$(xml).find('course').find('settings').find('item').each(function () {
				var temp = $(this).text();
				settingsArray.push(temp);
			});
			//Assign New ID text
			newID = settingsArray[3] + "p";
			//Lesson Length
			
			chapterLength = settingsArray[1];
			courseLength = settingsArray[2];
			//Load All Paragraphs Content Into Array
			$(xml).find('course').find('content').find('paragraphs').find('item').each(function () {
				var temp = $(this).text();
				paragraphsArray.push(temp);
			});
			//Load All Headers Content Into Array
			$(xml).find('course').find('content').find('headers').find('item').each(function () {
				var temp = $(this).text();
				headersArray.push(temp);
			});

			//Assign new Class ID's to Content Divs based on XML settings
			var numContentBlocks = $('.PortSwap').length;
			for (var i = 1; i <= numContentBlocks; i++) {
				lessonLength = lessonLength + 1;
				document.getElementById("Content" + i).id = newID + i;
				document.getElementById("PageSwap" + i).id = newID + i + "Num";
			}

			//Determine First Page based on Local Storage.  Assign Content Page and Pagination Number
			var cPage, cPageNum;
			if ((localStorage.getItem("myPage") === null) || (localStorage.getItem("myPage") === undefined)) {
				cPage = "#" + newID + "1";
				cPageNum = "#" + newID + "1Num";
				//Assign myPage into Local Storage
				localStorage.setItem("myPage", cPage);
				localStorage.setItem("myPageNum", cPageNum);
			} else {
				cPage = localStorage.getItem("myPage");
				cPageNum = localStorage.getItem("myPageNum");

			}

			//Go to First Page
			$(cPage).addClass('active').hide().fadeIn(250);
			$(cPageNum).addClass('active');

			//Declare Progress Bar Variables and Store them Locally.
			if (typeof (Storage) !== "undefined") {

				if ((localStorage.c01ch01l01 === undefined) || (localStorage.c01ch01l01 === null)) {
					// Lesson Progress
					//Update Lesson,Chapter Local Storage ID Per Lesson
					lessonProg = (1 / lessonLength) * 100;
					chapterProg = (1 / chapterLength) * 100;
					courseProg = (1 / courseLength) * 100;
					localStorage.setItem("c01ch01", [1 / chapterLength * 100]);
					localStorage.setItem("c01ch01l01", [1 / lessonLength * 100]);
					localStorage.setItem("c01", [1 / courseLength * 100]);
				}
				else
					{
					lessonProg = Number(localStorage.c01ch01l01);
					chapterProg = Number(localStorage.c01ch01);
					courseProg = Number(localStorage.c01);
					}
			} else {
				// Sorry! No Web Storage support..
				alert("No Local Storage");
			}
			
			//Run Create Progress after all Variables are Defined
			createProgress();
		},
		error: function () {
			console.log("Failed");
		}
	});

	$.ajax({
		type: "POST",
		url: xmlMenu,
		dataType: "xml",
		success: function (xml) {
			//Load All menu Item and Links Into Array
			$(xml).find('course').each(function () {
				$(this).find('menu').each(function () {
					var index = 1;
					var index2 = 1;
					var m, n;
					var y = 0;
					//Store Links into 2D Array
					$(xml).find('option').each(function () {
						var tempArray = [];
						$(this).find('item').each(function () {
							tempArray.push($(this).attr('link'));
						});
						linksLinksArray.push(tempArray);
					});
					//Store Link Name into 2D Array
					$(xml).find('option').each(function () {
						var tempArray = [];
						$(this).find('item').each(function () {
							tempArray.push($(this).text());
						});
						linksNameArray.push(tempArray);
					});
					//Set Menu Headers and Add Links according to XML
					$(this).find('option').each(function () {
						m = "menuHeader" + index;
						n = "#menu" + index2;
						index = index + 1;
						index2 = index2 + 1;
						document.getElementById(m).innerHTML = ($(this).attr("desc"));
						$(this).find('item').each(function (x) {
							$(n).append('<li><a href=' + linksLinksArray[y][x] + '>' + linksNameArray[y][x] + '</a></li>');
						});
						y = y + 1;
					});
				});
			});
		},
		error: function () {
			console.log("Failed");
		}
	});


	//load pagination based on number of content divs
	var numContentBlocks = $('.PortSwap').length;

	for (var i = 1; i <= numContentBlocks; i++) {

		$('#mainPagination').append('<li id="PageSwap' + i + '"  class="PageSwap"><a href="#" id="page_' + i + '">' + i + '</a></li>');
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





//Dev Function to Remove Local Storage
function removeStorage() {
	localStorage.removeItem("c01ch01");
	//Update Lesson,Chapter Local Storate ID Per Lesson
	localStorage.removeItem("c01ch01l01");
	localStorage.removeItem("c01");
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
			//console.log(circle);
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
			//console.log(circle);
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
			//console.log(circle);
			circle.setText("Course: " + (circle.value() * 100).toFixed(0) + "%");
		}
	});
}

//Update Progress Bar
function updateProgress() {
	"use strict";
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
			//console.log(circle);
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
			//console.log(circle);
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
			//console.log(circle);
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
	"use strict";
	if (lessonProg < (100 - ((1 / lessonLength) * 100))) {
		lessonProg = (lessonProg + ((1 / lessonLength) * 100) - 1);
		updateProgress();

		//Store new calculations into Local Storage
		if (typeof (Storage) !== "undefined") {
			//Update Lesson Local Storate ID Per Lesson
			localStorage.setItem("c01ch01l01", lessonProg);

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
			localStorage.c01ch01 = chapterProg;

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
			localStorage.c01 = courseProg;

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
		localStorage.c01ch01l01 = lessonProg;

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
		localStorage.c01ch01 = chapterProg;

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
		localStorage.c01 = courseProg;

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
		//scorm.set("cmi.core.total_time");
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
	"use strict";
	//check to see if the click is one to a pagination element or prev/next
	var navClickType = btn.prop('nodeName');
	//remove the active class from the currently active pagination element

	$activeLi = $('.pagination').find("li.active");
	$activeLi.removeClass('active');

	var current = $('.PortSwap.active');
	var next = current.next('.PortSwap');
	var prev = current.prev('.PortSwap');

	current.hide().removeClass('active');
	if (navClickType === 'A') { //actions if prev/next is clicked
		var theID = btn.attr('id');
		var direction = theID.split('arrow')[1];
		if (direction === 'Prev') {
			if (prev.length) {
				current.hide().removeClass('active');
				prev.addClass('active').hide().fadeIn(250);
			}
			if ($activeLi.prev().length > 0) {
				$activeLi.prev().addClass('active');
				//Find New Active Page Number
				$activeLi = $('.pagination').find("li.active");
				$activeEl = $('.pagination').find("li.active");
				contentID = "#" + newID + $activeEl.find('a').attr('id').split('_')[1];
				assignPageToStorage();
			} else {
				$('.pagination').find("li:last").addClass("active");
			}



		} else if (direction === 'Next') {
			if (next.length) {
				current.hide().removeClass('active');
				next.addClass('active').hide().fadeIn(250);
			}
			if ($activeLi.next().length > 0) {
				$activeLi.next().addClass('active');
				//Find New Active Page Number
				$activeLi = $('.pagination').find("li.active");
				$activeEl = $('.pagination').find("li.active");
				contentID = "#" + newID + $activeEl.find('a').attr('id').split('_')[1];
				assignPageToStorage();
			} else {
				$('.pagination').find("li:first").addClass("active");
			}
		}

	} else { //actions if pagination element is clicked
		btn.addClass('active');
		$activeEl = $('.pagination').find("li.active");
		contentID = "#" + newID + $activeEl.find('a').attr('id').split('_')[1];
		$(contentID).addClass('active').hide().fadeIn(250);
		$activeLi = $('.pagination').find("li.active");
		assignPageToStorage();

	}
}

function assignPageToStorage() {
	"use strict";

	//Set Current Page into Local Storage
	if (typeof (Storage) !== "undefined") {
		if (localStorage.myPage === undefined) {
			localStorage.setItem("myPageNum", newID + "1Num");
			localStorage.setItem("myPage", "#" + newID + "1");
		} else {
			//alert($activeLi.attr('id'));
			localStorage.setItem("myPage", contentID);
			localStorage.setItem("myPageNum", "#" + $activeLi.attr('id'));

		}
	} else {
		// Sorry! No Web Storage support..
		alert("No Local Storage");
	}
}
