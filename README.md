Galaxy Getaways

Table of Contents
1. Project Description
2. Technologies
3. Files
4. How to install this project
5. Product Features (How to use)
6. Credits, References, Licenses 
7. AI Acknowledgment
8. Contact Information


1. Project Description
Our project, Galaxy Getaways, is developing a space tourism app  to help excited space travelers navigate the complexities of traveling to space with efficiency and passion.



2. Technologies

Front end: 			    jQuery | ejs | bootstrap | CSS
Middleware: 			Express | OpenAI API | Sendbird
Back end: 			    Node.js | Mongodb


3. Files
├── chatbot												#Contains the databank for the chatbot
	├── chatbot.json
	└── chatbot.txt
├── favicon_io											#Contains favicon images
	├── android-chrome-192x192.png
	├── android-chrome-512x512.png
	├── apple-touch-icon.png
	├── favicon-16x16.png
	└── favicon-32x32.png
├── models												# Stores schemas used with Mongoose for Mongodb
	├── BookingInfo.js
	├── Flight.js
	├── Hotel.js
├── node_modules										# Node modules used for node.js project
├── public												# Contains CSS, images, and javascript files
	├── css 					                        # Contains CSS styling sheets 
		├── availableHotels.css
		├── flights.css
		├── game.css
		├── header.css
		├── hotels.css
		├── hotelSummary.css
		├── main_page.css
		└── myBookings.css 
	├── images 					                        # Contains images used in project
		├── AstralHeightsResort.png
		├── Blue Origin.png
		├── CavernViewHotel.png
		├── CraterCoveHotel.png
		├── CrimsonSandsResort.png
		├── EclipseHaven.png
		├── ElysiumEscape.png
		├── GalacticGatewayHotel.png
		├── LunarCraterLodge.png
		├── LunarHarmonyResort.png 
		├── LunarOasisResort.png
		├── MarinerisVistaResort.png
		├── MartianMirage.png
		├── Moon_main_mobile.jpg
		├── Moon_main.jpg
		├── MoonlightBayRetreat.png
		├── nasa.png
		├── OlympusMonsSpa&Resort.png
		├── RedDuneRetreat.png
		├── RedPlanetRetreat.png
		├── SelenesSanctuary.png
		├── spacex.png
		├── StarlightSummit.png
		└── Virgin Galactic.png
	├── js 						                        # Contains javascript files used in project
		├── flights.js
		└── hotels.js
	└── video 					                        # Contains video used for 404 page
		└── lost.mp4
├── views												# Contains all ejs files used in project
	├── templates 					                    # Contains all the templates that are reused in project
		├── footer-no-chatbot.ejs
		├── footer.ejs
		├── header-back-arrow.ejs
		├── header-basic.ejs
		├── header-hamburger-main-only.ejs
		├── header-hamburger.ejs
		├── svgs.ejs
		└── template.ejs
	├── 404.ejs
	├── about.ejs
	├── account.ejs
	├── admin.ejs
	├── availableHotels.ejs
	├── contact.ejs
	├── departingFlights.ejs
	├── faq.ejs
	├── flightOrderConfirmation.ejs
	├── flightPayment.ejs
	├── flights.ejs
	├── hotels.ejs
	├── hotelSummary.ejs
	├── index.ejs
	├── inquiry.ejs
	├── main.ejs
	├── myBookings.ejs
	├── orderConfirmation.ejs
	├── password.ejs
	├── payment.ejs
	├── returningFlights.ejs
	├── reviewFlights.ejs
	├── signin.ejs
	├── signup.ejs
	└── terms-and-conditions.ejs
├── .env												# Contains secrets
├── .gitignore               							# Git ignore file
├── databaseConnection.js								# Creates and exports object to allow for connection to Mongodb database
├── index.js               								# Client side js page that initializes node
├── package-lock.json									# Automatically generated file that records the exact versions of dependencies installed in your project
├── package.json										# Contains metadata about the project, including name, version, dependencies, scripts, and other configurations.
└── README.md

4. How to install this project:
A. Ensure to install the following (preferred download order given):
	a. node (node must be downloaded first) 
	b. express for node
	c. express session
	d. bcypt
	e. dotenv
	f. ejs
	g. joi
	h. nodemailer
	i. openai
	j. connect-mongo
	k. mongoose for Mongodb
