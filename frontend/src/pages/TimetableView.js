
import React, {useState} from 'react';
import axios from 'axios';
export default function TimetableView(){
  const [year,setYear]=useState(1), [section,setSection]=useState('A'), [data,setData]=useState(null);
  async function load(){
    const res = await axios.get(`http://localhost:5000/api/timetable/${year}/${section}`);
    setData(res.data ? res.data.data : null);
  }
  function downloadJSON(){
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `timetable_${year}_${section}.json`; a.click();
  }
  return <div>
    <h2>View Timetable</h2>
    <label className="field">Year <input value={year} onChange={e=>setYear(Number(e.target.value))} /></label>
    <label className="field">Section <input value={section} onChange={e=>setSection(e.target.value)} /></label>
    <button className="btn" onClick={load}>Load</button>
    {data && <div className="card" style={{marginTop:10}}>
      <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(data, null, 2)}</pre>
      <button className="btn" onClick={downloadJSON}>Download JSON</button>
    </div>}
  </div>
}
