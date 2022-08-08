import React, { useEffect, useState } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import Map from './Map';
import BatchAdd from './BatchAdd';

type TMarkers = {
  id: string,
  lat: number,
  lng: number,
  iconColor: string
}

export default function MapWrap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
  });


  const [markers, setMarkers] = useState<TMarkers[]>(
    JSON.parse(localStorage.getItem('map')!) !== null ?
      JSON.parse(localStorage.getItem('map')!).markers
      :
      []);

  useEffect(() => {
    if (markers.length > 0) {
      const map = JSON.parse(localStorage.getItem('map')!);
      localStorage.setItem('map', JSON.stringify({
        center: map.center,
        zoom: map.zoom ?? 15,
        markers: [...markers],
      }))
    }
  }, [markers])



  if (!isLoaded) return <div>Loading...</div>
  return (
    <div className='container'>
      <BatchAdd oldMarkers={markers} setMarkers={setMarkers} />
      <Map markers={markers} setMarkers={setMarkers} />
    </div>
  )
}