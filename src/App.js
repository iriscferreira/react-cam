import React, { useRef, useEffect, useState } from "react";
import api from "./services/api";


function App() {
  const [user, setUser] = useState();

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);

  const callApi = () => {
    api
    .get("/users/romulo27")
    .then(response => {
      console.log('response', response)
      setUser(response.data)
    })
    .catch((err) => {
      console.error("ops! ocorreu um erro" + err);
    });

  }

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia(
      {
        video: { width: 1920, height: 1080 }
      })
      .then( stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch( err => {
        console.error(err);
      })
  }

  const takePhoto = () => {
    const width = 414;
    const height= width / (16/9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0,0, width, height);
    setHasPhoto(true);
  }

  const closePhoto = () => {

    let photo = photoRef.current;
    let ctx = photo.getContext('2d');
    setHasPhoto(false);

    ctx.clearRect(0,0, photo.width, photo.height);
  }

  useEffect(() => {
    callApi();

    getVideo();
  }, [videoRef])


  return (
    <div className="App">
       <p>Usuário: {user?.login}</p>
      <p>Biografia: {user?.bio}</p>
      <div className="camera"></div>
      <video ref={videoRef}></video>
      <button onClick={takePhoto}>SNAP</button>
      <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
        <canvas ref={photoRef}></canvas>
        <button onClick={closePhoto}>CLOSE</button>
      </div>
    </div>
  );
}

export default App;
