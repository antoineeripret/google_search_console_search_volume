## Chrome extension (WIP)

## Process

- Get keywords from GSC (UI) 
- Retrieve search volume using Keyword Surfer API 
- Add search volumes as a new column in GSC UI 

## Issues 
Line 90 - 100: 
There are 4 steps that need to be done one after the other: fetch the data THEN convert to JSON THEN get the list of keys THEN create the simplified dictionnary. No matter how I do it, it doesn't seem to work :( 

Line 115 - 122: 
When executed, this function works but values included in the new row is just undefined. I don't understand why either :( 
