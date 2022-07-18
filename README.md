# React Google Maps Integration

Personal [React GoogleMaps](https://github.com/tomchentw/react-google-maps) TypeScript application.<br />
SASS was used for styling.<br />
Persisting data in local storage.<br />

Project is deployed to [Github Pages](https://pages.github.com/), and demo can be seen [here](https://stefanikolic018.github.io/google-maps-react-test/).<span style="color:orangered"><br />*</span><i><u><b>MAP IS NOT WORKING PROBABLY BECAUSE OF THE BILLING</b></u></i>

## Idea and Usage

On startup, the application will try to load the data from local storage. If there is no data(that's the case when the application starts the first time), it will show the map with center of it in Nis, Serbia.
<img src="/public/screenshots/map.png" alt="On load" title="On load" style="text-align: center">
When the user clicks on the map, the application will save the coordinates of the clicked point and also map informations like zoom and center of the map in local storage and add an orange marker on the map. On click marker will change color, and on right click marker would be removed.
<img src="/public/screenshots/markerOne.png" alt="Marker" title="Marker" style="text-align: center">
User can add multiple markers on the map, by entering latitude, longitude and color into "Batch Add" field by spliting information with new line for every marker. If color is not filled then default color of marker will be orange.
<img src="/public/screenshots/batch.png" alt="Batch add" title="Batch add" style="text-align: center">

There is error handling for the following cases:
- If user enters empty string into batch add
<img src="/public/screenshots/error.png" alt="Empty string" title="Empty string" style="text-align: center">



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
