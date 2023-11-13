import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { coordinates } from "widgets/Map/config";
import { LoadingSpinner } from "shared/ui";
import cls from "./Map.module.scss";

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY ?? "",
  });

  return (
    <div className={cls.mapWrapper}>
      {!isLoaded ? (
        <LoadingSpinner />
      ) : (
        <GoogleMap
          mapContainerClassName={cls.map}
          center={coordinates}
          zoom={15}
        />
      )}
    </div>
  );
};

export default Map;
