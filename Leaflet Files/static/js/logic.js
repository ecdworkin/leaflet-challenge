// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//GET request
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

function getColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#91cf60' :
                        '#1a9850';
  }
  
  
  function getRadius(magnitude) {
    return magnitude * 5; 
  }

function createFeatures(earthquakeData) {

  
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
  });
}
});

  // Send our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object
  let baseMaps = {
    "Street Map": street,
  };

  // Create overlay
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  //add legend for clarity
  addLegend().addTo(myMap);
}

function addLegend() {
    var legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 30, 50, 70, 90], // Depth intervals
          labels = [];
  
      // color scale
      div.innerHTML += '<div class="color-scale"><strong>Depth (km)</strong><br><div class="color-gradient"></div></div>';
  
      // Add depth labels 
      var scaleDiv = '<div class="scale-labels">';
      for (var i = 0; i < grades.length; i++) {
        var position = (i / (grades.length - 1)) * 100;
        scaleDiv += '<div class="label" style="left:' + position + '%;">' + grades[i] + '</div>';
      }
      scaleDiv += '</div>';
      div.innerHTML += scaleDiv;
  
      div.innerHTML += '<div style="margin-top: 10px;"><strong>Magnitude</strong><br>Size indicates magnitude</div>';
  
      return div;
    };
  
    return legend;
  }
  