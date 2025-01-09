// Import the functions you need from the SDKs you need
/*
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { collection, addDoc } from "firebase/firestore"; 
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY86JwynSAJb8pTYXC0eg5jKE9XpkABho",
  authDomain: "annas-birthday.firebaseapp.com",
  projectId: "annas-birthday",
  storageBucket: "annas-birthday.firebasestorage.app",
  messagingSenderId: "642263420983",
  appId: "1:642263420983:web:b97294f0389feaf352efb2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const guestsCollection = collection(firestore, "guests");


const guests = new Set(); // Set to store unique guest names

export async function handleYes() {
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
        <button class="yes" onclick="handleYes()">Yes!</button>
        <button class="no" onclick="handleNo()">No.</button>
        <input type="text" id="guestName" placeholder="Put your name (& your +1 separately) on the guest list">
        <button onclick="addGuest()">Submit</button>
         <div class="location">
                
                <div class="address">
                   <img src="assets/address_icon.png" width=40px alt="address icon">
                   <h3>Address</h3>
                   <p><strong>Breitenfurter Str. 535-537 / 4 / 4<br>1230 Wien</strong></p>
                   <p>Departure from Bahnhof Liesing:<br>Bus 250 & 253 til "Kalksburger Kirchenplatz"<br><br>Please use <a href="https://anachb.vor.at/">VOR a nach b"</a> to see the time schedule</p>
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
    
    await loadGuestsFromDB(); // Load guests from URL
    renderGuestList();
}
window.handleYes = handleYes

export function handleNo() {
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
    loadGuestsFromDB(); // Load guests from URL
    renderGuestList();
}
window.handleNo = handleNo

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

export function addGuest() {
    const nameInput = document.getElementById('guestName');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Please enter a name.');
        return;
    }

    // Add the guest
    addDoc(guestsCollection, {
        name: name
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        guests.add(name)
        renderGuestList()
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    nameInput.value = '';
}
window.addGuest = addGuest

async function removeGuest(name) {
    // Remove the guest if they already exist
    removalConfirmed = confirm(`Remove ${name} from the guest list?`)
    if (!removalConfirmed) {
        return
    }
    // Query Firestore to find the user document
    const q = query(guestsCollection, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // If a user with the specified email exists, get the document reference
        querySnapshot.forEach((docSnapshot) => {
            // Get the document reference
            const docRef = docSnapshot.ref;
            
            // Delete the document from Firestore
            deleteDoc(docRef)
                .then(() => {
                    console.log(`Guest with name ${name} deleted successfully.`);
                })
                .catch((error) => {
                    console.error("Error deleting guest: ", error);
                });
        });
    } else {
        console.log(`No guest found with email ${name}`);
    }
}


function renderGuestList() {
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
/*
function updateURLWithGuests() {
    const guestArray = Array.from(guests); // Convert Set to Array
    const guestParam = encodeURIComponent(guestArray.join(',')); // Encode guests as a single string
    const newURL = `${window.location.origin}${window.location.pathname}?guests=${guestParam}`;
    window.history.pushState({}, '', newURL); // Update the URL without reloading the page
}
*/
async function loadGuestsFromDB() {
    try {
        const querySnapshot = await getDocs(guestsCollection);
        querySnapshot.forEach((doc) => {
            guests.add(doc.data().name);
        });
        console.log("Guests loaded: ", guests);
    } catch (error) {
        console.error("Error loading guests: ", error);
    }
}

async function init() {
    await loadGuestsFromDB();
    renderGuestList();
}

// Load guests from URL on initial page load
window.onload = init