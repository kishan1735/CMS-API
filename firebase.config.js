// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// const { getAnalytics } = require("firebase/analytics");
const {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
} = require("firebase/storage");
const BUCKET_URL = "gs://cms-api-fad0c.appspot.com";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcGE4n4mbco1CENMOx3nm4COSGwNSp5zk",
  authDomain: "cms-api-fad0c.firebaseapp.com",
  projectId: "cms-api-fad0c",
  storageBucket: "cms-api-fad0c.appspot.com",
  messagingSenderId: "371209300336",
  appId: "1:371209300336:web:3b5ef2ee301af23bba87b5",
  measurementId: "G-8715YHGQ65",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const storage = getStorage();
// const spaceRef = ref(storage, "public/courseFiles  ");

exports.uploadFile = async (file, ext, formattedDate) => {
  const bucket = `${BUCKET_URL}/${formattedDate}.${ext}`;
  const storageRef = ref(storage, bucket);

  await uploadBytes(storageRef, file);
};

exports.deleteFile = async (formattedDate, ext) => {
  const bucket = `${BUCKET_URL}/${formattedDate}.${ext}`;
  const desertRef = ref(storage, bucket);

  await deleteObject(desertRef);
};
