import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';


console.log('Mapbox GL JS Loaded:', mapboxgl);


mapboxgl.accessToken = 'pk.eyJ1IjoiamxhZHJpYW4iLCJhIjoiY213ZXA2bXA4MGg3djJ5cHhnbTZqam0yayJ9.UQpmmUTKVFMkfBg4UC-zBw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 5,
  maxZoom: 18,
});

const svg = d3.select('#map').select('svg');

function getCoords(station) {
    const point = new mapboxgl.LngLat(+station.lon, +station.lat);
    const { x, y } = map.project(point);
    return { cx: x, cy: y };
  }
  
map.on('load', async () => {
    map.addSource('boston_route', {
      type: 'geojson',
      data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson',
    });
  
    map.addLayer({
      id: 'bike-lanes',
      type: 'line',
      source: 'boston_route',
      paint: {
        'line-color': 'green',
        'line-width': 3,
        'line-opacity': 0.4,
      },
    });


    map.addSource('cambridge_route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson',
      });
      
  map.addLayer({
    id: 'cambridge-bike-lanes',
    type: 'line',
    source: 'cambridge_route',
    paint: {
      'line-color': 'green',
      'line-width': 3,
      'line-opacity': 0.4,
    },
  });
  

let jsonData;

try {
  const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';

  jsonData = await d3.json(jsonurl);
  console.log('Loaded JSON Data:', jsonData);
} catch (error) {
  console.error('Error loading JSON:', error);
}

if (jsonData) {
  let stations = jsonData.data.stations;
  console.log('Stations Array:', stations);

const circles = svg
.selectAll('circle')
.data(stations)
.enter()
.append('circle')
.attr('r', 5)
.attr('fill', 'steelblue')
.attr('stroke', 'white')
.attr('stroke-width', 1)
.attr('opacity', 0.8);

function updatePositions() {
    circles
      .attr('cx', (d) => getCoords(d).cx)
      .attr('cy', (d) => getCoords(d).cy);
  }
  
  // Set initial positions
  updatePositions();
  
  // Update positions as the map moves
  map.on('move', updatePositions);
  map.on('zoom', updatePositions);
  map.on('resize', updatePositions);
  map.on('moveend', updatePositions);
}
  });
  