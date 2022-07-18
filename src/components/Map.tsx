import React, { useEffect } from 'react'
import { useState } from 'react'
import {
  GoogleMap,
  Marker
} from '@react-google-maps/api'

// type latLngT = google.maps.LatLngLiteral
// type latLngBoundsT = google.maps.LatLngBoundsLiteral
// type mapOptionsT = google.maps.MapOptions

interface markersT {
  id: number,
  marker: typeof Marker
}

type TMapProps = {
  batchMarkers: {
    lat: number,
    lng: number,
    color: string
  }[]
}

export default function Map({ batchMarkers }: TMapProps) {
  const [mapRef, setMapRef] = useState<any>(null);
  const [markers, setMarkers] = useState<markersT | any>(
    []
  );
  const [center, setCenter] = useState<any>(
    {
      lat: 43.316872,
      lng: 21.894501
    });
  const [zoom, setZoom] = useState(
    15
  );

  const [count, setCount] = useState(
    0
  );
  const [markerId, setMarkerId] = useState({ id: '', color: true });
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  }

  const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "orange",
    fillOpacity: 0.9,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };

  const addMarker = (e: google.maps.MapMouseEvent | any) => {
    const id = `key${count + 1}`
    const position = { lat: e.latLng?.lat(), lng: e.latLng?.lng() } as google.maps.LatLngLiteral
    setMarkers([...markers, {
      id: id,
      marker: <Marker
        key={id}
        position={position}
        icon={svgMarker}
        onClick={() => {
          setMarkerId({ id: id, color: true })
        }}
        onRightClick={() =>
          setMarkerId({ id: id, color: false })
        }
      />
    }
    ])
    setCount(count + 1);
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
    setTimeout(() => {
      localStorage.setItem('map', JSON.stringify({
        center: center,
        zoom: zoom,
        markers: [...markers],
        count: count
      }))
    }, 0)
  }

  // - Upload na github i deploy na github pages

  useEffect(() => {
    if (markerId.id) {
      if (markerId.color) {
        const marker = markers.find((m: any) => m.id === markerId.id);
        let newColor = colors[Math.floor(Math.random() * 7)];
        while (newColor === marker.marker.props.icon.fillColor) {
          newColor = colors[Math.floor(Math.random() * 7)];
        }
        marker.marker.props.icon.fillColor = newColor;
        setMarkers([...markers.filter((m: any) => m.id !== markerId.id)]);
        //HACK: Rerendering markers like this because marker has the same key so I need to remove it and add it again for change to be visible
        setTimeout(() => {
          setMarkers([...markers.filter((m: any) => m.id !== markerId.id), marker]);
        }, 0)
        // Setting marker id to empty string so it will be possible to change color again
        setMarkerId({ id: '', color: true });
      } else {
        //HACK: Deleting markers like this is not the best wa to do it but it works
        //When we pass function like "deleteMarkers(id)" to Marker onRightClick, that function is referencing markers array in shape that it was in the time of function call, so when we delete marker that was added before others, others get deleted too
        setMarkers([...markers.filter((m: any) => m.id !== markerId.id)]);
      }
    }
  }, [markerId.id])

  useEffect(() => {
    if (batchMarkers.length) {
      let c = count;
      const newMarkers: any = [];
      batchMarkers.forEach((m: any) => {
        c += 1;
        const id = `key${c}`
        const marker = {
          id: id,
          marker: <Marker
            key={id}
            position={{ lat: m.lat, lng: m.lng }}
            icon={m.icon}
            onClick={() => {
              setMarkerId({ id: id, color: true })
            }}
            onRightClick={() =>
              setMarkerId({ id: id, color: false })
            }
          />
        }
        newMarkers.push(marker);
      })
      setMarkers([...markers, ...newMarkers]);
      setCenter({ lat: batchMarkers[batchMarkers.length - 1].lat, lng: batchMarkers[batchMarkers.length - 1].lng })
      setZoom(3);
    }
  }, [batchMarkers.length])

  useEffect(() => {
    if (count > 0) {
      updateLocalStorage();
    }
  }, [markers.length, center, zoom, count]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('map')!)) {
      const map = JSON.parse(localStorage.getItem('map')!);
      setCenter(map.center);
      setMarkers(map.markers);
      setCount(map.count);
      setTimeout(() => {
        setZoom(JSON.parse(localStorage.getItem('map')!).zoom);
      }, 0)
    }
  }, [])

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
        {markers && markers.map((m: any) => {
          return <Marker
            key={m.id}
            position={m.marker.props.position}
            icon={m.marker.props.icon}
            onClick={() => {
              setMarkerId({ id: m.id, color: true })
            }}
            onRightClick={() =>
              setMarkerId({ id: m.id, color: false })
            }
          />
        })}
      </GoogleMap>
    </div>
  )
}
