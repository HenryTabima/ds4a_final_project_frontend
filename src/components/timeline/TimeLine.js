import React, { Component }  from 'react';

import TimelineItem from './TimelineItem'

class Timeline extends Component {

    render() {
        const timelineData = this.props.data && this.props.data.length > 0 ? this.props.data : [];

        return timelineData.length > 0 && (
            <div className="timeline-container">
                {timelineData.map((data, idx) => (
                    <TimelineItem data={data} key={idx} />
                ))}
            </div>
        );
    }
}
export default Timeline;   