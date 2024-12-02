import { useLoadScript } from "@react-google-maps/api"
import Map from "./component/Map";

const App = () => {
const {isLoaded} = useLoadScript({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
});

console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  return (
    <div>
      {isLoaded ? <Map /> : <div>Loading...</div>}
    </div>
  )
}

export default App
