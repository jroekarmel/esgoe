      "use strict";
      let data;
      let dataHeaders;
      let test = document.querySelector("#test");
      let thead = document.querySelector("#thead");
      let tbody = document.querySelector("#tbody");
      let th;
      let txt;
      let url = "veranstaltungen_2021-2026_extern.json";
      const speakerfilternav = document.querySelectorAll(".filter");
            const search = document.querySelector('#search');
            // const for year filter
      //variables for filter
          let searchText = "";
      let type = ""; //referent

      let varyearfilter =""; // year of event

            //Datenvariablen
      let dataFiltered;
      let filterSet = new Set();
      let watchList = [];

      function filterByNav() {
        //this ist das angeklickte element
        type = this.getAttribute("data-info");
        displayData();
      }
            function filterByNavOrt() {
        //this ist das angeklickte element
        type = this.getAttribute("data-info");
        displayData();
      }
            function filterByNavArt() {
        //this ist das angeklickte element
        type = this.getAttribute("data-info");
        displayData();
      }
      search.onkeyup = function () {
        searchText = this.value;
        displayData();
      };

            reset.onclick = function () {
        searchText = "";
        search.value = ""; //Element leeren
        type = "";
        sortData("datum", 0); //aufsteigend nach Id sortieren
      };

      async function loadData() {
        let resp = await fetch(url);
        data = await resp.json();
        //Array der Objekt-Schlüsselworte
        dataHeaders = Object.keys(data[1]);
        console.log(dataHeaders);
      }
      //search filter
      function filterData() {
        dataFiltered = data.filter((element) => {
          return (
            element.titel.toUpperCase().includes(searchText.toUpperCase())
            &&
            //element.Datum <= max &&
            (type != "" ? element.referent == type : true)

          );
        });
      }


  
      function displayHeaders() {
        txt = "";
        txt += "<tr>";
        dataHeaders.forEach((element) => {


                       if (element == "id" || element == "meeting_id"|| element == "kursnummer" || element == "start_datum" || element == "end_datum") {
               return;
             }

          txt += `<th data-prop="${element}">${element}</th>`;
        });
        txt += "</tr>";
        thead.innerHTML = txt;
      }

      function displayData() {
        txt = "";
        filterData();
        //Zeile für Zeile
        dataFiltered.forEach((item) => {
          txt += "<tr>";
          //Spalte für Spalte
          
          dataHeaders.forEach((element) => {
                          if (item.start_datum === item.end_datum) {
                item.datum = excelDateToISO(item.start_datum)
              } else {
                item.datum = `${excelDateToISO(item.start_datum)}-${excelDateToISO(item.end_datum)}`;
              }

             if (element == "id"|| element == "meeting_id"|| element == "kursnummer"|| element == "start_datum" || element == "end_datum") {
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
            
      function displaySpeakerFilterNav() {
        data.forEach((element) => {
          filterSet.add(element.referent);
         // filterSetOrt.add(element.ort);
         // filterSetArt.add(element.art);
          //filterSetJahr.add(element.jahr);
        });

        filterSet.forEach((link) => {
          let a = document.createElement("a");
          //Attribute hinzufügen
          a.href = "#";
          a.classList.add("filter");
          a.textContent = link;
          a.onclick = filterByNav;
          a.setAttribute("data-info", link);
          //Listenelement erstellen
        let li = document.createElement("li");
          li.append(a);
          groups.append(li);
        displayData();

        });
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
        .then(displaySpeakerFilterNav)
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
  console.table(arrayDate);
  date = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
  return date;

  //return date.toISOString().slice(0, 10);
}
/////////////