import React, { Component } from 'react';
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import Slider from 'react-rangeslider';
import c3 from 'c3';
import "../../../node_modules/c3/c3.min.css"; 

import * as L from 'leaflet';

import Legend from "./MapLegend";


import departments from '../../data/departments.geo.json';
import deforestation from '../../data/deforestations.json';

const styles = {
  map: {
    height: 700,
    boxSizing: 'border-box',
    width: '100%'
  },
  slider: {
    width: '80%'
  }
};

let yearsRange = Array.from({length: 16}, (v, k) => `${k + 2003}` ); 
yearsRange = ['x'].concat(yearsRange);

export class Deforestation extends Component {

  constructor() {
    super();
    this.state = {
      lat: 4.713027,
      lng: -74.075237,
      zoom: 6,
      year: 2003,
      department: null,
      columns: [
        yearsRange,
        deforestation['data']['national']
      ]
    };
  }

  componentDidMount() {
    this.renderChart();
  }

  style = (feature) => {
    let year = this.state.year;
    return {
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
      fillColor: feature.properties[`color_${year}`]
    };
  }

  highlightFeature = (e) => {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    layer.openPopup();
  }


  resetHighlight = (e) => {
    var layer = e.target;

    layer.setStyle({
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    });

    layer.closePopup();
  }

  renderChart() {
    const columns = this.state.columns;
    c3.generate({
      bindto: "#timeline-chart",
      data: {
        x: 'x',
        xFormat: '%Y',
        columns: columns,
      },
      axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y'
            }
        }
      }
    });
  }




  onEachFeature = (component, feature, layer) => {
    // build popup
    let department = feature.properties['NOMBRE_DPT'];
    let year = this.state.year;
    let loss = feature.properties[`total_cover_loss_${year}`];
    let hectares = feature.properties['HECTARES'];
    let columns = this.state.columns;
    let popupContent = `<div class="inner">
                        <h4 class="popupTitle">${department}</h4>
                        <p><strong>Total loss:</strong> ${loss} hectares</p>
                        <p><strong>Total Hectares:</strong> ${hectares} hectares</p>
                        <div id="timeline-chart" class="mini-chart"></div>
                        </div>`;

    // handle interations
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: (e) => {
        document.getElementById("info").innerHTML = popupContent;

        columns =  [
          columns[0],
          columns[1],
          deforestation['data'][department]
        ];
        this.setState({ department, columns });
        this.renderChart();
      }
    });
  }

  handleSliderChange = value => {
    this.setState({ year: value })
  }

  handleSelectChange = selectedOption => {
    const { value: selectedVar } = selectedOption;
    this.setState({ selectedVar });
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="main-wrapper Layout">
        <div id="info" className="ChartsArea infoBox">
          <div className="inner">
            <h4 className="popupTitle">National Tree Cover Loss</h4>
            <div id="timeline-chart" className="mini-chart"></div>
          </div>
        </div>
        <div className="ChartsArea">
          <div style={styles.wrapper} className="box">
            <Map
              style={styles.map}
              zoom={this.state.zoom}
              minZoom={5}
              maxzoom={9}
              center={position}>
                  <GeoJSON
                    data={departments}
                    style={this.style.bind(this)}
                    onEachFeature={this.onEachFeature.bind(null, this)}
                    ref="geojson"
                  />
              <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Legend />
            </Map>
          </div>
          <div className="ControlWrapper yearSelector">
            <h3>Year: {this.state.year}</h3>
            <Slider
              min={2003}
              max={2020}
              value={this.state.year}
              onChange={this.handleSliderChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
