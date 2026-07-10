      "use strict";
      let data;
      let dataHeaders;
      let test = document.querySelector("#test");
      let thead = document.querySelector("#thead");
      let tbody = document.querySelector("#tbody");
      let th;
      let txt;
      let url = "veranstaltungen_2021-2026_extern.json";
      //variables for filter
          let searchText = "";
      let varReferent = ""; //referent

            //Datenvariablen
      let dataFiltered;
      let filterSetReferent = new Set();
      let watchList = [];
      let varOrt = "";
      let varArt = "";
      let varJahr = "";
      let varDate = "";
      let labels;
      let filterSetOrt = new Set();
      let filterSetArt = new Set();
      let filterSetJahr = new Set();
      let filterSetDatum = new Set();
      


const referentFilter = document.getElementById("referentFilter");
const search = document.querySelector("#search");
const ortFilter = document.getElementById("ortFilter");
const artFilter = document.getElementById("artFilter");
const jahrFilter = document.getElementById("jahrFilter");
const dateFilter = document.getElementById("dateFilter");
const reset = document.querySelector("#reset");
const today = new Date().toISOString().slice(0, 10);
//const endDate = excelDateToISO(item.end_datum);
// theme and size adjustments
  const root = document.documentElement;

  const themeToggle = document.querySelector('[data-theme-toggle]');
    const themeToggleSelector = '[data-theme-toggle]';

 let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  const updateThemeLabel = () => {
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren');
    themeToggle.querySelector('.theme-toggle__icon').textContent = theme === 'dark' ? '☀' : '◐';
  };

  updateThemeLabel();

  themeToggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    localStorage.setItem('myStyle', theme);
    updateThemeLabel();
  });

  (function () {
    const step = 10;
    const min = 80;
    const max = 160;
    const storageKey = 'fontSizePercent';

    let size = parseInt(localStorage.getItem(storageKey), 10);
    if (Number.isNaN(size)) size = 100;

    function applySize(value) {
      const clamped = Math.min(max, Math.max(min, value));
      root.style.fontSize = clamped + '%';
      localStorage.setItem(storageKey, String(clamped));
      return clamped;
    }

    applySize(size);

    document.querySelector('[data-font-increase]')?.addEventListener('click', function () {
      size = applySize(size + step);
    });

        document.querySelector('[data-font-reset]')?.addEventListener('click', function () {
      size = applySize(100);
    });

    document.querySelector('[data-font-decrease]')?.addEventListener('click', function () {
      size = applySize(size - step);
    });
  })();

