const { initializeApp } = require("firebase/app");
const { ref, uploadBytes, getDownloadURL, getStorage } = require("firebase/storage");

// Model
const { ProductImg } = require("../models/productImg.model");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

// Storage service
const storage = getStorage(firebaseApp);

const uploadProductImgs = async (imgs, productId) => {
  // Map async -> Async operations with arrays
  const imgsPromises = imgs.map(async (img) => {
    // Create firebase reference
    const [originalName, ext] = img.originalname.split("."); // -> [pug, jpg]

    const filename = `products/${productId}/${originalName}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);

    // Upload image to Firebase
    await uploadBytes(imgRef, img.buffer);

    const imgUrl = await getDownloadURL(imgRef);

    await ProductImg.create({
      productId,
      imgUrl,
    });
  });

  await Promise.all(imgsPromises);
};

module.exports = { uploadProductImgs };
