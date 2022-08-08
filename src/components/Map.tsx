import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import {
  GoogleMap,
  Marker
} from '@react-google-maps/api'

interface markersT {
  id: string,
  lat: number,
  lng: number,
  iconColor: string
}

type TMapProps = {
  markers: markersT[],
  setMarkers: (markers: markersT[]) => void
}

export default function Map({ markers, setMarkers }: TMapProps) {
  const [mapRef, setMapRef] = useState<any>(null);

  const [center, setCenter] = useState<{ lat: number, lng: number }>(
    JSON.parse(localStorage.getItem('map')!) !== null ?
      JSON.parse(localStorage.getItem('map')!).center
      :
      {
        lat: 43.316872,
        lng: 21.894501
      });

  const [newMarkers, setNewMarkers] = useState<markersT[]>([]);

  useEffect(() => {
    setNewMarkers(markers);
  }, [markers.length])

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem('map')!))
  }, [])

  const [zoom, setZoom] = useState(
    JSON.parse(localStorage.getItem('map')!) !== null ?
      JSON.parse(localStorage.getItem('map')!).zoom
      :
      15
  );

  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  }

  const svgMarker = (color?: string) => {
    return {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: color ? color : "orange",
      fillOpacity: 0.9,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    }
  }

  const addMarker = (e: google.maps.MapMouseEvent | any) => {
    // const id = `key${count + 1}`
    const position = { lat: e.latLng?.lat(), lng: e.latLng?.lng() } as google.maps.LatLngLiteral
    setMarkers([...markers, {
      id: `key${markers.length + 1}`,
      lat: position.lat,
      lng: position.lng,
      iconColor: 'orange'
    }
    ])
  }


  const recenter = () => {
    // Fixing bug with recentering when adding marker
    setCenter(mapRef?.getCenter().toJSON())
  }

  const rezoom = () => {
    setZoom(mapRef?.getZoom())
  }

  const initMap = (map: any) => {
    setMapRef(map)
  }

  const updateLocalStorage = () => {
    localStorage.setItem('map', JSON.stringify({
      center: center,
      zoom: zoom ?? 15,
      markers: [...markers],
    }))
  }


  const deleteMarkers = (id: string) => {
    setMarkers([...markers.filter((m: any) => m.id !== id)]);
  }

  const changeMarkerColor = (id: string) => {
    const newMarkers = [...markers];
    const marker = markers.find((m: markersT) => m.id === id);
    const markerIndex = markers.findIndex((m: markersT) => m.id === id);
    let newColor = colors[Math.floor(Math.random() * 7)];
    while (newColor === marker?.iconColor) {
      newColor = colors[Math.floor(Math.random() * 7)];
    }
    marker!.iconColor = newColor;
    newMarkers[markerIndex] = marker!;
    setMarkers(newMarkers);
  }

  useEffect(() => {
    // Updating local storage when changes on the map occur
    // console.log(markers);
    updateLocalStorage();
  }, [markers.length, center, zoom]);


  // TEST DATA FOR BATCH ADDING MARKERS
  // 43.312792941372535, 20.77470334281671, blue
  // 42.312792941372535, 21.77470334281671, yellow

  // Map options
  const options = {
    onLoad: (m: any) => initMap(m),
    mapContainerStyle: mapContainerStyle,
    center: center,
    zoom: zoom,
    disableDefaultUI: true,
    clickableIcons: false,
    onClick: addMarker,
    onDragEnd: recenter,
    onZoomChanged: rezoom,
  }

  return (
    <div className="map">
      <GoogleMap
        {...options}
      >
        {newMarkers && newMarkers.map((m: any) =>
          <Marker
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            icon={svgMarker(m.iconColor)}
            onClick={() => {
              changeMarkerColor(m.id);
            }}
            onRightClick={() =>
              deleteMarkers(m.id)
            }
          />
        )}
      </GoogleMap>
    </div>
  )
}
