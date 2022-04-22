import React, { useRef, useEffect, useState } from "react";
import api from "./services/api";


function App() {
  const [user, setUser] = useState(null);
  console.log('user----', user)

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);

  const callApi = () => {

    let config = {
      headers: { 'Access-Control-Allow-Origin': '*'}
    }

    var headers = { 'Access-Control-Allow-Origin': '*'};

    api
      .get("/createsession", config)
      .then(response => {
        console.log('response', response)
        let responseApi = response.data
        console.log('responseApi', responseApi)
        setUser(response.data)
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });

  }


  const sendPhotoToS3 = (img) => {
    let user1 = '7f35e8f2-cd82-45dd-8430-7309777e6de'
    let url = 'ab3-user-image/' + '7f35e8f2-cd82-45dd-8430-7309777e6de' + '.jpeg'
    console.log('urllll', url)

    var data = img;

    let config = {
      headers: {'Content-Type': 'image/jpeg', 'Access-Control-Allow-Origin': '*'}
    }

    api
      .put(url,  data, config)
      .then((response) => {
        console.log('response sendPhototoS3', response)
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
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error(err);
      })

    return (
      <div>
        <video ref={videoRef}></video>
        <button onClick={takePhoto}>SNAP</button>
      </div>

    )
  }

  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);

    var img = photo.toDataURL("image/jpeg");

    sendPhotoToS3(img);
  }

  const closePhoto = () => {

    let photo = photoRef.current;
    let ctx = photo.getContext('2d');
    setHasPhoto(false);

    ctx.clearRect(0, 0, photo.width, photo.height);
  }

  useEffect(() => {

  }, [videoRef], [user])


  return (
    <div className="App">

      {user ? getVideo() : <button className="buttonStart" onClick={callApi}>INICIAR</button>}

      <div className={'camera ' + (user ? <video ref={videoRef}></video> : '')}>
      </div>

      <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
        <canvas ref={photoRef}></canvas>
        <button onClick={closePhoto}>CLOSE</button>
      </div>
    </div>
  );
}

export default App;
