// Variables
const rickMortyContainer = $("#contenedor-personajes");
let pagina = 1;

// Funciones

function $(elemento) {
  return document.querySelector(elemento);
}

// ===============div modal cardOne
/* let rickMortyCardModal=[
  id:  
 ]
 */
const $modal = $("#modal");

async function obtenerDatos(pagina) {
  const url = `https://rickandmortyapi.com/api/character?page=${pagina}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  return datos;
}

async function obtenerPersonajesFiltro(filtro, valor) {
  const url = `https://rickandmortyapi.com/api/character?${filtro}=${valor}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  return datos;
}

async function obtenerPersonaje(id) {
  const url = `https://rickandmortyapi.com/api/character/${id}`;
  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  return datos;
}

function personajes(data) {
  for (let i = 0; i < data.length; i++) {
    const rickMorty = data[i];
    const rickMortyCard = `
        <div class="character-card" onclick="obtenerMasDetalles(${rickMorty.id})">
            <div class="personaje-card__img">
            <img src="${rickMorty.image}" alt="${rickMorty.name}" />
            </div>
            <div class="character-card__info">
            <h3 class="character-card__name">${rickMorty.name}</h3>
            <button class="btn-ver-mas">Ver más</button>
            </div>
        </div>
        `;
    rickMortyContainer.innerHTML += rickMortyCard;
  }
}

async function obtenerMasDetalles(id) {
  limpiarContenido();
  const rickMorty = await obtenerPersonaje(id);
  const rickMortyCard = `
        <div class="character-card">
            <div class="personaje-card__img">
            <img src="${rickMorty.image}" alt="${rickMorty.name}" />
            </div>
            <div class="character-card__info">
            <h3 class="character-card__name">${rickMorty.name}</h3>
            <p class="character-card_id"> ID:${rickMorty.id}</p>
            <p class="character-card__species"> species:${rickMorty.species}</p>
            <p clas ="character-card_gender"> gender: ${rickMorty.gender}</p>
            <p class="character-card_status"> status: ${rickMorty.status}</p>
            </div>
        </div>
        `;
  rickMortyContainer.innerHTML += rickMortyCard;
}

function mostrarTodosCaracteres(pagina) {
  obtenerDatos(pagina).then((datos) => {
    personajes(datos.results);
  });
}

// Eventos

window.addEventListener("load", () => {
  mostrarTodosCaracteres();
});

$("#btnSiguiente").addEventListener("click", () => {
  if (pagina === 42) {
    return;
  }
  rickMortyContainer.innerHTML = "";
  pagina++;
  mostrarTodosCaracteres(pagina);
});

$("#btnAnterior").addEventListener("click", () => {
  if (pagina === 1) {
    return;
  }
  rickMortyContainer.innerHTML = "";
  pagina--;
  mostrarTodosCaracteres(pagina);
});

$("#btnPrimeraPagina").addEventListener("click", () => {
  limpiarContenido();
  pagina = 1;
  mostrarTodosCaracteres(pagina);
});

$("#btnUltimaPagina").addEventListener("click", () => {
  limpiarContenido();
  pagina = 42;
  mostrarTodosCaracteres(pagina);
});

$("#busqueda").addEventListener("keyup", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  if (valor === "") {
    mostrarTodosCaracteres(pagina);
  } else {
    let busquedaPersonajes = await obtenerPersonajesFiltro("name", valor);
    busquedaPersonajes = busquedaPersonajes.results;
    personajes(busquedaPersonajes);
  }
});

$("#filtroOrden").addEventListener("change", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  let personajeFiltrado = [];
  if (valor === "A/Z") {
    const datos = await obtenerDatos(pagina);
    const listaPersonajes = datos.results;
    personajeFiltrado = listaPersonajes.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
  }
  if (valor === "Z/A") {
    const datos = await obtenerDatos(pagina);
    const listaPersonajes = datos.results;
    personajeFiltrado = listaPersonajes.sort((a, b) => {
      if (a.name < b.name) {
        return 1;
      }
      if (a.name > b.name) {
        return -1;
      }
      return 0;
    });
  }
  personajes(personajeFiltrado);
});

$("#filtroEstado").addEventListener("change", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  if (valor === "all") {
    mostrarTodosCaracteres(pagina);
  } else {
    let personajesFiltrados = await obtenerPersonajesFiltro("status", valor);
    personajesFiltrados = personajesFiltrados.results;
    personajes(personajesFiltrados);
  }
});

$("#filtroGenero").addEventListener("change", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  if (valor === "all") {
    mostrarTodosCaracteres(pagina);
  } else {
    let busquedaPersonajes = await obtenerPersonajesFiltro("gender", valor);
    busquedaPersonajes = busquedaPersonajes.results;
    personajes(busquedaPersonajes);
  }
});

$("#filtroEspecie").addEventListener("change", async (e) => {
  const valor = e.target.value;
  limpiarContenido();
  if (valor === "all") {
    mostrarTodosCaracteres(pagina);
  } else {
    let busquedaPersonajes = await obtenerPersonajesFiltro("species", valor);
    busquedaPersonajes = busquedaPersonajes.results;
    personajes(busquedaPersonajes);
  }
});

function limpiarContenido() {
  rickMortyContainer.innerHTML = "";
}
