import React from 'react'

import './App.css'
import 'leaflet/dist/leaflet.css'
import 'react-rangeslider/lib/index.css'

import { Stickyroll } from '@stickyroll/stickyroll'

import { Crops } from './components/Crops/Crops'
import { Coca } from './components/Coca/CocaMap'
import { Deforestation } from './components/Deforestation/Deforestation'

const headlines = ['Crops', 'Coca', 'Deforestation']
// const headlines = ['Coca']

const components = [<Crops />, <Coca />, <Deforestation />]
// const components = [<Coca />]

const App = () => {
  return (
    <Stickyroll pages={headlines} throttle={250} anchors=''>
      {({ page, pageIndex, pages, progress }) => {
        return (
          <div className={`scrollSection ${headlines[pageIndex]}`}>
            <header className='sectionHeader'>
              <h2 className='sectionTitle'>{headlines[pageIndex]}</h2>
            </header>
            <section className='innerSection'>{components[pageIndex]}</section>
            <footer className='sectionFooter'>
              <strong>{page}</strong> of <strong>{pages}</strong>
            </footer>
          </div>
        )
      }}
    </Stickyroll>
  )
}

export default App
