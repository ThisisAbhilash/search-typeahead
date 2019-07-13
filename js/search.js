
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

async function fetchData() {
  try {
    const loaderElement = document.getElementById('loader'),
      searchBody = document.getElementById('search');

    const data = await (await fetch('/api/fetch-data')).json();
    typeAhead(document.getElementById("search-input"), data);
    loaderElement.style.display = 'none';
    searchBody.style.display = 'block';
  } catch (error) {
    loaderElement.style.display = 'none';
    searchBody.style.display = 'block';
    console.log(`[Error]:- failed to load data ${JSON.stringify(error)}`);
  }
}

function isMatch(item, text) {
  var result = false;
  for(var key in item) {
    if(typeof item[key] === 'object') {
      result = result || isMatch(item[key], text);
    }
    else {
      result = result || item[key].toLowerCase().indexOf(text.toLowerCase()) > -1;
    }
  }
  return result;
}

function typeAhead(inputElement, allAvailableOptions) {
  var currentFocus;
  inputElement.addEventListener("input", function() {
      var divElement, contentElement, index, searchedContent = this.value, noMatchFound = true;
      closeAllLists();
      if (!searchedContent) { return false;}
      currentFocus = -1;

      divElement = document.createElement("div");
      divElement.setAttribute("id", this.id + "typeahead-list");
      divElement.setAttribute("class", "typeahead-items");
      divElement.classList.add('apply-hover');

      this.parentNode.appendChild(divElement);
      
      for (index = 0; index < allAvailableOptions.length; index++) {
        if(isMatch(allAvailableOptions[index], searchedContent)) {

          contentElement = document.createElement("div");
          contentElement.setAttribute("class", "card");

          contentElement = createCard(contentElement, allAvailableOptions[index], searchedContent);

          contentElement.addEventListener("click", function(allAvailableOptions, index) {
            return function() {
              alert('Selected Id:- ' + allAvailableOptions[index].id);
              closeAllLists();
              inputElement.value = '';
            }
          }(allAvailableOptions, index));

          divElement.appendChild(contentElement);
          noMatchFound = false;
        }
      }
      if(noMatchFound) {
        contentElement = document.createElement("div");
        contentElement.setAttribute("class", "card");
        contentElement.innerHTML = "<span>No Search Results.</span>";
        divElement.style.pointerEvents = 'none';
        divElement.appendChild(contentElement);
      }
  });

  function createCard(element, item, text) {
    Object.keys(item).map(eachKey => {
      var currStr = item[eachKey].toString(), startIndex = currStr.toLowerCase().indexOf(text.toLowerCase());
      element.innerHTML += startIndex === -1 ? "<span>" + currStr + "</span><br />" :
        "<span>" + currStr.substr(0, startIndex) + "<strong>" + currStr.substr(startIndex, text.length) + "</strong>" + currStr.substr(startIndex + text.length) + "</span><br />";
    });
    return element;
  }

  inputElement.addEventListener("keydown", function(e) {
      var typeAheadList = document.getElementById(this.id + "typeahead-list");

      if (typeAheadList) {
        //removing mousehover effect as navigation performed by keyboard
        typeAheadList.classList.remove('apply-hover');

        typeAheadList = typeAheadList.getElementsByTagName("div");
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(typeAheadList);
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(typeAheadList);
        } else if (e.keyCode == 13) {
          if (currentFocus > -1) {
            typeAheadList[currentFocus].click();
          }
        }
    }
  });

  function addActive(elemArr) {
    if (!elemArr) return false;
    removeActive(elemArr);
    if (currentFocus >= elemArr.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (elemArr.length - 1);
    
    elemArr[currentFocus].classList.add("typeahead-active");
    elemArr[currentFocus].scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  }

  function removeActive(elemArr) {
    for (var i = 0; i < elemArr.length; i++) {
      elemArr[i].classList.remove("typeahead-active");
    }
  }

  function closeAllLists() {
    var typeAheadItems = document.getElementsByClassName("typeahead-items");
    for (var i = 0; i < typeAheadItems.length; i++) {
      typeAheadItems[i].parentNode.removeChild(typeAheadItems[i]);
    }
  }
}
