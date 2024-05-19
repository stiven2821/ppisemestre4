import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import img1Noticias from "/assets/img/asesoria.jpg";
import Footer from "../components/Footer";
import axios from "axios";

// ...

const Noticias = () => {
  const [noticiasData, setNoticiasData] = useState([]);

  useEffect(() => {
    fetchNoticia();
  }, []);

  const fetchNoticia = async () => {
    try {
      const respuesta = await axios.get("http://localhost:4000/api/noticias");
      setNoticiasData(respuesta.data);
      fetchNoticia();
    } catch (error) {
      console.error("Error al obtener las noticias: ", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES"); // Setea el idioma a español (puedes ajustarlo según necesites)
  };

  return (
    <>
      <Header />
      <div className="container-sm">
        <div className="row">
          {noticiasData.map((noticia) => (
            <div key={noticia.id} className="card card-noticias">
              <img
                src={noticia.url_imagen}
                className="card-img-top p-2"
                alt="imagen-noticias"
              />
              <div className="card-body">
                <h5 className="card-title">{noticia.titulo}</h5>
                <p className="card-text">{noticia.descripcion}</p>
              </div>
              <div className="card-footer text-body-secondary text-center">
                {formatDate(noticia.fecha_publicacion)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Noticias;

