import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      // return request.data.results;
    }
    fetchData().catch((err) => {
      console.log(err.message);
      console.log("something went wrong");
    });
  }, [fetchUrl]);

  const opts = {
    height: '390',
    width: '99.5%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: 0,
      loop: 1
    }
  }

  const handleClick = (movie) => {
    // console.log(movie.title);
    // console.log(movie.name);
    if(trailerUrl){
      setTrailerUrl("");
    }else{
      movieTrailer(movie?.title || "")
      .then(url =>{
        console.log(movie?.name);
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get('v'));
        console.log(trailerUrl);
      })
      .catch((error) => console.log(error))
    }
  }
  return (
    <div className="row">
      <h4>{title}</h4>

      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} /> }
      </div>
  );
};

export default Row;
