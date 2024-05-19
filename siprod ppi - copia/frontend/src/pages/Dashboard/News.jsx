import React, { useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";
import { uploadFile } from "../../firebase/config";

const News = () => {
  const [values, setValues] = useState({
    inputTitulo: "",
    inputDescripcion: "",
    inputImagen: "",
    inputFPublicacion: "",
  });

  const [file, setFile] = useState(null);
  const [Imagenes, setImagenes] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const token = Cookies.get("token");
  const tokenData = JSON.parse(atob(token.split(".")[1]));
  let id = tokenData.id;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      Swal.fire({
        title: "Subiendo imagen",
        html: "Por favor, espera...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        console.log("Subiendo archivo...", file);
        setLoadingImages(true);
        const uploadedFileUrl = await uploadFile(file);
        console.log("URL del archivo subido:", uploadedFileUrl);

        const response = await axios.post(
          "http://localhost:4000/api/noticias",
          {
            ruta: uploadedFileUrl,
            usuario: id,
          }
        );
        console.log("Respuesta del servidor:", response);

        Swal.fire({
          icon: "success",
          title: "Imagen subida correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        setFile(null);
        // obtenerImagenes(); // Este método parece estar comentado o no definido aquí
        handleClose();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error al subir la imagen",
        });
      } finally {
        setLoadingImages(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "No se ha seleccionado un archivo.",
      });
    }
  };

  const capturarDatos = (e) => {
    const { name, value } = e.target;
    console.log("Antes de actualizar valores:", values);
    if (name === "inputFPublicacion" || name === "inputImagen") {
      setValues({
        ...values,
        [name]: e.target.files ? e.target.files[0] : value,
      });
    } else {
      setValues({ ...values, [name]: value });
    }
    console.log("Después de actualizar valores:", values);
  };

  return (
    <>
      <div className="card w-100">
        <form
          className="row g-3 p-3"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="col-md-12">
            <label htmlFor="inputTitulo" className="form-label">
              Titulo
            </label>
            <input
              type="text"
              className="form-control"
              id="inputTitulo"
              placeholder="lluvias en Barbosa"
              name="inputTitulo"
              value={values.inputTitulo}
              onChange={capturarDatos}
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="inputDescripcion" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control"
              placeholder="Pon la descripción de la noticia"
              id="inputDescripcion"
              style={{ height: "100px" }}
              name="inputDescripcion"
              value={values.inputDescripcion}
              onChange={capturarDatos}
            ></textarea>
          </div>
          <div className="col-6">
            <label htmlFor="inputImagen" className="form-label">
              Selecciona una imagen
            </label>
            <input
              className="form-control"
              type="file"
              id="inputImagen"
              name="inputImagen"
              onChange={handleFileChange}
            ></input>
          </div>
          <div className="col-6">
            <label htmlFor="inputFPublicacion" className="form-label">
              fecha publicación
            </label>
            <input
              type="date"
              className="form-control"
              id="inputFPublicacion"
              name="inputFPublicacion"
              value={values.inputFPublicacion}
              onChange={capturarDatos}
            />
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default News;
