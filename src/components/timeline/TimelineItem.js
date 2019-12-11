import React, { Component }  from 'react';

class TimelineItem extends Component {

    render() {
        const data = this.props.data;
        return  (
                <div className="timeline-item">
                    <div className="timeline-item-content">
                        <time>{data.year} - {data.month}</time>
                        <p>{data.desc}</p>
                        <span className="circle" />
                    </div>
                </div>
            );
    }
    
}

export default TimelineItem;