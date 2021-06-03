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
  const json = await response.json(); // Transform response to JSON
  //loop the response and return an array with volumes
  let keywords = {};
  for (i = 0; i < chunk.length; i++) {
    keywords[chunk[i]] = json[chunk[i]]?.search_volume ?? 0; // If keyword has data get the data else return 0 (optional chaining operator (?.) + Nullish coalescing operator (??))
  }
  return keywords;
}

//function to divide an array in X arrays
//Source: https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
function chunkArray(myArray, chunk_size) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    var myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    var finalChunk = [];
    for (y = 0; y < myChunk.length; y++) {
      finalChunk.push(myChunk[y].replace('"', '').replace('"', ''));
    }
    tempArray.push(finalChunk);
  }

  return tempArray;
}

//generate the Keyword Surfer's URLs for our chunks
function generate_urls(chunks, country) {
  //output
  const arr = [];

  //Base URL to generate our list of urls
  const base_url = `https://db2.keywordsur.fr/keyword_surfer_keywords?country=${country}&keywords=[%22`;

  // Loop through chunk to create array of keywords in request
  for (i = 0; i < chunks.length; i++) {
    var url = base_url.concat(chunks[i].join('%22,%22'), '%22]');
    arr.push(url);
  }
  return arr;
}

async function getData(country) {
  const kws = get_keywords(); // Get all keywords from GSC
  const chunks = chunkArray(kws, 50); // transform keyword in multiple arrays of 50 keywords
  const urls = generate_urls(chunks, country); // Build Request URL
  const allKeywords = {}; // Store future reponses in hashmap

  // Loop through GSC set of keywords and request keywoFrd surfer data
  for (let i = 0; i < urls.length; i++) {
    var sv = await get_search_vol(chunks[i], urls[i]);
    var keys = Object.keys(sv);
    for (let y = 0; y < keys.length; y++) {
      allKeywords[Object.keys(sv)[y]] = sv[Object.keys(sv)[y]];
    }
  }
  // console.log(allKeywords); // Just to check the output
  return allKeywords;
}

function createCell(text) {
  var cell = document.createElement('td');
  var cellText = document.createTextNode(text);
  cell.appendChild(cellText);
  cell.setAttribute(
    'style',
    'font-size:12px;font-weight:bold;text-align:center;'
  );
  return cell;
}

function createDownloadButton(file) {
  // Select parent div
  const parent = document.querySelector('.sVgexf');
  // Create div
  const div = document.createElement('div');
  div.setAttribute('style', 'font-weight: bold;margin:5px');

  const button = document.createElement('a');
  const buttonText = document.createTextNode(
    'Download Performance + Search Volume'
  );
  button.setAttribute('class', 'gIhoZ');
  button.setAttribute(
    'style',
    'padding: 10px;background-color: #f5f5f5;border-radius: 5px;'
  );

  // Credit to isherwood & Default (https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side)
  button.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(file));
  button.setAttribute('download', 'gsc_volumes_data.csv');

  button.appendChild(buttonText);
  div.appendChild(button);
  parent.appendChild(div);

  return `Downloading all data + volumes to CSV...`;
}

async function addVolumes(country) {
  const volumes = await getData(country); // Wait to get hasmap of search volumes
  const tbl = document.getElementsByClassName('i3WFpf')[0]; // Select table
  // Future CSV
  let csvExport = '';

  // Loop through rows
  for (let i in tbl.rows) {
    // For some reason there is an undefined row at the end
    if (i === 'length') {
      break;
    } else {
      // Select each row
      let row = tbl.rows[i];
      // Create line for future CSV
      const line = [];
      // Select first cell (query)
      const query = row.cells[0].textContent;
      // Add header
      if (query === tbl.rows[0].cells[0].textContent) {
        row.appendChild(createCell('Search Volumes'));
      } else {
        // If there is search volume data add it
        if (volumes[query]) row.appendChild(createCell(volumes[query]));
        // If not add 0 search volume
        else row.appendChild(createCell(0));
      }
      // Loop through cells
      for (const cell of row.cells) {
        const text = cell.textContent;
        line.push(text.replace(/,/g, ''));
      }
      // Create each filled line for future CSV
      csvExport = csvExport.concat(line.join(','), '\n');
    }
  }
  createDownloadButton(csvExport);
}

// Extract country variable from local storage
chrome.storage.local.get('country', function (savedOption) {
  // Use "United States" ('us') as default option if there is no saved option from user
  const country = savedOption.country || 'us';
  console.log(`Getting Search Volume from country "${country}"...`);
  // Run Add volumes with specified country
  addVolumes(country);
});
