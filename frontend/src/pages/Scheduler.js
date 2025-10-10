
import React, {useState, useEffect} from 'react';
import axios from 'axios';

/*
Simple multi-step scheduler UI:
1) Select year, section
2) Choose teachers and subjects (fetched from backend)
3) Manual assignment for each day/period, with type selection
4) Autofill remaining slots (calls backend /autofill)
5) Save timetable
*/
export default function Scheduler(){
  const [step,setStep]=useState(1);
  const [year,setYear]=useState(1), [section,setSection]=useState('A');
  const [teachers,setTeachers]=useState([]), [subjects,setSubjects]=useState([]);
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat'];
  const periods = Array.from({length:8}, (_,i)=>i+1);
  const emptyTemplate = () => {
    const t = {};
    days.forEach(d=>{ t[d]={}; periods.forEach(p=> t[d][p]=null); });
    return t;
  };
  const [template,setTemplate] = useState(emptyTemplate());
  useEffect(()=>{ fetchLists(); },[]);
  async function fetchLists(){
    const t = await axios.get('http://localhost:5000/api/teachers'); setTeachers(t.data||[]);
    const s = await axios.get('http://localhost:5000/api/subjects'); setSubjects(s.data||[]);
  }
  function assignCell(day,period,sub,teacher,type){
    setTemplate(prev=>{
      const copy = JSON.parse(JSON.stringify(prev));
      copy[day][period] = {subject: sub.name, subjectCode: sub.code, teacher: teacher.name, type};
      return copy;
    });
  }
  async function autoFill(){
    const res = await axios.post('http://localhost:5000/api/timetable/autofill',{template, subjects, teachers});
    if(res.data && res.data.filled) setTemplate(res.data.filled);
  }
  async function saveTimetable(){
    await axios.post('http://localhost:5000/api/timetable/save',{year, section, data: template, adminId: null});
    alert('Saved');
  }
  return <div>
    <h2>Scheduler — Step {step}</h2>
    {step===1 && <div className="card">
      <label className="field">Year <select value={year} onChange={e=>setYear(Number(e.target.value))}>
        <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
      </select></label>
      <label className="field">Section <input value={section} onChange={e=>setSection(e.target.value)} /></label>
      <button className="btn" onClick={()=>setStep(2)}>Next</button>
    </div>}
    {step===2 && <div className="card">
      <h4>Assign subjects to slots (manual). Use the selector below to add to a chosen cell.</h4>
      <div style={{display:'flex', gap:10}}>
        <div style={{flex:1}}>
          <label>Choose Day <select id="daySel">{days.map(d=> <option key={d} value={d}>{d}</option>)}</select></label>
          <label>Choose Period <select id="perSel">{periods.map(p=> <option key={p} value={p}>{p}</option>)}</select></label>
          <label>Subject <select id="subSel">{subjects.map(s=> <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}</select></label>
          <label>Teacher <select id="teaSel">{teachers.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}</select></label>
          <label>Type <select id="typeSel"><option value="theory">theory</option><option value="lab">lab</option><option value="theory+lab">theory+lab</option></select></label>
          <button className="btn" onClick={()=>{
            const day = document.getElementById('daySel').value;
            const per = document.getElementById('perSel').value;
            const subId = document.getElementById('subSel').value;
            const teaId = document.getElementById('teaSel').value;
            const type = document.getElementById('typeSel').value;
            const sub = subjects.find(s=>s._id===subId);
            const tea = teachers.find(t=>t._id===teaId);
            assignCell(day, per, sub, tea, type);
          }}>Assign to Cell</button>
        </div>
        <div style={{flex:2}}>
          <h4>Grid</h4>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead><tr><th>Day/Period</th>{periods.map(p=> <th key={p}>{p}</th>)}</tr></thead>
            <tbody>{days.map(d=> <tr key={d}><td style={{fontWeight:700}}>{d}</td>{periods.map(p=> <td key={p} style={{border:'1px solid #eee', padding:8, minWidth:120}}>
              {template[d][p] ? <div><b>{template[d][p].subjectCode}</b><div>{template[d][p].teacher}</div><div style={{fontSize:12}}>{template[d][p].type}</div></div> : <small>empty</small>}
            </td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
      <div style={{marginTop:10}}>
        <button className="btn" onClick={autoFill}>Auto-fill remaining slots</button>
        <button className="btn" onClick={()=>setStep(3)}>Next</button>
      </div>
    </div>}
    {step===3 && <div className="card">
      <h4>Review & Save</h4>
      <pre style={{maxHeight:300, overflow:'auto'}}>{JSON.stringify(template, null, 2)}</pre>
      <button className="btn" onClick={saveTimetable}>Save Timetable</button>
      <button className="btn" onClick={()=>setStep(1)}>Back to start</button>
    </div>}
  </div>
}
