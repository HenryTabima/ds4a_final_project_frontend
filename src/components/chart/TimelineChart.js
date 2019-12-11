import React, { Component } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

class TimelineChart extends Component {
    renderChart() {
      c3.generate({
        bindto: "#timeline-chart",
        data: {
          x: 'x',
          xFormat: '%Y',
          columns: [this.props.keys, this.props.values],
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
  
    componentDidMount() {
      this.renderChart();
    }
  
    render() {
        return (
          <div className="chart-container">
            <div id="timeline-chart"></div>
          </div>
        );
    }
}

export default TimelineChart;
  