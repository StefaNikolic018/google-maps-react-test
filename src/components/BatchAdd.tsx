import React, { useRef, useState } from 'react'

type TMarkers = {
  id: string,
  lat: number,
  lng: number,
  iconColor: string
}

type TProps = {
  oldMarkers: TMarkers[],
  setMarkers: (markers: TMarkers[]) => void
}

export default function BatchAdd({ oldMarkers, setMarkers }: TProps) {
  const batchInputRef = useRef<any>(null);
  const [error, setError] = useState(false);

  const addBatch = () => {
    const batchInput = batchInputRef.current?.value;
    const arrOfMarkers = batchInput.split('\n')
    let markers: TMarkers[] = []
    if (!batchInput) {
      setError(true);
      return;
    } else {
      console.log(arrOfMarkers);
      let count = oldMarkers.length + 1;
      arrOfMarkers.map((m: string) => {
        const marker = m.split(',')
        if (marker.length < 2) {
          setError(true);
        } else {
          markers.push({
            id: `key${count}`,
            lat: parseFloat(marker[0].trim()),
            lng: parseFloat(marker[1].trim()),
            iconColor: marker[2].trim() || 'orange'
          })
          count++;
        }
        return true;
      })
      if (markers.length > 0) {
        console.log(markers);
        setError(false);
        setMarkers([...oldMarkers, ...markers]);
        batchInputRef.current.value = '';
      }
    }
  }



  return (
    <div className={`batch__section ${error ? 'error' : ''}`}>
      <h1>Batch add:</h1>
      <textarea name="batchAdd" className="batch__input" ref={batchInputRef}></textarea>
      <p>*format: lat, long, color(new line) lat, long, color(new line)...</p>
      <button className="batch__button" onClick={addBatch}>ADD</button>
    </div>
  )
}
