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
├── chatbot												#
	├── chatbot.json
	└── chatbot.txt
├── favicon_io											#
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
├── package-lock.json									# 
├── package.json										#
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

Flights booking

Payments processing

User signup

User login
	

6. Credits, References, Licenses 
<-- Credits -->
<-- References -->
<-- Licenses -->

7. AI Acknowledgment
    a. We did use AI to help create this app. Generative AI by ChatGPT was used to help
        explain difficult code examples and concepts so the principles could be 
        applied to the logic of this app.
    b. AI was used to help create the hotels that populate the database including their
        names, descriptions, and images.
    c. Our app does use AI directly as well... <-- Reviews and chatbot -->
    d. The limitations we encountered with AI include... <-- Reviews and chatbot -->

------------------------------------------------------------------------------------------------------------------------------------------------
8. Contact Information
Gurvir Dhami        ||      Jason Peacock       ||      Jarod Foster        ||      Uppnoor Panesar     ||      Jack Le
gdhami21@my.bcit.ca         email@my.bcit.ca            email@my.bcit.ca            email@my.bcit.ca            email@my.bcit.ca

