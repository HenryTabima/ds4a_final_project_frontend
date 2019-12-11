import React, { Component } from 'react'
import c3 from 'c3'
import '../../../node_modules/c3/c3.min.css'

// import deforestation from '../../data/departments_loss.json'

// import tree from '../../data/treemap.json'
import TreeMap from 'react-d3-treemap'
import '../../../node_modules/react-d3-treemap/dist/react.d3.treemap.css'
import Loader from '../Loader'

export class Crops extends Component {
  constructor () {
    super()
    this.state = {
      tree: null,
      departments: null,
      isDataLoaded: false
    }
  }

  componentDidMount () {
    Promise.all([
      import('../../data/treemap.json'),
      import('../../data/departments_loss.json')
    ]).then(vars => {
      const [tree, deforestation] = vars.map(module => module.default)
      const barKeys = Object.keys(deforestation)
      const barValues = Object.values(deforestation)

      this.setState({
        tree,
        isDataLoaded: true
      }, () => this.renderBarChart(barKeys, barValues))
    })
  }

  renderBarChart (barKeys, barValues) {
    let columns = ['Total Hectares'].concat(barValues)
    c3.generate({
      bindto: '#departments-bar',
      data: {
        columns: [columns],
        type: 'bar'
      },
      axis: {
        rotated: true,
        x: {
          type: 'category',
          categories: barKeys
        },
        y: {
          tick: {
            count: 4
          }
        }
      }
    })
  }

  render () {
    if (!this.state.isDataLoaded) return <Loader />
    return (
      <div className='main-wrapper Layout'>
        <div id='departments' className='ChartsArea infoBox'>
          <h4 className='popupTitle'>Total Crop hectares</h4>
          <div id='departments-bar' />
        </div>
        <div className='MapArea treemap-container'>
          <TreeMap
            height={500}
            width={800}
            data={this.state.tree}
            valueUnit='Hectares'
          />
        </div>
      </div>
    )
  }
}
