'use strict'
            let src = 'edith_stein_orte.json';

            var map = L.map('map').setView([51.2, 12.5], 6);
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

function getMarkerColor(category) {
  const colors = {
    Kapelle: '#c0392b',   // red
    Kirche: '#8e44ad',    // purple
    Kloster: '#d35400',   // orange
    Archiv: '#2980b9',    // blue
    Haus: '#16a085',      // teal
    Gedenkort: '#7f8c8d', // gray
    Synagoge: '#2c3e50',  // dark blue-gray
    Schule: '#f39c12',    // amber
    Ort: '#27ae60'        // green
  };
  return colors[category] || '#27ae60';
}


            function loadData() {
                
                let xhr = new XMLHttpRequest(); 
                xhr.open('GET',src);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    if (xhr.status == 200) {
                        let data = xhr.response;
                        //eine Ebene tiefer
                        data.features.forEach(element => {
                           displayData(element);
                        });
                    }
                }
                xhr.send();
            }

function displayData(element) {
    let long = parseFloat(element.geometry.coordinates[0]);
    let lat = parseFloat(element.geometry.coordinates[1]);
    let bez = element.properties.BEZEICHNUNG;
    let addr = element.properties.ADRESSE;
    let bezAddr = `${bez}<br>${addr}`;

    const marker = L.circleMarker([lat, long], {
        radius: 8,
        fillColor: getMarkerColor(element.properties.KATEGORIE),
        color: '#333',
        weight: 1,
        fillOpacity: 0.8
    }).addTo(map);


  //  const marker = L.marker([lat, long], { title: bez }).addTo(map);
    marker.bindPopup(bezAddr);
}
            //function auslösen beim laden der Seite
            window.onload = loadData;