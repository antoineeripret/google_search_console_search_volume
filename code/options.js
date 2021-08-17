const optionsStatus = document.getElementById('status');
const countryList = document.getElementById('country');
const optionsSaveBtn = document.getElementById('save');

function save_options() {
  var country = document.getElementById('country').value;
  var semrush_key = document.getElementById('semrush').value;

  chrome.storage.local.set({ country: country }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Country saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });

  // the part that is not working
  if (semrush_key != ''){
    chrome.storage.local.set({ semrush_key: semrush_key }, async function () {
      //Generate a single request to check that the API key is correct
      const dummy_response_semrush = await fetch("https://api.semrush.com/?type=phrase_these&key="+semrush_key+"&phrase=apple&export_columns=Ph,Nq&database=es"); // Make request
      const dummy_status = await dummy_response_semrush.status;
      console.log(dummy_status)
      
      if (dummy_status==200){
      // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Country & Semrush key saved.';
        setTimeout(function () {
          status.textContent = '';
        }, 750);
      } else {
        var status = document.getElementById('status');
        status.textContent = 'Please check that your API key is valid.';
        setTimeout(function () {
          status.textContent = '';
        }, 2000);
      }
    });
  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value
  chrome.storage.local.get(
    {
      country: 'fr',
    },
    function (items) {
      document.getElementById('country').value = items.country;
    }
  );
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
