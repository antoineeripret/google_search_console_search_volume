//MVP para la extensión cuyo objetivo principal será 
//incluir en GSC una columna adicional con los volúmenes de búsqueda 
//Fuente: API de Keyword Surfer 


//function to extract keywords from GSC table 
//max numbered of keywords returned: 1000 
function get_keywords(){
    //array where we will store our keyword
    let arr = [];
    //gets table
    //there are several tables with the same class
    var oTable = document.getElementsByClassName('i3WFpf')[0];
    //gets rows of table
    var rowLength = oTable.rows.length;
    //loops through rows
    for (i = 0; i < rowLength; i++){
       //gets cells of current row
       var oCells = oTable.rows.item(i).cells;
       //gets amount of cells of current row
       var cellLength = oCells.length;
       //loops through each cell in current row{
       arr.push(oCells.item(0).innerText)
       }
    return arr
}

//function to divide an array in X arrays 
//Source: https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
        
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }
    
    return tempArray;
}

//generate the Keyword Surfer's URLs for our chunks
function generate_urls(chunks){
    //output 
    var arr = [];
    //Base URL to generate our list of urls
    base_url = "https://db2.keywordsur.fr/keyword_surfer_keywords?country=fr&keywords=[%22";
    //loop 
    for (i = 0; i < chunks.length; i++){
        url = base_url.concat(chunks[i].join("%22,%22"),"%22]");
        arr.push(url);
    }
    return arr
}

//Get arrays with at most 50 keywords
urls = generate_urls(chunkArray(get_keywords(),50))
//create empty variables
var json;
var volumes = {};

//create a simplified dictionnary with keywords (key) and searc volume returned by Keyword Surfer (value)
//IMPORTANT: keyword with no volume are not returned by Keyword Surfer 
function create_simplified_dict(json){
//loop keys and create a dict with key and search volume only 
    for (i = 0; i < Object.keys(json).length; i++){
        volumes[Object.keys(json)[i]]=json[Object.keys(json)[i]]["search_volume"];
    }
}

//Add missing keywords (0 volume) to our dictionnary 

//Source: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/some
function checkAvailability(arr, val) {
    return arr.some(function(arrVal) {
      return val === arrVal;
    });
}

kws = get_keywords()
//loop keys in our keywords list 
for (i = 0; i < kws.length; i++){
    //if keyword is not in volumes
    if (checkAvailability(volumes,kws[i])==false){
        volumes[kws[i]]=0;
    }
}

//IMPORTANT: we just get the data with one URL here, before release we need to inclide a for loop with all calls
//fetch the data
fetch(urls[0])
    //convert response to JSON
    .then(res => res.json())
    //get the data a an object 
    .then(data => json = data)

//get the data with the functions created above 
var keys = Object.keys(json)
create_simplified_dict(keys)

//Add a new column in GSC with our data 
//Source: https://www.redips.net/javascript/adding-table-rows-and-columns/ (modified) 

// create DIV element and append to the table cell
function createCell(cell, text, style) {
    var div = document.createElement('div'), // create DIV element
        txt = document.createTextNode(text); // create text node
    div.appendChild(txt);                    // append text node to the DIV
    cell.appendChild(div);                   // append DIV to the table cell
}

// append column to the HTML table
function appendColumn() {
    var tbl = document.getElementsByClassName('i3WFpf')[0], // table reference
        i;
    // open loop for each row and append cell
    for (i = 0; i < tbl.rows.length; i++) {
        createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), volumes[Object.keys(volumes)[i]], '');
    }
}
