Kurbi Chat
===  

Purpose
---
This code is here so that the peasants can migrate the chat-box creation into Stamplay
  
MMM

###Important Parts
`javascript\public_routes.js`  
  
**createSnippet()**  
This function reads the templates and combines them with the user preference.  This is what will be called 
by a wizard that lets users customize their chat box.  It returns a snippet that they can put on their own site.  
See 'public\backend' for an example of how it's used.  **Make this happen in stamplay.**  
  
  
`templates`  
  
This folder contains templates that control the functionaity of the chat box and snippet template.  This is where the chat box can be styled and functionality can be added to it.  

  
`templates\javascript\snippet_template.js`  
  
This file is the un-uglified javascript which is returned by the **createSnippet()** function.  It should not have to be modifed often, but if it does need to be modified, there it is.  I think it's wisest to keep it in native javascript.  



###See Current Progress
* http://public.foolhardysoftworks.com:9000/backend  
Customize a new chat box and get a snippet.  

* http://public.foolhardysoftworks.com:9000/demo  
See a chat box... that doesn't do anything yet!  



