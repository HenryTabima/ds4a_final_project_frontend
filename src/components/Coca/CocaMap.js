import React, { Component } from 'react'
import { Map, TileLayer } from 'react-leaflet'
import Slider from 'react-rangeslider'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import c3 from 'c3'
import Loader from '../Loader'
// import CocaLegend from './Legend'

// import { totalPoints } from '../../data/coca/index.js'
// import { totalCoca } from '../../data/coca_totals.js'

import { getTotalCoca } from '../../utils/coca-parser'

const styles = {
  map: {
    height: '80vh',
    boxSizing: 'border-box',
    width: '100%'
  },
  slider: {
    width: '80%'
  }
}

export class Coca extends Component {
  constructor () {
    super()
    this.state = {
      lat: 4.713027,
      lng: -74.075237,
      zoom: 6,
      year: 2003,
      coca_points: null,
      total_hectares: 0,
      yearTotals: null,
      lossTotals: null,
      totalPoints: null
    }
  }

  componentDidMount () {
    Promise.all([
      import('../../data/coca/index.js'),
      getTotalCoca() // import('../../data/coca_totals.js')
    ]).then(vars => {
      const [totalPoints, totalCoca] = vars.map(module => module.default || module)
      let coca_points = totalPoints[0]
      let total_hectares = coca_points.reduce((c, f) => {
        return c + parseFloat(f[2])
      }, 0)
      const yearTotals = Object.keys(totalCoca)
      const lossTotals = Object.values(totalCoca)
      this.setState({ total_hectares, coca_points, yearTotals, lossTotals, totalPoints })

      this.renderChart(yearTotals, lossTotals)
    })
  }

  handleSliderChange = year => {
    let coca_points = this.state.totalPoints[year - 2003]
    let total_hectares = coca_points.reduce((c, f) => {
      return c + parseFloat(f[2])
    }, 0)
    this.setState({ year, coca_points, total_hectares })
  }

  renderChart (yearTotals, lossTotals) {
    let labels = ['x'].concat(yearTotals)
    let columns = ['Coca Hectares'].concat(lossTotals)
    c3.generate({
      bindto: '#area-chart',
      data: {
        x: 'x',
        columns: [labels, columns],
        types: {
          'Coca Hectares': 'bar'
        }
      },
      axis: {
        rotated: true,
        x: {
          tick: {
            values: yearTotals
          }
        }
      }
    })
  }

  render () {
    if (!this.state.totalPoints) return <Loader />
    const position = [this.state.lat, this.state.lng]
    const coca_points = this.state.coca_points
    const total_hectares = this.state.total_hectares
    const year = this.state.year
    return (
      <div className='main-wrapper Layout'>
        <div className='ChartsArea infoBox'>
          <div className='inner'>
            <h4 className='popupTitle'>Total Crop hectares</h4>
            <div id='area-chart' className='mini-chart' />
          </div>
        </div>
        <div className='MapArea'>
          <div className='box'>
            <Map
              style={styles.map}
              zoom={this.state.zoom}
              minZoom={5}
              maxzoom={9}
              center={position}
            >
              <TileLayer url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
              <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={coca_points}
                longitudeExtractor={m => m[0]}
                latitudeExtractor={m => m[1]}
                intensityExtractor={m => parseFloat(m[2])}
              />
            </Map>
            <div className='coca-legend'>
              <h4 className='popupTitle'>Coca Hectares Distribution</h4>
              <p>
                <span className='label'>Year: </span>
                {year}
              </p>
              <p>
                <span className='label'>Total CocaHectares: </span>
                {parseFloat(total_hectares).toFixed(2)}
              </p>
            </div>
          </div>
          <div className='ControlWrapper'>
            <h3>Year: {this.state.year}</h3>
            <Slider
              min={2003}
              max={2018}
              value={this.state.year}
              onChange={this.handleSliderChange}
            />
          </div>
        </div>
      </div>
    )
  }
}
