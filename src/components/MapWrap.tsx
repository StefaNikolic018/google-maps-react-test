import React, { useState } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import Map from './Map';
import BatchAdd from './BatchAdd';

export default function MapWrap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
  });
  const [markers, setMarkers] = useState<any>([]);

  if (!isLoaded) return <div>Loading...</div>
  return (
    <div className='container'>
      <BatchAdd setMarkers={setMarkers} />
      <Map batchMarkers={markers} />
    </div>
  )
}