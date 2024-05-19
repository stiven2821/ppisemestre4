import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDv9UMlwGbFi20fsYWkmrhs3koC8VNo-xw",
  authDomain: "siprod-939fb.firebaseapp.com",
  projectId: "siprod-939fb",
  storageBucket: "siprod-939fb.appspot.com",
  messagingSenderId: "40184130357",
  appId: "1:40184130357:web:c25af1ee46e23d96367a7c"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


/**
 * sube un archivo a fireBaseStorage
 * @param {FILE} file archivo a subir
 * @returns {Promise<string>}url de la imagen subida
 */

export async function uploadFile(file) {
  const storageRef = ref(storage, "imagenes/" + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}