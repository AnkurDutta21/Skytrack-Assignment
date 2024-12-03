import { useLoadScript } from "@react-google-maps/api"
import Map from "./component/Map";

const App = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  return (
    <div>
      {isLoaded ?
        (
          <Map />
        ) : (
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}
    </div>
  )
}

export default App
