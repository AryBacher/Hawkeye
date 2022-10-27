import React from "react";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import video from "../../../../Videos Tenis para Analizar/Video Ary 3 Saque.mp4";
import "../stylesheets/VideoPageStylesheets/VideoPage.css";
import { Button, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BtnStar from "../components/BtnStar";

function VideoPage() {
  //Que se fije si paso 0.1s del preVideoTime y si es asi que se fije si hay un punto nuevo y se le sume 0.1 a preVideoTime.

  //Sabemos cuando se ha pausado, cuando esta play y console logueamos cada segundo que pasa estando runneando.

  const videoTag = useRef();

  const writeTime = () => {
    console.log("Segundo " + videoTag.current.currentTime + " del video.");
  };

  let paused = true;

  const pts_pique = [
    { x: 40, y: 0, second: 5 },
    { x: 200, y: 35, second: 10.0 },
    { x: 200, y: 100, second: 15.0 },
    { x: 120, y: 120, second: 25.0 },
    { x: 35, y: 41, second: 7.0 },
    { x: 200, y: 400, second: 30.0 },
  ];


  const canvas = useRef(null);

  const knowTime = () => {
    setInterval(() => {

      if (!paused) {
        const circle = canvas.current.getContext("2d");
        const time = videoTag.current.currentTime;
        console.log("estas en el segundo "+time+" del video")
    
        const drawCircle = (x, y, secAppend) => {
    
          //Condición para agregar los circulos según su segundo en el json.
    
          if (secAppend <= time) {
            circle.beginPath();
            circle.arc(x, y, 3.5, 0, Math.PI * 2);
            circle.fillStyle = "#4ECB71";
            circle.fill();
            circle.closePath();
          }
          

          // Condición para borrar los puntos tras 10 segundos después de haber sido agregados.
    
          const secDelete = secAppend + 10;
    
          if(secDelete <= time){
            circle.clearRect( x, y, 3.5, 3.5);
          }
    
        };
    
        pts_pique.map((pts) => {
          console.log(time);
          drawCircle(pts.x, pts.y, pts.second);
        });
      }
    }, 100);
    
  };

  knowTime();

  // Estado para poder hacer ir switcheando de mapa y funciones para switchear entre ambos.

  const [mapActive, setMapActive] = useState(0);

  const handleNext = () => {
    if (mapActive === 0) {
      setMapActive(1);
    } else {
      setMapActive(0);
    }
    console.log(mapActive);
  };

  const handleBack = () => {
    if (mapActive === 1) {
      setMapActive(0);
    } else {
      setMapActive(1);
    }
    console.log(mapActive);
  };

  //Estado de la velocidad

  const [speed, setSpeed] = useState(0);

  // Dibujar los circulos del canvas según las coordenadas.


  return (
    <>
      <div className="wrapper-v">
        <Button className="btn-back" startIcon={<ChevronLeftIcon />}>
          Volver a análisis
        </Button>
        <div className="header-video">
          {" "}
          {/*Aca podemos meter cosas como el boton de volver, el título, un punto de color para saber el tipo de análisis, el boton para agregar a destacados y hasta un hipotetico botón de edición.*/}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "15px" }}
          >
            <rect width="10" height="10" rx="5" fill="#0075FF" />{" "}
            {/* Esto es variable y depende del tipo de análisis*/}
          </svg>
          <h1>Ary Bacher entrenamiento N°1</h1>
          <BtnStar state={false} />
        </div>
        <div className="content">
          <video
            id='videito'
            src={video}
            controls
            ref={videoTag}
            onf
            onPlay={() => {
              paused = false;
            }}
            onPause={() => {
              paused = true;
            }}
          ></video>
          <div className="stats">
            <div className="minimap-container">
              <div className="title-map">
                <IconButton onClick={handleBack}>
                  <ChevronLeftIcon />
                </IconButton>
                <div className="title">
                  {" "}
                  {/*Podemos ver de que lo haga al toque o con esta animación*/}
                  <h2
                    className={
                      mapActive === 0 ? "points" : "points points-disabled"
                    }
                  >
                    Mapa de puntos
                  </h2>
                  <h2 className={mapActive === 1 ? "heat heat-active" : "heat"}>
                    Mapa de calor
                  </h2>
                </div>
                <IconButton onClick={handleNext}>
                  <ChevronRightIcon />
                </IconButton>
              </div>
              <div className="minimap">
                <div
                  className={
                    mapActive === 0 ? "points" : "points points-disabled"
                  }
                >
                  <canvas
                    id="canvas"
                    ref={canvas}
                    width="268px"
                    height="524px"
                    style={{
                      position: "relative",
                      left: "0",
                      top: "0",
                      zIndex: "100",
                    }}
                  ></canvas>
                </div>{" "}
                {/*points*/}
                <div className={mapActive === 1 ? "heat heat-active" : "heat"}>
                  Calor
                </div>{" "}
                {/*heat*/}
              </div>
              <div className="map-indicator">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1.33264"
                    y="1.26953"
                    width="9"
                    height="9"
                    rx="4.5"
                    fill={mapActive === 0 ? "#4ECB71" : "#151F27"}
                  />
                  <rect
                    x="1.33264"
                    y="1.26953"
                    width="9"
                    height="9"
                    rx="4.5"
                    stroke={mapActive === 0 ? "#4ECB71" : "#233545"}
                  />
                </svg>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1.33264"
                    y="1.26953"
                    width="9"
                    height="9"
                    rx="4.5"
                    fill={mapActive === 1 ? "#4ECB71" : "#151F27"}
                  />
                  <rect
                    x="1.33264"
                    y="1.26953"
                    width="9"
                    height="9"
                    rx="4.5"
                    stroke={mapActive === 1 ? "#4ECB71" : "#233545"}
                  />
                </svg>
              </div>
            </div>
            <div className="speed-container">
              <h2>
                Velocidad <span>{speed}</span> km/h
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoPage;

/*

        <div className="video-container">
          <video src={video} controls></video>
        </div>
        <div className="stats">
          <div className="minimap">
            <h2>Mapa de puntos</h2>
            <div className="map-container"></div>
          </div>
          <div className="speed">
            <h2>
              Velocidad <span>72</span> km/h
            </h2>
          </div>
        </div>

*/

//Agregar botón para volver a la página previa.

//Heatmap:
//Puntos:
//Velocidad:

//Parte de lo de Alan

/*
  <div>Video Page</div>
  <button type="submit"> Subir </button>
  <video width="320" height="240" controls src= "D:\Documentos\GitHub\Hawkeye\Back-End\server/videos/21a5fe09-7018-4377-8ad2-774fba7dbbdb.mp4" type = "*video" />
*/

/*
  const finalValues = { id: "21a5fe09-7018-4377-8ad2-774fba7dbbdb.mp4" }

  const useAxios = async (values)=>{
  await axios.post('http://localhost:4000/GetVideo', JSON.stringify(values), {
      headers: { 'Content-Type': 'application/JSON' },
      withCredentials: true,
    })

    .then(response => {console.log(response.data);}) 
    .catch(err => {console.log(err);})
  }
    
    
  useEffect(() => {
    useAxios(finalValues)
  },[])

  */
