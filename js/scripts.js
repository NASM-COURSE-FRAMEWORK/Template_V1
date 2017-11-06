//Array variables
var settingsArray = [],
	paragraphsArray = [],
	headersArray = [],
	calloutsArray = [],
	linksNameArray = [],
	linksLinksArray = [],
	viewedArray = [];
//Set XML File Locations Here
var xmlMenu = "data/c01ch01menu.xml";
var xmlData = "data/c01ch01data.xml";
//Variables for storing Contend ID and Active Page Number
var newID, $activeEl, contentID, $activeLi;
//Assign Lesson Length to 0 At Start
var lessonLength = 0;
//Helper Variables
var cPage, cPageNum, numContentBlocks;
//Progress Bar Variables
var chapterLength, courseLength, lessonProg, courseProg, chapterProg;
//Local Storage Variables
var courseVar, chapterVar, lessonVar, chapterVarLES, lessonVarPER, lessonVarCID, lessonVarNUM, lessonVarVIEW;

// On Document Load Functions
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
			newID = settingsArray[3] + settingsArray[4] + settingsArray[5] + "pg";
			//Determine Chapter and Course Length
			chapterLength = settingsArray[1];
			courseLength = settingsArray[2];
			//Build all Local Storage Variables based on XML
			courseVar = settingsArray[3];
			chapterVar = settingsArray[3] + settingsArray[4];
			lessonVar = settingsArray[3] + settingsArray[4] + settingsArray[5];
			lessonVarPER = lessonVar + "PER";
			lessonVarCID = lessonVar + "CID";
			lessonVarNUM = lessonVar + "NUM";
			chapterVarLES = chapterVar + "LES";
			lessonVarVIEW = lessonVar + "VIEW";
			//Load All Paragraphs Content Into Array
			$(xml).find('course').find('content').find('paragraphs').find('item').each(function () {
				var temp = $(this).text();
				paragraphsArray.push(temp);
			});
			//Assign all Paragraphs from XML Array to Page
			var numParagraphs = $('.content-paragraph').length;
			for (var x = 1; x <= numParagraphs; x++) {
				document.getElementsByClassName("content-paragraph")[x - 1].innerHTML = paragraphsArray[x - 1];
			}
			//Load All Headers Content Into Array
			$(xml).find('course').find('content').find('headers').find('item').each(function () {
				var temp = $(this).text();
				headersArray.push(temp);
			});
			//Assign all Headers from XML Array to Page
			var numHeaders = $('.content-header').length;
			for (var z = 1; z <= numHeaders; z++) {
				document.getElementsByClassName("content-header")[z - 1].innerHTML = headersArray[z - 1];
			}

			//Load All Callout Content Into Array
			$(xml).find('course').find('content').find('callouts').find('item').each(function () {
				var temp = $(this).text();
				calloutsArray.push(temp);
			});
			//Assign all Callouts from XML Array to Page
			var numCallouts = $('.content-callout').length;
			for (var v = 1; v <= numCallouts; v++) {
				document.getElementsByClassName("content-callout")[v - 1].innerHTML = calloutsArray[v - 1];
			}

			//Assign Lesson Title to Bottom of Page
			document.getElementById("lesson-title").innerHTML = settingsArray[6];
			//Assign new Class ID's to Content Divs based on XML settings
			var numContentBlocks = $('.PortSwap').length;
			for (var i = 1; i <= numContentBlocks; i++) {
				lessonLength = lessonLength + 1;
				document.getElementById("Content" + i).id = newID + i;
				document.getElementById("PageSwap" + i).id = newID + i + "Num" + i;
				document.getElementsByClassName("chapter-title")[i - 1].innerHTML = settingsArray[7];
			}
			//Determine First Page based on Local Storage.  Assign Content Page and Pagination Number
			if ((localStorage.getItem(lessonVarCID) === null) || (localStorage.getItem(lessonVarCID) === undefined)) {
				cPage = "#" + newID + "1";
				cPageNum = "#" + newID + "1" + "Num1";
				//Assign Content ID and Page Number into Local Storage. Variable is built from XML
				localStorage.setItem(lessonVarCID, cPage);
				localStorage.setItem(lessonVarNUM, cPageNum);
				localStorage.setItem(chapterVarLES, lessonVar);
			} else {
				cPage = localStorage.getItem(lessonVarCID);
				cPageNum = localStorage.getItem(lessonVarNUM);
				//Enable First Arrow if Not First Loaded
			}
			//Go to First Page
			$(cPage).addClass('active').hide().fadeIn(250);
			$(cPageNum).addClass('active');


			//Declare Progress Bar Variables and Store them Locally.
			if (typeof (Storage) !== "undefined") {

				if ((localStorage.getItem(lessonVarPER) === undefined) || (localStorage.getItem(lessonVarPER) === null)) {
					// Set Lesson Progress to 0 before Update Runs
					lessonProg = 0;
					//Update Lesson,Chapter Local Storage ID Per Lesson
					chapterProg = (1 / chapterLength) * 100;
					courseProg = (1 / courseLength) * 100;
					localStorage.setItem(chapterVar, [1 / chapterLength * 100]);
					localStorage.setItem(lessonVarPER, [1 / lessonLength * 100]);
					localStorage.setItem(courseVar, [1 / courseLength * 100]);
				} else {
					lessonProg = Number(localStorage.getItem(lessonVarPER));
					chapterProg = Number(localStorage.getItem(chapterVar));
					courseProg = Number(localStorage.getItem(courseVar));
				}

				//If Viewed Array does not exist in local storage Create new Viewed Array
				if ((localStorage.getItem(lessonVarVIEW) === undefined) || (localStorage.getItem(lessonVarVIEW) === null)) {

					for (var c = 1; c <= numContentBlocks; c++) {
						viewedArray.push(0);
						localStorage.setItem(lessonVarVIEW, JSON.stringify(viewedArray));
					}
				} else {

					//Get Viewed Array from Local Storage
					viewedArray = JSON.parse(localStorage.getItem(lessonVarVIEW));
					//alert("This is from Local Storage" + viewedArray);
				}


			} else {
				// Sorry! No Web Storage support..
				alert("No Local Storage");
			}

			//Run Create Progress after all Variables are Defined
			createProgress();

			//Run Page Check to Disable/Enable Next/Prev Buttons
			pageCheck();




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
	numContentBlocks = $('.PortSwap').length;

	for (var i = 1; i <= numContentBlocks; i++) {
		$('#mainPagination').append('<li id="PageSwap' + i + '"  class="PageSwap"><a href="#" id="page_' + i + '">' + i + '</a></li>');

	}



	$('.prevNextBtn').click(function () {
		prevNext($(this));
	});
	$('.PageSwap').click(function () {
		prevNext($(this));
	});


	$('a.collapse').click(function () {
		var value = $(this).attr("href");
		var targetDiv = $('div' + (value));
		targetDiv.toggleClass('collapse');
		targetDiv.slideToggle(500);
	});
	
	$(window).scroll(function() {
    if($(this).scrollTop() > 50)  /*height in pixels when the navbar becomes non opaque*/ 
    {
        $('.custom-navbar').addClass('opaque');
    } else {
        $('.custom-navbar').removeClass('opaque');
    }
});

	//SCORM Intitialization
	//Declare Scorm VariablesS
	var scorm = pipwerks.SCORM; //Shortcut
	var lmsConnected = false;
	initCourse();

	videojs('video1').videoJsResolutionSwitcher();

});





