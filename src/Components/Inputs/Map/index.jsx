import LocationPicker from "react-location-picker";
import Autocomplete from "./placesautocomplete/placesautocomplete";
import FormHelperText from "@mui/material/FormHelperText";

const MapInput = ({ onChange, value, error }) => {
    return (
        <div>
            <Autocomplete
                handleLocation={onChange}
            />
            {error ? <FormHelperText error sx={{ paddingInlineStart: "15px" }}>{error}</FormHelperText> : null}
            <LocationPicker
                zoom={14}
                containerElement={
                    <div style={{ height: "100%" }} />
                }
                mapElement={
                    <div style={{ height: "400px" }} />
                }
                defaultPosition={value ?? {
                    lat: 30.035811042667817,
                    lng: 31.234130859375,
                }}
                onChange={(e) => onChange?.(e.position)}
            />

        </div>
    )
}

export default MapInput