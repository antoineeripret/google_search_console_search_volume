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

async function get_search_vol(keyword, country) {
  // Transform keyword request to ASCII (URL safe)
  const kwTransformed = encodeURIComponent(`["${keyword}"]`).replace(
    /%20/g,
    '+'
  );
  //Base URL to generate our list of urls
  const requestUrl = `https://db2.keywordsur.fr/keyword_surfer_keywords?country=${country}&keywords=${kwTransformed}`;
  const response = await fetch(requestUrl); // Make request to Keyword Surfer
  const json = await response.json(); // Transform response to JSON
  const searchVol = json[keyword]?.search_volume ?? 0; // If keyword has data get the data else return 0 (optional chaining operator (?.) + Nullish coalescing operator (??))
  return searchVol;
}

async function getData() {
  const set = get_keywords(); // Get all keywords from GSC
  const allKeywords = {}; // Store future reponses in hashmap

  // Loop through GSC keywords and request keyword surfer data
  for (const keyword of set) {
    const sv = await get_search_vol(keyword, 'fr');
    allKeywords[keyword] = sv;
  }

  // console.log(allKeywords); // Just to check the output
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
    if (query === 'Top queries') {
      row.appendChild(createCell('Volumes'));
    } else row.appendChild(createCell(volumes[query]));
  }
}

addVolumes();