(function () {
  const past = document.querySelector("[past-toggle]");
  const all = document.querySelector("[all-toggle]");
  const future = document.querySelector("[future-toggle]");

  function filterEventsTime(value) {
    varDate = value;
    displayData();
  }

  past?.addEventListener("click", function () {
    filterEventsTime("past");
  });

  all?.addEventListener("click", function () {
    filterEventsTime("all");
  });

  future?.addEventListener("click", function () {
    filterEventsTime("future");
  });
})();



  window.onload = function () {
    if (localStorage.getItem('myStyle')) {
      theme = localStorage.getItem('myStyle');
      root.setAttribute ("data-theme", theme);
      updateThemeLabel();
    }
  }

  /////// 

      function filterByNavReferent() {
        //this ist das angeklickte element
        varReferent = this.getAttribute("data-info-referent") || "";
        displayData();
      }
            function filterByNavOrt() {
        //this ist das angeklickte element
        varOrt = this.getAttribute("data-info-ort");
        displayData();
      }
            function filterByNavArt() {
        //this ist das angeklickte element
        varArt = this.getAttribute("data-info-art");
        displayData();
      }

                  function filterByNavJahr() {
        //this ist das angeklickte element
        varJahr = this.getAttribute("data-info-jahr");
        displayData();
      }

      //             function filterByNavDate() {
      //   //this ist das angeklickte element
      //   type = this.getAttribute("data-info-date");
      //   displayData();
      // }

      search.onkeyup = function () {
        searchText = this.value;
        displayData();
      };

            reset.onclick = function () {
            searchText = "";
          search.value = "";
          varReferent = "";
          varOrt = "";
          varArt = "";
          varJahr = "";
          varDate = "";
          sortData("datum", 0);
};

      async function loadData() {
        let resp = await fetch(url);
        fetch("labels.json");
        let resplabels = await fetch ("labels.json");
        data = await resp.json();
        labels = await resplabels.json();
        //Array der Objekt-Schlüsselworte
        dataHeaders = Object.keys(data[0]);
        console.log(dataHeaders);
      }
      //search filter
      function filterData() {
        dataFiltered = data.filter((element) => {
              const endDate = excelDateToISOforComp(element.end_datum);
    const isPast = endDate < today;
    const isFuture = endDate >= today;
          return (
            (element.titel.toUpperCase().includes(searchText.toUpperCase()) || element.Zusammenfassung.toUpperCase().includes(searchText.toUpperCase()))
            &&
            //element.Datum <= max &&
            (varReferent != "" ? element.referent == varReferent : true)
            && (varOrt != "" ? element.ort == varOrt : true)
            && (varArt != "" ? element.art == varArt : true)
            && (varJahr != "" ? element.jahr == varJahr : true)
            && (
        varDate === "" || varDate === "all"
          ? true
          : varDate === "past"
          ? isPast
          : isFuture
      )

          );
        });
      }


  
      function displayHeaders() {
        txt = "";
        txt += "<tr>";
        dataHeaders.forEach((element) => {


                       if (element == "id" || element == "meeting_id"|| element == "kursnummer" || element == "start_datum"
                         || element == "end_datum" || element == "prenom" || element == "postnom" || element == "zoom_link"
                        || element == "parent_id" || element == "is_subevent") {
               return;
             }

          txt += `<th data-prop="${element}">${labels[element] || element}</th>`;
        });
        txt += "</tr>";
        thead.innerHTML = txt;
      }

      function displayData() {
        txt = "";
        filterData();
        //Zeile für Zeile
         console.log("filtered rows:", dataFiltered);
        dataFiltered.forEach((item) => {
          txt += "<tr>";
          //Spalte für Spalte
          
          dataHeaders.forEach((element) => {
                          if (item.start_datum === item.end_datum) {
                item.datum = excelDateToISO(item.start_datum)
              } else {
                item.datum = `${excelDateToISO(item.start_datum)}-${excelDateToISO(item.end_datum)}`;
              }

             if (element == "id"|| element == "meeting_id"|| element == "kursnummer"|| element == "start_datum" || 
              element == "end_datum"   || element == "prenom" || element == "postnom" || element == "zoom_link"
             || element == "parent_id" || element == "is_subevent") {
               return;
             }

            let entry;
            if (element == "start_datum" || element == "end_datum") {
              entry = excelDateToISO (
                item[element]
              )
                           
            } else {
              entry = item[element];
            }

            if (element == "zoom_link" && entry != "") {
              entry = `<a href="${entry}" target="_blank">Zoom-Link</a>`
            } else {
              
            }

            if (element == "youtube" && entry != "") {
              entry = `<a href="${entry}" target="_blank">Link zum Video auf Youtube</a>`
            } else {
              
            }
                        if (element == "homepage_link" && entry != "") {
              entry = `<a href="${entry}" target="_blank">Link zur Veranstaltungseite</a>`
            } else {
              
            }
            if (element == "podcast" && entry != ""){
              entry = `<audio  id="myAudio" controls loop><source src="${entry}" type="audio/mpeg"></audio>`
            }
            if (element == "Zusammenfassung" && entry != "") {
              entry = `<details><summary><i>Zusammenfassung anzeigen / ausblenden </i></summary>"${entry}"</details>`
            } else {}


            txt += `<td>${entry}</td>`;
          });
          txt += "</tr>";
        });
        tbody.innerHTML = txt;
      }

            //Navigation aufbauen
            
      function displayFilterNav() {
        data.forEach((element) => {
          filterSetReferent.add(element.referent);
          filterSetOrt.add(element.ort);
          filterSetArt.add(element.art);
          element.jahr = excelDateToISO(element.start_datum).slice(6,10);
          filterSetJahr.add(element.jahr);
          // filterSetDate.add(element.date);
        });

          let liAllReferent = document.createElement("li");
  let aAllReferent = document.createElement("a");
  aAllReferent.href = "#";
  aAllReferent.classList.add("filterReferent");
  aAllReferent.textContent = "ALLE ANZEIGEN";
  aAllReferent.setAttribute("data-info-referent", "");
  aAllReferent.onclick = filterByNavReferent;
  liAllReferent.append(aAllReferent);
  referentFilter.append(liAllReferent);

  let liAllOrt = document.createElement("li");
  let aAllOrt = document.createElement("a");
  aAllOrt.href = "#";
  aAllOrt.classList.add("filterOrt");
  aAllOrt.textContent = "ALLE ANZEIGEN";
  aAllOrt.setAttribute("data-info-ort", "");
  aAllOrt.onclick = filterByNavOrt;
  liAllOrt.append(aAllOrt);
  ortFilter.append(liAllOrt);

  let liAllArt = document.createElement("li");
  let aAllArt = document.createElement("a");
  aAllArt.href = "#";
  aAllArt.classList.add("filterArt");
  aAllArt.textContent = "ALLE ANZEIGEN";
  aAllArt.setAttribute("data-info-art", "");
  aAllArt.onclick = filterByNavArt;
  liAllArt.append(aAllArt);
  artFilter.append(liAllArt);

    let liAllJahr = document.createElement("li");
  let aAllJahr = document.createElement("a");
  aAllJahr.href = "#";
  aAllJahr.classList.add("filterJahr");
  aAllJahr.textContent = "ALLE ANZEIGEN";
  aAllJahr.setAttribute("data-info-jahr", "");
  aAllJahr.onclick = filterByNavJahr;
  liAllJahr.append(aAllJahr);
  jahrFilter.append(liAllJahr);

        filterSetReferent.forEach((link) => {
          let a = document.createElement("a");
          //Attribute hinzufügen
          a.href = "#";
          a.classList.add("filterReferent");
          a.textContent = link;
          a.onclick = filterByNavReferent;
          a.setAttribute("data-info-referent", link);
          //Listenelement erstellen
        let li = document.createElement("li");
          li.append(a);
          referentFilter.append(li);
         displayData();

        });

                filterSetOrt.forEach((link) => {
          let a = document.createElement("a");
          //Attribute hinzufügen
          a.href = "#";
          a.classList.add("filterOrt");
          a.textContent = link;
          a.onclick = filterByNavOrt;
          a.setAttribute("data-info-ort", link);
          //Listenelement erstellen
        let li = document.createElement("li");
          li.append(a);
          ortFilter.append(li);
        });

                        filterSetArt.forEach((link) => {
          let a = document.createElement("a");
          //Attribute hinzufügen
          a.href = "#";
          a.classList.add("filterArt");
          a.textContent = link;
          a.onclick = filterByNavArt;
          a.setAttribute("data-info-art", link);
          //Listenelement erstellen
        let li = document.createElement("li");
          li.append(a);
          artFilter.append(li);

        });

                                filterSetJahr.forEach((link) => {
          let a = document.createElement("a");
          //Attribute hinzufügen
          a.href = "#";
          a.classList.add("filterJahr");
          a.textContent = link;
          a.onclick = filterByNavJahr;
          a.setAttribute("data-info-jahr", link);
          //Listenelement erstellen
        let li = document.createElement("li");
          li.append(a);
          jahrFilter.append(li);

        });

        //                         filterSetDate.forEach((link) => {
        //   let a = document.createElement("a");
        //   //Attribute hinzufügen
        //   a.href = "#";
        //   a.classList.add("filterDate");
        //   a.textContent = link;
        //   a.onclick = filterByNavDate;
        //   a.setAttribute("data-info-date", link);
        //   //Listenelement erstellen
        // let li = document.createElement("li");
        //   li.append(a);
        //   dateFilter.append(li);

        // });

        //         filternavOrt.forEach((element) => {
        //   element.onclick = filterByNavOrt;
        // });
        //         filternavArt.forEach((element) => {
        //   element.onclick = filterByNavArt;
        // });
        //         filternavReferent.forEach((element) => {
        //   element.onclick = filterByNavReferent;
        // });
        //         filternavJahr.forEach((element) => {
        //   element.onclick = filterByNavJahr;
        // });
        //         filternavDate.forEach((element) => {
        //   element.onclick = filterByNavDate;
        // });
      }

    
