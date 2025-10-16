// frontend/src/pages/Scheduler.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Scheduler.css";

export default function Scheduler() {
  const [step, setStep] = useState(1);
  const [year, setYear] = useState(1);
  const [section, setSection] = useState("A");

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allocations, setAllocations] = useState([]); // dynamic rows
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const periodsPerDay = 8;

  const emptyTemplate = () => {
    const t = {};
    days.forEach((d) => {
      t[d] = {};
      for (let p = 1; p <= periodsPerDay; p++) t[d][p] = null;
    });
    return t;
  };
  const [template, setTemplate] = useState(emptyTemplate());
  const [timetableId, setTimetableId] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  async function fetchLists() {
    const [tRes, sRes] = await Promise.all([
      axios.get("http://localhost:5000/api/teachers"),
      axios.get("http://localhost:5000/api/subjects")
    ]);
    setTeachers(tRes.data || []);
    setSubjects(sRes.data || []);
  }

  // Step1 → Step2 navigation
  function goToStep2() {
    setAllocations([]); // start with empty allocations
    setStep(2);
  }

  function addAllocationRow() {
    setAllocations((prev) => [
      ...prev,
      { subjectId: "", type: "theory", teacherId: "", hoursPerWeek: 0, tempId: Date.now() }
    ]);
  }

  function updateAllocation(idx, field, value) {
    setAllocations((prev) => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  }

  async function generateTimetable() {
    // validate: hours sum should not exceed total slots
    const totalSlots = days.length * periodsPerDay;
    const sumHours = allocations.reduce((s, a) => s + Number(a.hoursPerWeek || 0), 0);
    if (sumHours > totalSlots) {
      if (!window.confirm(`Assigned hours (${sumHours}) exceed total slots (${totalSlots}). Continue?`)) return;
    }

    // call backend generate endpoint
    const res = await axios.post("http://localhost:5000/api/timetable/generate", {
      year,
      section,
      allocations: allocations.map(a => ({
        subjectId: a.subjectId,
        name: subjects.find(s => s._id === a.subjectId)?.name || "",
        code: subjects.find(s => s._id === a.subjectId)?.code || "",
        type: a.type,
        teacherId: a.teacherId,
        hoursPerWeek: a.hoursPerWeek
      })),
      days,
      periodsPerDay,
    });

    if (res.data && res.data.template) {
      setTemplate(res.data.template);
      setStep(3);
    } else {
      alert("Generation failed on server");
    }
  }

  function editCell(day, period) {
    const choice = window.prompt("Enter as: subjectCode | teacherName | type (example: CCS101|Mr.X|theory)  OR enter 'clear' to empty");
    if (!choice) return;
    if (choice.toLowerCase() === "clear") {
      setTemplate((prev) => {
        const copy = JSON.parse(JSON.stringify(prev));
        copy[day][period] = null;
        return copy;
      });
      return;
    }
    const parts = choice.split("|").map((p) => p.trim());
    if (parts.length < 3) return alert("Invalid format");
    const [subjectCode, teacherName, type] = parts;
    setTemplate((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[day][period] = { subjectCode, teacher: teacherName, type };
      return copy;
    });
  }

  async function saveTimetable() {
    const res = await axios.post("http://localhost:5000/api/timetable/save", {
      year,
      section,
      data: template,
    });
    if (res.data && res.data._id) {
      setTimetableId(res.data._id);
      alert("Saved timetable. ID: " + res.data._id);
      setStep(4);
    } else {
      alert("Save failed");
    }
  }

  function downloadPdf() {
    if (!timetableId) return alert("Save timetable first to download PDF");
    window.open(`http://localhost:5000/api/timetable/${timetableId}/pdf`, "_blank");
  }

  return (
    <div className="scheduler-container">
      <h1>Class Timetable Scheduler</h1>
      <div className="step-indicator">Step {step} of 4</div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="card step-card">
          <h2>Step 1 — Select Year & Section</h2>
          <div className="form-row">
            <label>
              Year
              <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </label>
            <label>
              Section
              <input value={section} onChange={(e) => setSection(e.target.value.toUpperCase())} />
            </label>
          </div>
          <div className="button-group">
            <button className="btn" onClick={goToStep2}>
              Next → Step 2
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="card step-card">
          <h2>Step 2 — Assign subjects & hours per week</h2>
          <p>Dynamic Subject Allocation</p>

          <div className="alloc-table">
            <table>
              <thead>
                <tr>
                  <th>Subject (code)</th>
                  <th>Type</th>
                  <th>Teacher</th>
                  <th>Hours / week</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((a, idx) => (
                  <tr key={a.tempId}>
                    <td>
                      <select
                        value={a.subjectId}
                        onChange={(e) => updateAllocation(idx, "subjectId", e.target.value)}
                      >
                        <option value="">-- choose subject --</option>
                        {subjects
                          .filter(
                            (s) =>
                              !allocations.some(
                                (alloc, i) => alloc.subjectId === s._id && i !== idx
                              )
                          )
                          .map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <select value={a.type} onChange={(e) => updateAllocation(idx, "type", e.target.value)}>
                        <option value="theory">theory</option>
                        <option value="lab">lab</option>
                        <option value="theory+lab">theory+lab</option>
                      </select>
                    </td>
                    <td>
                      <select value={a.teacherId} onChange={(e) => updateAllocation(idx, "teacherId", e.target.value)}>
                        <option value="">-- choose teacher --</option>
                        {teachers.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max={days.length * periodsPerDay}
                        value={a.hoursPerWeek}
                        onChange={(e) => updateAllocation(idx, "hoursPerWeek", Number(e.target.value))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-group">
            <button className="btn" onClick={addAllocationRow}>+ Add Subject</button>
            <button className="btn" onClick={() => setStep(1)}>← Back</button>
            <button className="btn" onClick={generateTimetable}>Generate Timetable → Step 3</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="card step-card">
          <h2>Step 3 — Generated Timetable (editable)</h2>
          <div className="timetable-grid">
            <table>
              <thead>
                <tr>
                  <th>Day/Period</th>
                  {Array.from({ length: periodsPerDay }, (_, i) => <th key={i + 1}>{i + 1}</th>)}
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d}>
                    <td className="day-col">{d}</td>
                    {Array.from({ length: periodsPerDay }, (_, i) => {
                      const p = i + 1;
                      const cell = template[d][p];
                      return (
                        <td key={p} onDoubleClick={() => editCell(d, p)} style={{ cursor: "pointer" }}>
                          {cell ? (
                            <>
                              <div><strong>{cell.subjectCode || cell.subject}</strong></div>
                              <div>{cell.teacher}</div>
                              <div style={{ fontSize: 12 }}>{cell.type}</div>
                            </>
                          ) : (
                            <small>empty (double-click to edit)</small>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-group">
            <button className="btn" onClick={() => setStep(2)}>← Back</button>
            <button className="btn" onClick={saveTimetable}>Save & Continue → Step 4</button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="card step-card">
          <h2>Step 4 — Final View & Export</h2>
          <div className="preview-box">
            <pre>{JSON.stringify(template, null, 2)}</pre>
          </div>
          <div className="button-group">
            <button className="btn" onClick={() => setStep(3)}>← Back</button>
            <button className="btn" onClick={downloadPdf}>Download PDF</button>
            <button className="btn" onClick={() => window.location.assign("/dashboard")}>View in Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}
