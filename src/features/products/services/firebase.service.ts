import { initializeApp } from "firebase/app";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import dotenv from "dotenv";

// Models
import { ProductImg } from "../models/product-img.model";

dotenv.config({ path: "./config.env" });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY as string,
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
  appId: process.env.FIREBASE_APP_ID as string,
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export const uploadProductImgs = async (imgs: any[], productId: number) => {
  const imgsPromises = imgs.map(async (img) => {
    const [originalName, ext] = img.originalname.split(".");
    const filename = `products/${productId}/${originalName}-${Date.now()}.${ext}`;
    const imgRef = ref(storage, filename);

    await uploadBytes(imgRef, img.buffer);

    const imgUrl = await getDownloadURL(imgRef);

    await ProductImg.create({
      productId,
      imgUrl,
      status: "active",
    });
  });

  await Promise.all(imgsPromises);
};
