import { MapControl, withLeaflet } from "react-leaflet";
import L from "leaflet";

const getColor = d => {
  return d > 68347
    ? "#ffa500"
    : d > 9887
    ? "#cf9e00"
    : d > 4997
    ? "#9a9600"
    : d > 2994
    ? "#5c8d00"
    : "#008000";
};

class Legend extends MapControl {
  createLeafletElement(props) {}

  componentDidMount() {

    const legend = L.control({ position: "topright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 2994, 4997, 9887, 68347];
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            getColor(from + 1) +
            '"></i><span class="legend-text"> ' +
            from +
            (to ? "&ndash;" + to : "+")
            + '</span>'
        );
      }

      div.innerHTML = '<h4 class="popupTitle">Deforestation Status(Hectares)</h4>' + labels.join("<br>");
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

export default withLeaflet(Legend);