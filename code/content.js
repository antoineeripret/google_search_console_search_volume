function get_keywords() {
    //array where we will store our keyword
    let arr = [];
    //gets table
    //there are several tables with the same class
    var oTable = document.getElementsByClassName('i3WFpf')[0];
    //gets rows of table
    var rowLength = oTable.rows.length;
    //loops through rows
    for (i = 0; i < rowLength; i++) {
        //gets cells of current row
        var oCells = oTable.rows.item(i).cells;
        //loops through each cell in current row{
        arr.push(oCells.item(0).innerText);
    }
    // Remove "Top Queries" header from array
    arr.shift();
    return arr;
}

async function get_search_vol(chunk, url) {
    const requestUrl = url; // URL to request
    const response = await fetch(requestUrl); // Make request to Keyword Surfer
    const json = await response.json().catch((error)=>console.log(error)); // Transform response to JSON
    //loop the response and return an array with volumes
    let keywords = {};
    let keys = chunk
    for (i = 0; i < keys.length; i++){
        keywords[keys[i]] = json[keys[i]]?.search_volume ?? 0; // If keyword has data get the data else return 0 (optional chaining operator (?.) + Nullish coalescing operator (??))
    }
    return keywords;
}

//function to divide an array in X arrays 
//Source: https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        var myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        var finalChunk = [];
        for (y = 0; y < myChunk.length; y++) {
            finalChunk.push(myChunk[y].replace("\"","").replace("\"",""))
        }
        tempArray.push(finalChunk);
    }
    
    return tempArray;
}

//generate the Keyword Surfer's URLs for our chunks
function generate_urls(chunks, country){
    //output 
    var arr = [];
    //Base URL to generate our list of urls
    base_url = `https://db2.keywordsur.fr/keyword_surfer_keywords?country=${country}&keywords=[%22`;
    //loop 
    for (i = 0; i < chunks.length; i++){
        var url = base_url.concat(chunks[i].join("%22,%22"),"%22]");
        arr.push(url);
    }
    return arr
}

function get_user_country(){
    chrome.storage.local.get('country', function(result) {
        if (result && result.favoriteColor) {
            return result.country;
        } else return 'us'
    });
}

async function getData() {
    const kws = get_keywords(); // Get all keywords from GSC
    const chunks = chunkArray(kws,50) // transform keyword in set of keywords
    const urls = generate_urls(chunks,'fr')
    const allKeywords = {}; // Store future reponses in hashmap

    // Loop through GSC set of keywords and request keywoFrd surfer data
    for (let i = 0; i < urls.length; i++) {
        try {
            var sv = await get_search_vol(chunks[i], urls[i]);
            var keys = Object.keys(sv)
            for (let y = 0; y < keys.length; y++){
                allKeywords[Object.keys(sv)[y]] = sv[Object.keys(sv)[y]]
            }
        } catch (error) {
            //loop in chunks[i] and assign "error" as sv 
            for (z = 0; z < chunks[i].length; z++){
                allKeywords[chunks[i][z]] = 'Error'
            } 
        }
    }
    console.log(allKeywords); // Just to check the output
    return allKeywords;
}

function createCell(text) {
    var cell = document.createElement('td');
    var cellText = document.createTextNode(text);
    cell.appendChild(cellText);
    cell.setAttribute('style', 'font-size:12px;font-weight: bold');
    return cell;
}

async function addVolumes() {
    const volumes = await getData(); // Wait to get hasmap of search volumes
    var tbl = document.getElementsByClassName('i3WFpf')[0]; // Select table
    // Loop through rows
    for (let i in tbl.rows) {
        // Select each row
        let row = tbl.rows[i];
        // Select first cell (query)
        var query = row.cells[0].textContent;
        // Add header
        if (query === tbl.rows[0].cells[0].textContent) {
            row.appendChild(createCell('Search Volume'));
        } else row.appendChild(createCell(volumes[query]));
    }
}

addVolumes();