/*             function displayYearFilterNav() {
        data.forEach((element) => {
          filterYearSet.add(element.start_datum.year);
        });

          //Listenelement erstellen
        let op = document.createElement("option");
          op.textContent = filterYearSet;
          op.onclick = filterByYearNav;
          groups.appendchild(option);
        displayData();

        });
      } */
      //"event listener"
            function actions() {
        th = document.querySelectorAll("#thead th");
        th.forEach(function (element) {
          element.onclick = function () {
            // this is for the element that was clicked
            let myprop = this.getAttribute("data-prop");
            sortData(myprop, this);
          };
        });
      }
                //Sortierung - Wonach, Wie
 function sortData(prop, ob) {
        let desc = false;

        th.forEach((element) => {
          //Pfeile hinzufügen

          if (element === ob) {
            if (element.classList.contains("asc")) {
              element.classList.remove("asc");

              element.classList.add("desc");

              desc = true;
            } else {
              element.classList.remove("desc");

              element.classList.add("asc");
            }
          } else {
            element.classList.remove("asc", "desc");
          }
        });

        data.sort(function (obj1, obj2) {
          let val1 = obj1[prop];

          let val2 = obj2[prop];

          //Zahl oder Text?

          //wenn Zahl

          if (!isNaN(val1) && !isNaN(val2)) {
            val1 = parseFloat(val1);

            val2 = parseFloat(val2);
          }

          if (val1 > val2) return 1;

          if (val1 < val2) return -1;

          return 0;
        });

        if (desc) {
          data.reverse();
        }

        displayData();
      }
      function sorry() {
        test.innerHTML = "tut uns leid";
      }

      loadData()
        .then(displayHeaders)
        .then(displayData)
        .then(displayFilterNav)
       // .then(sortData)
        .then(actions)
        .catch(sorry);

        ///////////////////////////////////
        // change dates
        function excelDateToISO(serial) {
  const msPerDay = 24 * 60 * 60 * 1000;
  let date = new Date(Date.UTC(1899, 11, 30) + serial * msPerDay);
  date = date.toISOString().slice(0, 10);
  let arrayDate = date.split('-')
  date = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
  return date;

  //return date.toISOString().slice(0, 10);
}
function excelDateToISOforComp(serial) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(Date.UTC(1899, 11, 30) + serial * msPerDay)
    .toISOString()
    .slice(0, 10);
}
/////////////