let videos = [];

fetch("data/videos.json")
  .then(response => response.json())
  .then(data => {
    videos = data;
    populateAllFilters(videos);
    displayVideos(videos);
  });

function populateAllFilters(data, activeFilter = "") {
  // Récupère la sélection actuelle
  const current = {
    carte: document.getElementById("filter-carte").value,
    rupture: document.getElementById("filter-rupture").value,
    donnee: document.getElementById("filter-donnee").value
  };

  // On filtre les données selon la sélection (sauf celle qu'on est en train de changer)
  const filtered = data.filter(video =>
    (activeFilter === "carte" || current.carte === "" || video.carte === current.carte) &&
    (activeFilter === "rupture" || current.rupture === "" || video.type_rupture === current.rupture) &&
    (activeFilter === "donnee" || current.donnee === "" || video.donnee_impactee === current.donnee)
  );

  // Extraire les valeurs disponibles
  const cartes = new Set(filtered.map(v => v.carte));
  const ruptures = new Set(filtered.map(v => v.type_rupture));
  const donnees = new Set(filtered.map(v => v.donnee_impactee));

  // Réinjecte dans les menus
  fillSelect("filter-carte", cartes, current.carte);
  fillSelect("filter-rupture", ruptures, current.rupture);
  fillSelect("filter-donnee", donnees, current.donnee);
}

function fillSelect(id, values, currentValue) {
  const select = document.getElementById(id);
  const old = select.value;

  // Vide le menu
  select.innerHTML = "";

  // Ajoute l’option par défaut
  const option = document.createElement("option");
  option.value = "";
  option.textContent = "-- Tous --";
  select.appendChild(option);

  // Trie les valeurs et ajoute-les
  [...values].sort().forEach(val => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = val;
    if (val === currentValue) opt.selected = true;
    select.appendChild(opt);
  });
}

function onFilterChange() {
  populateAllFilters(videos);  // Mise à jour croisée des menus
  const carte = document.getElementById("filter-carte").value;
  const rupture = document.getElementById("filter-rupture").value;
  const donnee = document.getElementById("filter-donnee").value;

  const filtered = videos.filter(video =>
    (carte === "" || video.carte === carte) &&
    (rupture === "" || video.type_rupture === rupture) &&
    (donnee === "" || video.donnee_impactee === donnee)
  );

  displayVideos(filtered);
}

function displayVideos(list) {
  const container = document.getElementById("video-list");
  container.innerHTML = "";

  // Met à jour le compteur
  document.getElementById("video-count").textContent = `Total : ${list.length} ruptures`;

  list.forEach(video => {
    const div = document.createElement("div");
    div.className = "video-card";
    div.innerHTML = `
      <video src="Videos/${video.filename}" controls></video><br>
      <button class="details-button">Voir détails</button>
    `;
    const btn = div.querySelector(".details-button");
    btn.addEventListener("click", () => openModal(video));
    container.appendChild(div);
  });
}

function resetFilters() {
  document.getElementById("filter-carte").value = "";
  document.getElementById("filter-rupture").value = "";
  document.getElementById("filter-donnee").value = "";
  populateAllFilters(videos);
  displayVideos(videos);
}

function openModal(video) {
  document.getElementById("modal-filename").textContent = video.filename;
  document.getElementById("modal-carte").textContent = video.carte;
  document.getElementById("modal-rupture").textContent = video.type_rupture;
  document.getElementById("modal-donnee").textContent = video.donnee_impactee;
  document.getElementById("modal-video").src = "Videos/" + video.filename;

  document.getElementById("modal-overlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.getElementById("modal-video").pause();  // Stoppe la lecture
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}
