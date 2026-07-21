'use strict'
            let src = 'edith_stein_orte.json';

            var map = L.map('map').setView([51.2, 12.5], 6);
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            const categoryGroups = {};
const allMarkers = [];

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
                        createFilters();
fitAllVisibleMarkers();
                    }
                }
                xhr.send();
            }

function displayData(element) {
    let props = element.properties;
    let long = parseFloat(element.geometry.coordinates[0]);
    let lat = parseFloat(element.geometry.coordinates[1]);
    let bez = element.properties.BEZEICHNUNG;
    let addr = element.properties.ADRESSE;
    let bezAddr = `${bez}<br>${addr}`;
        let ort = props.ORT || '';
    let land = props.LAND || '';
    let info = props.KML_DESCRIPTION || props.ADRESSE || '';
    let category = props.KATEGORIE || 'Ort';

        let popup = `<strong>${bez}</strong>`;
    if (ort || land) popup += `<br>${ort}${ort && land ? ', ' : ''}${land}`;
    if (info) popup += `<br>${info}`;


    const marker = L.circleMarker([lat, long], {
        radius: 8,
        fillColor: getMarkerColor(element.properties.KATEGORIE),
        color: '#333',
        weight: 1,
        fillOpacity: 0.8
    }).addTo(map);


  //  const marker = L.marker([lat, long], { title: bez }).addTo(map);
    marker.bindPopup(popup);
    if (!categoryGroups[category]) {
    categoryGroups[category] = [];
}

categoryGroups[category].push(marker);
allMarkers.push(marker);
}

function createFilters (){
        const testDiv = document.getElementById('test');
    testDiv.innerHTML = '<h3>Filter</h3>';
     Object.keys(categoryGroups).sort().forEach(category => {
        const wrapper = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `cat-${category}`;
        checkbox.checked = true;
        checkbox.dataset.category = category;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.innerHTML = `
            <span style="
                display:inline-block;
                width:12px;
                height:12px;
                border-radius:50%;
                background:${getMarkerColor(category)};
                margin-right:6px;
            "></span>
            ${category} (${categoryGroups[category].length})
        `;

        checkbox.addEventListener('change', function () {
            toggleCategory(this.dataset.category, this.checked);
            fitAllVisibleMarkers();
        });

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        testDiv.appendChild(wrapper);
    });
}

function toggleCategory(category, isVisible) {
    categoryGroups[category].forEach(marker => {
        if (isVisible) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });
}

function fitAllVisibleMarkers() {
    const visibleMarkers = allMarkers.filter(marker => map.hasLayer(marker));

    if (visibleMarkers.length > 0) {
        const group = L.featureGroup(visibleMarkers);
        map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }
}

window.onload = loadData;