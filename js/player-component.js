// https://ithy.com/article/web-component-guide-q8tkpy2u

/* Define the web component class */
class PlaylistPlayerComponent extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow DOM to encapsulate styles and markup
    this.attachShadow({ mode: "open" });
  }

  /* Lifecycle method called when the component is added to the DOM */
  connectedCallback() {
    // Initiate fetching data once the component is connected
    this.fetchData();
  }

  /* Fetch the external JSON data */
  async fetchData() {
    const jsonPath = this.getAttribute("src"); // Get JSON file path from attribute
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      const playlistData = await response.json();
      // Call function to render list from fetched playlistData
      this.renderList(playlistData);
    } catch (error) {
      console.error("Error fetching the JSON data:", error);
      this.renderError(error);
    }
  }

  /* Render the list items using the fetched JSON playlistData */
  __renderList(playlistData) {
    // Create a container for the list
    const list = document.createElement("ul");

    // Iterate through the playlistData array and create list items
    playlistData.forEach((item) => {
      const listItem = document.createElement("li");
      // Format the list item using item properties: name and description
      listItem.textContent = `${item.name} - ${item.description}`;
      list.appendChild(listItem);
    });

    // Clear any previous content
    this.shadowRoot.innerHTML = "";
    // Append styles and list to shadowRoot for encapsulation
    const style = document.createElement("style");
    style.textContent = `
          ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }
          li {
            padding: 10px;
            border-bottom: 1px solid #ccc;
            font-family: Arial, sans-serif;
          }
        `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(list);
  }

  renderList(playlistData) {
    const stylePath = this.getAttribute("style-src");
    const styleLink = document.createElement("link");
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("href", stylePath);

    const container = document.createElement("div");
    container.classList.add("container");

    const player = document.createElement("div");
    player.classList.add("player");
    container.appendChild(player);

    const playerBar = document.createElement("div");
    playerBar.classList.add("playerBar");
    player.appendChild(playerBar);

    const parallelLines = document.createElement("div");
    parallelLines.classList.add("parallel-lines");
    parallelLines.appendChild(document.createElement("div"));
    parallelLines.appendChild(document.createElement("div"));
    playerBar.appendChild(parallelLines);

    const playerBarTitle = document.createElement("h1");
    playerBarTitle.textContent = playlistData.playlistTitle;

    playerBar.appendChild(playerBarTitle);

    // can't reuse elements, have to create discrete elements for every instance
    const parallelLines2 = document.createElement("div");
    parallelLines2.classList.add("parallel-lines");
    parallelLines2.appendChild(document.createElement("div"));
    parallelLines2.appendChild(document.createElement("div"));
    playerBar.appendChild(parallelLines2);

    const playerContent = document.createElement("div");
    playerContent.classList.add("player-content");
    player.appendChild(playerContent);

    const playerAlbumArt = document.createElement("div");
    playerAlbumArt.setAttribute("id", "player-album-art");
    playerContent.appendChild(playerAlbumArt);

    const albumArtImg = document.createElement("img");
    albumArtImg.setAttribute("src", "/img/VZ_alias_spectrogram_1920_1080.jpg");
    playerAlbumArt.appendChild(albumArtImg);

    // Clear any previous content
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(container);
  }

  /* Render an error message if JSON fetching fails */
  renderError(error) {
    this.shadowRoot.innerHTML = `<p>Error loading data: ${error.message}</p>`;
  }
}

/* Define the new custom element */
customElements.define("playlist-component", PlaylistPlayerComponent);
