import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";

class CocaLegend extends MapControl {
  createLeafletElement(props) {}
  
  componentDidMount() {
      const { year, total_hectares } = this.props;
      const legend = L.control({ position: "bottomright" });
  
      legend.onAdd = () => {
          const div = L.DomUtil.create("div", "info legend");
          div.innerHTML = `
              <p>Total Crop Hectares: ${total_hectares.toFixed(2)} hectates</p>
              <p> Year: ${year}</p>
          `;
          return div;
      };

    const { map } = this.props.leaflet;
    legend.addTo(map);
  }

  componentWillUnmount() {
      if (this.leafletElement) {
        this.leafletElement.remove();
      }
  }
}

export default withLeaflet(CocaLegend);
