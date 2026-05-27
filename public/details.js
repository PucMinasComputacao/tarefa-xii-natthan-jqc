const API_KEY = "dd48c02c6572f22f45a1f5329955e9c9";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const movieDetails = document.getElementById("movie-details");
const message = document.getElementById("message");

function getMovieIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function showMessage(text) {
  message.textContent = text;
}

async function fetchMovieDetails(id) {
  try {
    showMessage("Carregando detalhes do filme...");

    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar detalhes do filme.");
    }

    const movie = await response.json();
    return movie;
  } catch (error) {
    console.error(error);
    showMessage("Erro ao carregar os detalhes do filme.");
    return null;
  }
}

function renderMovieDetails(movie) {
  movieDetails.innerHTML = "";

  if (!movie) {
    showMessage("Filme não encontrado.");
    return;
  }

  showMessage("");

  const container = document.createElement("div");
  container.classList.add("details-card");

  const poster = document.createElement("img");

  if (movie.poster_path) {
    poster.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
  } else {
    poster.src = "https://via.placeholder.com/500x750?text=Sem+Poster";
  }

  poster.alt = `Poster do filme ${movie.title}`;

  const info = document.createElement("div");
  info.classList.add("details-info");

  const title = document.createElement("h2");
  title.textContent = movie.title;

  const originalTitle = document.createElement("p");
  originalTitle.textContent = `Título original: ${movie.original_title}`;

  const releaseDate = document.createElement("p");
  releaseDate.textContent = `Data de lançamento: ${movie.release_date || "Não informada"}`;

  const rating = document.createElement("p");
  rating.textContent = `Nota média: ${movie.vote_average.toFixed(1)}`;

  const runtime = document.createElement("p");
  runtime.textContent = `Duração: ${movie.runtime ? movie.runtime + " minutos" : "Não informada"}`;

  const genres = document.createElement("p");
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");
  genres.textContent = `Gêneros: ${genreNames || "Não informado"}`;

  const overview = document.createElement("p");
  overview.textContent = `Sinopse: ${movie.overview || "Sinopse não disponível."}`;

  info.appendChild(title);
  info.appendChild(originalTitle);
  info.appendChild(releaseDate);
  info.appendChild(rating);
  info.appendChild(runtime);
  info.appendChild(genres);
  info.appendChild(overview);

  container.appendChild(poster);
  container.appendChild(info);

  movieDetails.appendChild(container);
}

async function initDetailsPage() {
  const movieId = getMovieIdFromUrl();

  if (!movieId) {
    showMessage("ID do filme não encontrado na URL.");
    return;
  }

  const movie = await fetchMovieDetails(movieId);
  renderMovieDetails(movie);
}

initDetailsPage();