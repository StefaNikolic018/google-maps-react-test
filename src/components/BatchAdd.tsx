import React, { useRef, useState } from 'react'

type TProps = {
  setMarkers: (markers: any) => void
}

export default function BatchAdd({ setMarkers }: TProps) {
  const batchInputRef = useRef<any>(null);
  const [error, setError] = useState(false);

  const addBatch = () => {
    const batchInput = batchInputRef.current?.value;
    const arrOfMarkers = batchInput.split('\n')
    let markers: any = []
    if (!batchInput) {
      setError(true);
      return;
    } else {
      console.log(arrOfMarkers);
      arrOfMarkers.map((m: any) => {
        const marker = m.split(',')
        if (marker.length < 2) {
          setError(true);
        } else {
          markers.push({
            lat: parseFloat(marker[0].trim()),
            lng: parseFloat(marker[1].trim()),
            icon: {
              path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
              fillColor: marker[2].trim() || 'orange',
              fillOpacity: 0.9,
              strokeWeight: 0,
              rotation: 0,
              scale: 2,
              anchor: new google.maps.Point(15, 30)
            }
          })
        }
        return true;
      })
      if (markers.length > 0) {
        console.log(markers);
        setError(false);
        setMarkers(markers);
        batchInputRef.current.value = '';
      }
    }
  }



  return (
    <div className={`batch__section ${error ? 'error' : ''}`}>
      <h1>Batch add:</h1>
      <textarea name="batchAdd" className="batch__input" ref={batchInputRef}></textarea>
      <p>*format: lat, long, color(new line) lat, long, color...</p>
      <button className="batch__button" onClick={addBatch}>ADD</button>
    </div>
  )
}