//Dev Function to Remove Local Storage
function removeStorage() {
	localStorage.removeItem(chapterVar);
	//Update Lesson,Chapter Local Storate ID Per Lesson
	localStorage.removeItem(lessonVarPER);
	localStorage.removeItem(courseVar);
}



//Function to Update Progress Bar if Interactivity is completed
function finishedInt() {
	lessonProg = 100;
	updateProgress();
	if (typeof (Storage) !== "undefined") {
		//Update Lesson Local Storate ID Per Lesson
		localStorage.setItem(lessonVarPER, lessonProg);

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
		localStorage.setItem(chapterVar, chapterProg);

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
		localStorage.setItem(courseVar, courseProg);

	} else {
		// Sorry! No Web Storage support..
		alert("No Local Storage");
	}
}


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
	if (navClickType === 'BUTTON') { //actions if prev/next is clicked
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
	//Run Page Check to Disable/Enable Next/Prev Buttons
	pageCheck();
	//Set Current Page into Local Storage
	if (typeof (Storage) !== "undefined") {
		if (localStorage.getItem(lessonVarCID) === undefined) {
			localStorage.setItem(lessonVarNUM, "#" + newID + "Num1");
			localStorage.setItem(lessonVarCID, "#" + newID + "1");
			cPageNum = "#" + newID + "1" + "Num1";
		} else {
			//alert($activeLi.attr('id'));
			localStorage.setItem(lessonVarCID, contentID);
			localStorage.setItem(lessonVarNUM, contentID + "Num" + $activeEl.find('a').attr('id').split('_')[1]);
			cPageNum = localStorage.getItem(lessonVarNUM);
		}
	} else {
		// Sorry! No Web Storage support..
		alert("No Local Storage");
	}
}