B. Preferred IDE is Visual Studio Code
C. Languages used in this project include:
	a. Javascript
	b. HTML
	c. CSS
	d. ejs templating language
D. Frameworks and APIs include:
	a. bootstrap
	b. jQuery
	c. OpenAI API
E. Create a .env file to keep secrets that will be provided to you.
F. <-- Add any other configuration instructions here or else delete this line -->
G. <-- Include link to testing plan 5b -->
H. <-- Create a plain text file called passwords.txt and add user login info
	for mongodb database. Ensure this file is NOT included in repo. Upload this
	file to 05d D2L -->


5. Product Features (How to use)

Hotels booking
    1. On main page click on Explore Hotels button or click on Hotels button in hamburger menu.
    2. From drop down menu, choose preferred region and choose appropriate Check in and Check out dates
        dates fields provided.
    3. Search queried available hotels for a potential hotel.
    4. Read/write reviews on the bottom of the page (see Reviews in this section).
    5. If this is the hotel you want to book, press the book button.
    6. Proceed to payments (see Payment processing).

Reviews
	1. When viewing a hotel's description scroll down
	2. There will be the AI review section first and then a section where users have written their own reviews.
	3. You can Write a review by first writing a title and then description then finally giving a numeric rating and then pressing submit.
	4. The AI review section will update automatically

Flights booking
	1. From the main page select 'Explore Flights', or select 'Flights' from the hamburger menu.
	2. Fill in the form to match your desired search properties and select 'Search'.
	3. Browse the departing flights that match your inputs (selecting the chevron icon to expand and collapse) and select the header of a flight to proceed.
	4. Browse the returning flights that match your inputs if applicable and select the header of a flight to proceed.
	5. Review your selected flights in the review page. You can go back and change inputs or selected flights with the back arrow if necessary.
	6. Proceed to payment by selecting the pay (see Payment processing).


Payments processing
	1. At the payment page, review items for purchase.
	2. Enter in payment information in the payment form
	3. Click confirm payment

Order Confirmation
	1. At the order confirmation page you can review your order.
	2. Click my bookings button to view purchased items.

My bookings
	1. At the my bookings page you can review all purchased items.
	2. You can click on Galaxy Getaways to return to the main page.

Chatbot
	1. Click on the icon in the bottom right corner.
	2. Chatbot menu will pop up.
	3. You can ask it any questions regarding the web app and it will give a response.

FAQ
	1. Click on the hamburger menu on the topleft
	2. Click on FAQ
	3. Here you can see a list of frequently asked questions

	
6. Credits, References, Licenses 
<-- Credits -->
Used chatGPT for debugging our code and creation of small functions. Used Open AI for our AI review section, used send bird for our chat bot.
<-- References -->
Stackoverflow, chatGPT, Sendbird, Open AI
https://stackoverflow.com/questions/2638292/after-travelling-back-in-firefox-history-javascript-wont-run
https://disjfa.github.io/bootstrap-tricks/card-collapse-tricks/
https://getbootstrap.com/docs/5.1/components/collapse/
https://stackoverflow.com/questions/2013255/how-to-get-year-month-day-from-a-date-object
<-- Licenses -->

7. AI Acknowledgment
    a. We did use AI to help create this app. Generative AI by ChatGPT was used to help
        explain difficult code examples and concepts so the principles could be 
        applied to the logic of this app.
    b. AI was used to help create the hotels that populate the database including their
        names, descriptions, and images.
    c. Our app does use AI directly as well... <-- Reviews and chatbot -->
		Chatbot: Our app uses AI for our Chatbot. The chatbot can generate responses and answers questions you may have about the app.
    d. The limitations we encountered with AI include... <-- Reviews and chatbot -->
		Chatbot: The limitations we encouneterd with the Chatbot is that it can only generate responses based on the databank that we provide.

------------------------------------------------------------------------------------------------------------------------------------------------
8. Contact Information
Gurvir Dhami        ||      Jason Peacock       ||      Jarod Foster        ||      Uppnoor Panesar     ||      Jack Le
gdhami21@my.bcit.ca         jpeacock8@my.bcit.ca            jfoster67@my.bcit.ca            upanesar@my.bcit.ca            jle61@my.bcit.ca

