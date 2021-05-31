function get_keywords() {
  //array where we will store our keyword
  let arr = [];
  //gets table
  //there are several tables with the same class
  var oTable =
    document.getElementsByClassName('i3WFpf')[0];
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

async function get_search_vol(country) {
  // Transform keyword request to ASCII (URL safe)

  const set = get_keywords(); // Get all keywords from GSC

  const allKeywords = {}; // Store future reponses in hashmap

  while (set.length) {
    const chunk = set.splice(0, 50);
    const map = chunk.map((kw) => `${kw}`);
    const kwsTransformed = JSON.stringify(map);
    //Base URL to generate our list of urls
    const requestUrl = `https://db2.keywordsur.fr/keyword_surfer_keywords?country=${country}&keywords=${encodeURI(
      kwsTransformed
    ).replace(/%20/g, '+')}`;
    const response = await fetch(requestUrl); // Make request to Keyword Surfer
    const json = await response.json(); // Transform response to JSON

    // Loop through response object composed of multiple objects
    for (let prop in json) {
      // Deconstruct each object to obtain only search volume
      const { search_volume } = json[prop];
      // Create entry in hasmap with keyword as key and search_volume as value
      allKeywords[prop] = search_volume;
    }
  }
  console.log(allKeywords);
  return allKeywords;
}

function createCell(text) {
  var cell = document.createElement('td');
  var cellText = document.createTextNode(text);
  cell.appendChild(cellText);
  cell.setAttribute(
    'style',
    'font-size:12px;font-weight: bold'
  );

  return cell;
}

async function addVolumes(country) {
  const volumes = await get_search_vol(country); // Wait to get hasmap of search volumes

  var tbl =
    document.getElementsByClassName('i3WFpf')[0]; // Select table

  // Loop through rows
  for (let i in tbl.rows) {
    // Select each row
    let row = tbl.rows[i];

    // Select first cell (query)
    var query = row.cells[0].textContent;
    // Add header
    if (query === 'Top queries') {
      row.appendChild(createCell('Volumes'));
    } else {
      if (volumes[query])
        row.appendChild(
          createCell(volumes[query])
        );
      else row.appendChild(createCell(0));
    }
  }
}

addVolumes('fr');
