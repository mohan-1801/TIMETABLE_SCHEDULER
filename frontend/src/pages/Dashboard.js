
import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function Dashboard(){
  const [teachers,setTeachers]=useState([]), [subjects,setSubjects]=useState([]);
  useEffect(()=>{ fetchData(); },[]);
  async function fetchData(){
    const t = await axios.get('http://localhost:5000/api/teachers'); setTeachers(t.data||[]);
    const s = await axios.get('http://localhost:5000/api/subjects'); setSubjects(s.data||[]);
  }
  return <div>
    <h2>Dashboard</h2>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:16}}>
      <div className="card">
        <h3>Teachers</h3>
        <ul>{teachers.map(x=> <li key={x._id}>{x.name} — {x.department}</li>)}</ul>
      </div>
      <div className="card">
        <h3>Subjects</h3>
        <ul>{subjects.map(x=> <li key={x._id}>{x.name} ({x.code}) - {x.type}</li>)}</ul>
      </div>
    </div>
  </div>
}
