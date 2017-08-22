# Template_V1

Things to work on:

JAVASCRIPT
1. Pagination Function (IN PROGRESS)
-Update Content Block Divs to be unique ID's for search function and to open ID when browser is closed.
-Ensure Progress bar updates only once when a content div is loaded.  Perhaps use an array and track if a div is opened.
-Store unqiue content div into local storage and upon reopen launch the last loaded content div.  Like a bookmarking feature.
- Unique ID's should be in this format - 01ch01l01p01
- the first two digits represent the course number.  CPT = 01, PES = 02, CES - 03, etc.  Since these are stored in local storage they need to be unique in case user has multiple courses

2. XML Import function
- Go over all the different nodes required.  We want to use one data.xml with a unique file name since we will be sending these to partners for translation.  File naming convention = 01ch01data.xml  Where 01 represents the course number.
- We will need to import all content, interactivity content, table content, etc.  The quiz will be imported in a separate XML file with the file name convention of 01ch01quiz.xml
- Need to build function and HTML for switching the language packs upon user request.

3. Progress Bar function (IN PROGRESS)
- Need to update progress bar function to have a unique variable stored in the HTML file to represent the learning objective number.  We will have multiple learning objective files in each scorm package that all share the same scripts.js file and therefore we need to store the learning objective number in the HTML file and not the JS file.  We can update the JS file with a serieis of if statements to make sure the correct ID's are stored in local storage.
Need to update all unqiue ID's for local storage so that they are unique to each course so they don't overlap.  File naming convention is 01ch01l01 for lessons. 01ch01 for chapters. 01c01 for courses.

4. Highlithing Function (IN PROGRESS)
- Matt currently working on and looking into local storage option.

5. Search Function:

6. Zoom Function:
-Perhaps look at simply changing the main container pecentage upon zooming in.

7. Moodle Launch Page (IN PROGRESS)
- Create buttons for launching each chapter.
- Create progress bars for each chapter displayed above each button using the local storage variables.
- Create an image rotator with exercise images and perhaps adds.

CSS
1. Clean up all current CSS code with comments for updating later.
2. Create Print CSS and make sure all content divs are displayed when selecting the print option.
3. Create media querries for desktop, tablet, phone.
