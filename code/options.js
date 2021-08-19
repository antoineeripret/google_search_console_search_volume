const optionsStatus = document.getElementById('status');
const countryList = document.getElementById('country');
const optionsSaveBtn = document.getElementById('save');

async function save_options() {
  var country = document.getElementById('country').value;
  var semrush_key = document.getElementById('semrush_key').value;

  if ((semrush_key != "") || (semrush_key != undefined) || (semrush_key != "undefined")) {

      chrome.storage.local.set({ country: country });
      chrome.storage.local.set({ semrush_key: semrush_key }, function () {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Country & Semrush key saved.';
      setTimeout(function () {
      status.textContent = '';
      }, 2000);
    });
  } else {
    chrome.storage.local.remove(['semrush_key']);
    chrome.storage.local.set({ country: country }, function () {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Country saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 2000);
    });
  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value
  chrome.storage.local.get('country',function (results) {
      document.getElementById('country').value = results.country;
    }
  );

  chrome.storage.local.get('semrush_key',function (results) {
    document.getElementById('semrush_key').value = results.semrush_key;
  }
);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
