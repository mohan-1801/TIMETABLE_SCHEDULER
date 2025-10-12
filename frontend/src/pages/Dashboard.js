import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "", department: "" });
  const [subjectForm, setSubjectForm] = useState({ name: "", code: "", year: "", section: "", type: "" });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const t = await axios.get("http://localhost:5000/api/teachers");
    const s = await axios.get("http://localhost:5000/api/subjects");
    setTeachers(t.data || []);
    setSubjects(s.data || []);
  }

  async function addTeacher(e) {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/teachers", teacherForm);
    setTeacherForm({ name: "", email: "", department: "" });
    fetchData();
  }

  async function addSubject(e) {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/subjects", subjectForm);
    setSubjectForm({ name: "", code: "", year: "", section: "", type: "" });
    fetchData();
  }

  async function deleteTeacher(id) {
    await axios.delete(`http://localhost:5000/api/teachers/${id}`);
    fetchData();
  }

  async function deleteSubject(id) {
    await axios.delete(`http://localhost:5000/api/subjects/${id}`);
    fetchData();
  }

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-grid">
        {/* Teachers Section */}
        <div className="card">
          <h2>Teachers</h2>
          <form onSubmit={addTeacher} className="form">
            <input
              type="text"
              placeholder="Name"
              value={teacherForm.name}
              onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={teacherForm.email}
              onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={teacherForm.department}
              onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
              required
            />
            <button type="submit">Add Teacher</button>
          </form>

          <ul className="list">
            {teachers.map((t) => (
              <li key={t._id}>
                <span>{t.name} ({t.department})</span>
                <button className="delete-btn" onClick={() => deleteTeacher(t._id)}>✖</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Subjects Section */}
        <div className="card">
          <h2>Subjects</h2>
          <form onSubmit={addSubject} className="form">
            <input
              type="text"
              placeholder="Subject Name"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Subject Code"
              value={subjectForm.code}
              onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={subjectForm.year}
              onChange={(e) => setSubjectForm({ ...subjectForm, year: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Section"
              value={subjectForm.section}
              onChange={(e) => setSubjectForm({ ...subjectForm, section: e.target.value })}
              required
            />
            <select
              value={subjectForm.type}
              onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value })}
              required
            >
              <option value="">Select Type</option>
              <option value="theory">Theory</option>
              <option value="lab">Lab</option>
              <option value="theory+lab">Theory + Lab</option>
            </select>
            <button type="submit">Add Subject</button>
          </form>

          <ul className="list">
            {subjects.map((s) => (
              <li key={s._id}>
                <span>{s.name} ({s.code}) - {s.type}</span>
                <button className="delete-btn" onClick={() => deleteSubject(s._id)}>✖</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
