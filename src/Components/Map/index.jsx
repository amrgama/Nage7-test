import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import PropTypes from "prop-types";

const MyMapComponent = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={14} defaultCenter={props.defaultCenter}>
      {props.isMarkerShown && (
        <Marker
          position={{ lat: props.marker.latitude, lng: props.marker.longitude }}
        />
      )}
    </GoogleMap>
  ))
);

const Map = ({ location, height }) => (
  <MyMapComponent
    isMarkerShown
    marker={{
      latitude: location.lat,
      longitude: location.lng,
    }}
    defaultCenter={{
      lat: location.lat,
      lng: location.lng,
    }}
    googleMapURL="https://maps.googleapis.com/maps/api/js?&v=3.exp&key=AIzaSyCHOldbL841fdZfoOxt8csv5a5jxRAct3Y&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);

Map.defaultProps = {
  location: {
    lat: 25.8103146,
    lng: -80.1751609,
  },
  height: "300px",
};

Map.propTypes = {
  location: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  height: PropTypes.string,
};

export default Map;
