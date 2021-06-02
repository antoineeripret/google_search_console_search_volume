const optionsStatus = document.getElementById('status');
const countryList = document.getElementById('country');
const optionsSaveBtn = document.getElementById('save');

function save_options() {
    var country = document.getElementById('country').value;
    chrome.storage.sync.set({
        country: countryList.value
    }, function () {
    optionsStatus.textContent = 'Option saved.';
    setTimeout(function() {status.textContent = '';}, 750);
    });
}

  // Restores select box and checkbox state using the preferences
  // stored in http://chrome.storage.
function restore_options() {
    // Use default value = ''
    chrome.storage.sync.get({
        country: ''
    }, function (item) {
        if (item.country === 'undefined') {
        document.getElementById('country').value = '';
    } else {
        document.getElementById('country').value = item.country;
    }
});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);