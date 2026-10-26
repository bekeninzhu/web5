const types = [
  {id: "standard", title: "Standard", price: 3000, seats: 10},
  {id: "vip", title: "VIP", price: 6000, seats: 3}
];
const promos = ["STUDENT10"];
const soldOut = ["2027-01-11"];
const form = document.getElementById("ticket-form");
const fields = form.querySelectorAll("input, select");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const summary = document.getElementById("summary");
const touched = [];
form.noValidate = true;
function value(id) { return document.getElementById(id).value.trim(); }
function selectedType() {
  for (const type of types) {
    if (type.id === value("type")) return type;
  }
  return null;
}
function discount() {
  if (promos.includes(value("promo").toUpperCase())) return 0.1;
  return 0;
}
function total() {
  const type = selectedType();
  const quantity = Number(value("quantity"));
  if (!type || quantity < 1 || quantity > 10) return 0;
  return type.price * quantity * (1 - discount());
}
function addLine(parent, text) {
  const line = document.createElement("p");
  line.textContent = text;
  parent.appendChild(line);
}
function updatePreview() {
  preview.textContent = "";
  const type = selectedType();
  addLine(preview, "Event: " + (value("event") || "Choose an event"));
  addLine(preview, "Date: " + (value("date") || "Choose a date"));
  addLine(preview, "Ticket: " + (type ? type.title + " (" + type.seats + " left)" : "Choose a type"));
  addLine(preview, "Quantity: " + (value("quantity") || "0"));
  addLine(preview, "Name: " + value("name"));
  addLine(preview, "Email: " + value("email"));
  addLine(preview, "Total: " + total() + " KZT (preview)");
}
function validate(field) {
  field.setCustomValidity("");
  let error = "";
  const type = selectedType();
  if (field.id === "date" && soldOut.includes(field.value)) error = "This date is sold out.";
  if (field.id === "quantity" && type && Number(field.value) > type.seats) error = "Only " + type.seats + " seats are left for this type.";
  if (field.id === "name" && field.value.trim().indexOf(" ") === -1 && field.value !== "") error = "Enter your first and last name.";
  if (field.id === "promo" && field.value.trim() !== "" && discount() === 0) error = "Unknown promo code. Use STUDENT10 or leave empty.";
  if (error !== "") field.setCustomValidity(error);
  if (!field.checkValidity() && error === "") {
    if (field.validity.valueMissing) error = "Please fill in this field.";
    else if (field.validity.typeMismatch) error = "Enter a valid email address.";
    else if (field.validity.rangeUnderflow || field.validity.rangeOverflow) error = "Choose a value within the allowed range.";
    else if (field.validity.stepMismatch || field.validity.badInput) error = "Enter a whole number.";
    else error = "Check the value and its length.";
  }
  document.getElementById(field.id + "-error").textContent = error;
  field.setAttribute("aria-invalid", error !== "" ? "true" : "false");
  return error === "";
}
for (const field of fields) {
  field.setAttribute("aria-describedby", field.id + "-error");
  field.addEventListener("blur", function () {
    if (!touched.includes(field.id)) touched.push(field.id);
    validate(field);
  });
}
function update() {
  updatePreview();
  let errors = 0;
  for (const field of fields) {
    if (touched.includes(field.id) && !validate(field)) errors++;
  }
  if (summary.textContent !== "") {
    summary.textContent = errors ? "Please correct " + errors + " field(s)." : "";
  }
}
form.addEventListener("input", update);
form.addEventListener("change", update);
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let errors = 0;
  let first = null;
  for (const field of fields) {
    if (!touched.includes(field.id)) touched.push(field.id);
    if (!validate(field)) {
      errors++;
      if (first === null) first = field;
    }
  }
  summary.classList.add("error");
  if (errors > 0) {
    summary.textContent = "Please correct " + errors + " field(s).";
    first.focus();
    return;
  }
  result.textContent = "";
  result.classList.add("success");
  addLine(result, "Booking confirmed");
  addLine(result, "Booking code: WK" + (Math.floor(Math.random() * 900000) + 100000));
  addLine(result, value("name") + " | " + value("email"));
  addLine(result, value("event") + " | " + value("date"));
  addLine(result, selectedType().title + " x " + value("quantity"));
  addLine(result, "Paid: " + total() + " KZT");
  form.reset();
  touched.length = 0;
  summary.textContent = "";
  for (const field of fields) {
    field.setCustomValidity("");
    field.removeAttribute("aria-invalid");
    document.getElementById(field.id + "-error").textContent = "";
  }
  updatePreview();
});
updatePreview();
