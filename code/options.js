const optionsStatus = document.getElementById('status');
const countryList = document.getElementById('country');
const optionsSaveBtn = document.getElementById('save');


// Saves options to chrome.storage
function save_options() {
    var country = countryList.value;
    localStorage.setItem('country', country); 
    optionsStatus.textContent = 'Option saved.';
    setTimeout(function() {status.textContent = '';}, 750);
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
        countryList.value = localStorage['country'];
}

document.addEventListener('DOMContentLoaded', restore_options);
optionsSaveBtn.addEventListener('click', save_options);