# Search typeahead using Vanilla JS
A simple search typeahead implementation, which allows navigation in filtered result using mouse and keyboard.
The static content are rendered using **NodeJS Http Server**.

## Highlights
- On `DOMContentLoaded`, Makes API call to `DATA_URL` to fetch search data.
- Displays **loader**, untill We have response from Server.
- Upon `input` in text-box, displays *scrollable* filtered results.
- Highlights *all* the **matched** text, in the filtered results.
- Navigate the results using mouse, and *click* or press *Enter* to select the item.
- Navigate using keyboard *up-arrow* and *down-arrow* as well, and *click* or press *Enter* to select the item.
- While navigating using *keyboard*, selection of item on *mouse-hover* **disabled**.
- On Selection, alerts the selected item *ID* and **clears** the input box.

## Run Locally
- ensure you have `node` and `npm` installed.
- `git clone` the repo.
- Navigate to the folder.
- run `node index.js` to up the server.