function pageCheck() {
	"use strict";
	$activeEl = $('.pagination').find("li.active");
	var d,e,f,g;
	//alert($activeEl.find('a').attr('id').split('_')[1]);
	if (Number($activeEl.find('a').attr('id').split('_')[1]) === numContentBlocks) {
		$("#arrowNext").attr("disabled", "disabled");
	} else if (Number($activeEl.find('a').attr('id').split('_')[1]) === 1) {
		$("#arrowPrev").attr("disabled", "disabled");
	} else {
		$("#arrowNext").removeAttr("disabled");
		$("#arrowPrev").removeAttr("disabled");
	}
	//Update Viewed Page Array Page Number after viewed
	var n = Number($activeEl.find('a').attr('id').split('_')[1] - 1);

	//Run Progress Bar Update.  Must only run once per Content Page
	if (viewedArray[n] === 0) {
		//Create Time Stamp
		d = new Date();
		e = d.toLocaleDateString();
		f = d.toLocaleTimeString();
		g= "Page Viewed on " + e + " at " + f;
		//Store Time Stamp into Viewed Array
		viewedArray[n] = g;
		//Run Progress bar Update
		runProgressBar();
		//alert("Should Run Progress Update");
	} 
	//Assign Time Stamp to HTML element and display
	document.getElementsByClassName("timestamp")[n].innerHTML = viewedArray[n];
	//Set to Local Storage
	localStorage.setItem(lessonVarVIEW, JSON.stringify(viewedArray));

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
			localStorage.setItem(lessonVarPER, lessonProg);

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
			localStorage.setItem(chapterVar, chapterProg);

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
			localStorage.setItem(courseVar, courseProg);

		} else {
			// Sorry! No Web Storage support..
			alert("No Local Storage");
		}

	}
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
			circle.setText(settingsArray[8] + " " + (circle.value() * 100).toFixed(0) + "%");
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
			circle.setText(settingsArray[9] + " " + (circle.value() * 100).toFixed(0) + "%");
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
			circle.setText(settingsArray[10] + " " + (circle.value() * 100).toFixed(0) + "%");
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
			circle.setText(settingsArray[8] + " " + (circle.value() * 100).toFixed(0) + "%");
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
			circle.setText(settingsArray[9] + " " + (circle.value() * 100).toFixed(0) + "%");
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
			circle.setText(settingsArray[10] + " " + (circle.value() * 100).toFixed(0) + "%");
		}
	});
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
