// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuaKwHuGUlv2qUy5c_xmaJlPGZ9-dmc3w",
  authDomain: "hatchet-house-league.firebaseapp.com",
  databaseURL: "https://hatchet-house-league-default-rtdb.firebaseio.com/",
  projectId: "hatchet-house-league",
  storageBucket: "hatchet-house-league.firebasestorage.app",
  messagingSenderId: "412716105255",
  appId: "1:412716105255:web:cd3d51127cc86929769802"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function writeSomeData() {
  set(ref(database, 'people/'), {
    firstName: 'foo',
    lastName: 'bar'
  });

  set(ref(database, 'seasons/'), {
    year: 2025,
    season: 'spring'
  });

  set(ref(database, 'scores/'), {
    person: 'name',
    round: '00'
  });
}

writeSomeData();