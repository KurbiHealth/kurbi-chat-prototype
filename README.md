Kurbi Chat Platform
===  

OVERVIEW
---

###Components

**Create Chat Box** 

This endpoint accepts the POST from the Chat Box Config app below, and compiles the config options along with the templates (html,css,JS), to produce the chat box and save it to the db. A snippet of code is returned to the app.  The snippet is displayed to the user so the user can embed it on their site.

main file: `/endpoints.createchatbox/main.js`

URL: `/chatbox (POST)`


**Load Chat Box**

This endpoint is called by the snipped from a user's website. It returns the chat box referred to by the key in the snippet url.

main file: `/endpoints.loadchatbox/main.js`

URL: `/chatbox (GET)`


**Load Chat Box Message Templates**

This endpoint is used by the chat box to load templates that are needed by the chatbot messages. 

main file: `/endpoints.loadmessagetemplate/main.js`

URL: `/template (GET)`


**Chat Box Conversations (SocketIO)**

This manages the sockets that the chat boxes use to communicate with the Bot and with (potentially) other human beings.

main file: `/endpoints.conversate/operator.js`

URL: Uses SocketIO, so does not have a url endpoint


**ChatBot**

This endpoint sends messages and accepts responses from chat boxes on user websites. These are sent through SocketIO.

main file: `/endpoints.chatbot/main.js`

URL: `/chatboxes (GET)`

URL: `/message (POST)`


**---- APPS ----**


**Chat Box Configuration Form for Providers (app)**

main file: `/apps.providerconfig/index.html`

URL: `/backend`


**Demo of a web page calling a chat box**

main file: `/apps.demo/index.html`

URL: `/demo`


**App to build bot conversations**

main file: `/apps.botbuilder/index.html`

URL: `/botbuilder`


###See Progress
* http://public.foolhardysoftworks.com:9000/backend  
Customize a new chat box and get a snippet.  

* http://public.foolhardysoftworks.com:9000/demo  
See a chat box... that doesn't do anything yet!  


INSTALL
---

** Locally **

First, run `npm install` to make sure you have all depencies. Then (in the root folder) run 

`PORT=3000 DATASOURCE=stamplay BASEURL=http://kchat:3000 ENV=local node app.js`.

NOTE: change BASEURL's value to your local url you're using for testing.

** Production **

First, run `npm install` to make sure you have all depencies. Then (in the root folder) run 

`LISTENPORT=3000 DATASOURCE=stamplay BASEURL=http://chat.gokurbi.com ENV=prod forever start app.js`

**options for parameters**

PORT		8080|3000

DATASOURCE	stamplay|mongodb 

BASEURL 	http://kchat:8080|http://chat.gokurbi.com|http://public.foolhardysoftworks.com:9000

ENV 		prod|dev|local

TO DO's
---
* make the backend config fields work (change the color and text of header)
* fix bug so one doesn't have to clear out "physics" from LocalStorage to run chat box again on page
* add functionality to save a conversation to db (Stamplay)
* design and add the user data structure from FHIR, and add data keys to responses objects
* set up admin panel for chatbox configuration, and for building conversations