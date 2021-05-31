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

async function get_search_vol(country) {
  // Transform keyword request to ASCII (URL safe)

  const set = get_keywords(); // Get all keywords from GSC

  const allKeywords = {}; // Store future reponses in hashmap

  while (set.length) {
    const chunk = set.splice(0, 50);
    const kwsTransformed = JSON.stringify(chunk);
    try {
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
    } catch (error) {
      console.log(`Error extrayendo search volume: ${error}`);
    }
  }
  console.log(allKeywords);
  return allKeywords;
}

function createCell(text) {
  var cell = document.createElement('td');
  var cellText = document.createTextNode(text);
  cell.appendChild(cellText);
  cell.setAttribute('style', 'font-size:12px;font-weight: bold');

  return cell;
}

async function addVolumes(country) {
  // Future CSV
  let csvExport = '';

  // Select data table in GSC
  var tbl = document.getElementsByClassName('i3WFpf')[0]; // Select table

  // Request Serch Volume Data
  const volumes = await get_search_vol(country); // Wait to get hasmap of search volumes

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
      if (query === 'Top queries') {
        row.appendChild(createCell('Volumes'));
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
  // Credit to isherwood & Default (https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side)
  const link = window.document.createElement('a');
  link.setAttribute(
    'href',
    'data:text/csv;charset=utf-8,' + encodeURI(csvExport)
  );
  link.setAttribute('download', 'gsc_volumes_data.csv');
  link.click();
  return `Downloading all data + volumes to CSV...`;
}

addVolumes('es');
