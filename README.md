## React component for creating an interactive map using the Google Maps API.

**Features:**
-   Responsive Design: The map component is designed to adapt to different screen sizes, providing a seamless user experience on various devices.
-   Display a map with custom styles.
-   Search for locations using an autocomplete search bar.
-   Save clicked locations as markers with names (stored in local storage).
-   View information about saved markers in a list.
-   Select and pan to specific markers.
-   Reset the map view to the initial location and zoom level.

## Demo Video(Click on the image)
  [![Watch the video](https://github.com/user-attachments/assets/e31c9864-2bca-4303-903d-9470d7488ac1)](https://www.loom.com/share/a721438f4a0e4724b50b173ff1673c12?sid=d81ee8c5-6ff4-46d7-9bcb-01d383e54442)


**Installation:**

This component assumes you have a React project set up with the following libraries installed:
-   `@react-google-maps/api`
-   `react-icons` (optional, for using icons)
-   `VITE_GOOGLE_MAPS_API_KEY` for rendering the map.

**Steps:**

1.  **Clone the Repository:**

    Bash

    ```
    git clone https://github.com/your-username/your-repo-name.git

    ```

    Use code [with caution.](/faq#coding)

3.  **Install Dependencies:**

    Bash

    ```
    cd your-repo-name
    npm install 

    ```

4.  **Set up Google Maps API Key:** Create a `.env` file in the project root and add your Google Maps API key:

    ```
    VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY

    ```

5.  **Start the Development Server:**

    Bash

    ```
    npm start

    ```

This will start a development server, and you can access your application in your browser at `http://localhost:5173`.

**Usage:**

1.  Import the component:

JavaScript

```
import Map from './Map';

```

1.  Render the component in your application:

JavaScript

```
function App() {
  return (
    <div className="App">
      <Map />
    </div>
  );
}

```
**Explanation:**

The `Map` component utilizes several functionalities:

-   **State Management:** It uses React hooks like `useState` and `useMemo` to manage various aspects of the map, such as active markers, search results, and map configuration.
-   **Google Maps API:** The `@react-google-maps/api` library provides components like `GoogleMap`, `MarkerF`, and `Autocomplete` to interact with the Google Maps API within your React application.
-   **Local Storage:** The `useLocalStorageMarkers` hook (likely implemented in a separate file) handles saving and retrieving marker data (locations and names) from the user's local storage.
-   **Custom Components:** Additional components like `ViewMarkers`, `LocationModal`, and `PopupComponent` might be implemented in separate files to handle marker list display, location saving modals, and marker information popups.

**Additional Notes:**

-   This component requires a valid Google Maps API key to function. You can obtain one by creating a Google Cloud Platform project and enabling the Maps JavaScript API.
-   The code includes comments to explain specific sections and functionalities.
