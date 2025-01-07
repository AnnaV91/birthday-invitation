const guests = new Set(); // Set to store unique guest names

function handleYes() {
    const content = document.getElementById('content');
    const header = document.getElementById('header');

    header.innerHTML = `
        <h1>Nice! You will be attending Anna's birthday on 01.02.25!<br><br>It starts at 17:00. Feel free to bring Snacks or Drinks.</h1>
        <img src="assets/yes_selected.png" alt="yes selected">
    `;

    content.innerHTML = `
        <div class="header" id="header">
            ${header.innerHTML}
        </div>
        <p class="p_center">(In case you want to delete your name again: just put your name in the input field again)</p>
        <button class="yes" onclick="handleYes()">Yes!</button>
        <button class="no" onclick="handleNo()">No.</button>
        <input type="text" id="guestName" placeholder="Put your name (& your +1) on the guest list">
        <button onclick="addOrRemoveGuest()">Submit</button>
         <div class="location">
                
                <div class="address">
                   <img src="assets/address_icon.png" width=40px alt="address icon">
                   <h3>Address</h3>
                   <p><strong>Breitenfurter Str. 535-537 / 4 / 4<br>1230 Wien</strong></p>
                   <p>Departure from Bahnhof Liesing:<br>Bus 250 & 253 til "Kalksburger Kirchenplatz"<br><br>Please use the app "VOR" to see the time schedule</p>
                </div>

                <div class="address">
                   <img src="assets/map_icon.png" width=40px alt="map icon">
                   <h3>Map</h3>
                   <p><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.5864003276606!2d16.241893876113544!3d48.13749905116697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476da66df1017145%3A0x437d8e6a3b997da7!2sBreitenfurter%20Str.%20535-537%2C%201230%20Wien!5e0!3m2!1sde!2sat!4v1736272550251!5m2!1sde!2sat" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></p>
                </div>
            </div>
        <div class="guest-list">
            <img src="assets/guestlist_icon.png" width=40px alt="guest list icon">
            <h2>Current guest list (<span id="guestCount">${guests.size}</span>)</h2>
            <div id="guestListContent"></div>
        </div>
    `;
    setActiveButton('yes');
    loadGuestsFromURL(); // Load guests from URL
    updateGuestList();
}

function createGuestList(guests) {
    return `
        <div class="guest-list">
            <h2>Current guest list (<span id="guestCount">${guests.size}</span>)</h2>
            <div id="guestListContent"></div>
        </div>
    `
}

function handleNo() {
    const content = document.getElementById('content');
    const header = document.getElementById('header');

    header.innerHTML = `
        <h1>Buuuh! You won’t be attending Anna's birthday on 01.02.25... ?!</h1>
        <img src="assets/no_selected.png" alt="Image Right">
    `;

    content.innerHTML = `
        <div class="header" id="header">
            ${header.innerHTML}
        </div>
        <button class="yes" onclick="handleYes()">Yes!</button>
        <button class="no" onclick="handleNo()">No.</button>
        <div class="guest-list">
            <h2>Current guest list (<span id="guestCount">${guests.size}</span>)</h2>
            <div id="guestListContent"></div>
        </div>
    `;
    setActiveButton('no');
    loadGuestsFromURL(); // Load guests from URL
    updateGuestList();
}

function setActiveButton(buttonType) {
    const yesButton = document.querySelector('.yes');
    const noButton = document.querySelector('.no');

    if (buttonType === 'yes') {
        yesButton.classList.add('active');
        noButton.classList.remove('active');
    } else if (buttonType === 'no') {
        noButton.classList.add('active');
        yesButton.classList.remove('active');
    }
}

function addOrRemoveGuest() {
    const nameInput = document.getElementById('guestName');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Please enter a name.');
        return;
    }

    if (guests.has(name)) {
        // Remove the guest if they already exist
        if (confirm(`Remove ${name} from the guest list?`)) {
            guests.delete(name);
        }
    } else {
        // Add the guest
        guests.add(name);
    }

    nameInput.value = '';
    updateURLWithGuests();
    updateGuestList();
}

function updateGuestList() {
    const guestListContent = document.getElementById('guestListContent');
    const guestCount = document.getElementById('guestCount');

    guestListContent.innerHTML = '';
    guests.forEach(guest => {
        const guestDiv = document.createElement('div');
        guestDiv.textContent = guest;
        guestListContent.appendChild(guestDiv);
    });

    guestCount.textContent = guests.size;
}

function updateURLWithGuests() {
    const guestArray = Array.from(guests); // Convert Set to Array
    const guestParam = encodeURIComponent(guestArray.join(',')); // Encode guests as a single string
    const newURL = `${window.location.origin}${window.location.pathname}?guests=${guestParam}`;
    window.history.pushState({}, '', newURL); // Update the URL without reloading the page
}

function loadGuestsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('guests');

    if (guestParam) {
        const guestArray = decodeURIComponent(guestParam).split(','); // Decode and split guest names
        guests.clear();
        guestArray.forEach(guest => guests.add(guest.trim()));
    }
}

// Load guests from URL on initial page load
window.onload = () => {
    loadGuestsFromURL();
    updateGuestList();
};