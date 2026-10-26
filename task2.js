const LIMIT = 3;
const songs = [
  {id: 1, title: "Morning", seconds: 180, tags: ["Pop"], selected: false},
  {id: 2, title: "Sunshine", seconds: 200, tags: ["Pop"], selected: false},
  {id: 3, title: "City", seconds: 210, tags: ["Rock"], selected: false},
  {id: 4, title: "Dream", seconds: 160, tags: ["Jazz"], selected: false},
  {id: 5, title: "Summer", seconds: 190, tags: ["Pop"], selected: false},
  {id: 6, title: "Ocean", seconds: 220, tags: ["Jazz"], selected: false},
  {id: 7, title: "Night", seconds: 240, tags: ["Rock"], selected: false},
  {id: 8, title: "Home", seconds: 150, tags: ["Pop"], selected: false},
  {id: 9, title: "Rain", seconds: 170, tags: ["Jazz"], selected: false},
  {id: 10, title: "Road", seconds: 230, tags: ["Rock"], selected: false}
];
const list = document.getElementById("list");
const search = document.getElementById("search");
const message = document.getElementById("message");
let count = 0;
function render() {
  list.textContent = "";
  count = 0;
  let total = 0;
  let found = 0;
  for (const song of songs) {
    if (song.selected) {
      count++;
      total += song.seconds;
    }
    if (!song.title.toLowerCase().includes(search.value.toLowerCase())) continue;
    found++;
    const card = document.createElement("article");
    const text = document.createElement("p");
    text.textContent = song.title + " | " + song.tags.join(", ") + " | " + song.seconds + " sec";
    const button = document.createElement("button");
    button.textContent = song.selected ? "Remove" : "Add";
    button.dataset.id = song.id;
    card.appendChild(text);
    card.appendChild(button);
    list.appendChild(card);
  }
  if (found === 0) list.textContent = "Nothing found.";
  document.getElementById("total").textContent = count + " songs | Total: " + total + " seconds";
}
list.addEventListener("click", function (event) {
  if (event.target.tagName !== "BUTTON") return;
  for (const song of songs) {
    if (song.id !== Number(event.target.dataset.id)) continue;
    message.className = "error";
    if (!song.selected && count >= LIMIT) {
      message.textContent = "You can select only " + LIMIT + " songs.";
      return;
    }
    song.selected = !song.selected;
    message.className = "success";
    message.textContent = "Playlist updated.";
  }
  render();
});
search.addEventListener("input", function () {
  message.textContent = "";
  render();
});
render();
