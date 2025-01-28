import React, { useState } from "react";
import axios from "axios"; // ✅ Added Axios
import "./Search.css"; // Import styles /

const mockDatabase = {
    patients: [
      { id: 1, name: "Alice", age: 30, gender: "Female", hasInsurance: true },
      { id: 2, name: "Bob", age: 45, gender: "Male", hasInsurance: false },
    ],
    doctors: [
      { id: 1, name: "Dr. Smith", specialty: "Cardiology", location: "New York" },
      { id: 2, name: "Dr. Johnson", specialty: "Pediatrics", location: "California" },
    ],
    visits: [
      { id: 1, patientId: 1, doctorId: 1, date: "2025-01-01", reason: "Heart checkup", followUp: true },
      { id: 2, patientId: 2, doctorId: 2, date: "2025-01-15", reason: "Routine checkup", followUp: false },
      { id: 3, patientId: 1, doctorId: 1, date: "2025-01-18", reason: "Cardio Exam", followUp: true },
    ],
  };
  

function Search() {
  const [entityType, setEntityType] = useState("patients");
  const [criteria, setCriteria] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setResults([]); // Clear previous results

    setTimeout(() => {
      let data = [];
      if (entityType === "patients") {
        data = mockDatabase.patients.filter((p) =>
          criteria.hasInsurance ? p.hasInsurance : true
        );
      } else if (entityType === "doctors") {
        data = mockDatabase.doctors;
      } else if (entityType === "visits") {
        data = mockDatabase.visits.filter(
          (v) =>
            (!criteria.startDate || v.date >= criteria.startDate) &&
            (!criteria.endDate || v.date <= criteria.endDate)
        );
      }
      setResults(data);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="search-container">
      {/* Search Inputs */}
      <div className="form-group">
        <label>Search For: </label>
        <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
          <option value="patients">Patients</option>
          <option value="doctors">Doctors</option>
          <option value="visits">Visits</option>
        </select>
      </div>

      <div className="form-group">
        {entityType === "patients" && (
          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                setCriteria({ ...criteria, hasInsurance: e.target.checked })
              }
            />
            Has Insurance
          </label>
        )}

        {entityType === "visits" && (
          <>
            <label>Start Date: </label>
            <input
              type="date"
              onChange={(e) =>
                setCriteria({ ...criteria, startDate: e.target.value })
              }
            />
            <label>End Date: </label>
            <input
              type="date"
              onChange={(e) =>
                setCriteria({ ...criteria, endDate: e.target.value })
              }
            />
          </>
        )}
      </div>

      <button onClick={fetchData}>Search</button>

      {/* 🟢 Structured Results Display */}
      <div className="results-container">
        <h2>Results</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="json-container">
            {results.length === 0 ? (
              <p>No results found.</p>
            ) : (
              results.map((item) => (
                <div key={item.id} className="result-block">
                  {entityType === "patients" ? (
                    <>
                      <h3>{item.name}</h3>
                      <p><strong>Age:</strong> {item.age}</p>
                      <p><strong>Gender:</strong> {item.gender}</p>
                      <p><strong>Has Insurance:</strong> {item.hasInsurance ? "Yes" : "No"}</p>
                    </>
                  ) : entityType === "doctors" ? (
                    <>
                      <h3>{item.name}</h3>
                      <p><strong>Specialty:</strong> {item.specialty}</p>
                      <p><strong>Location:</strong> {item.location}</p>
                    </>
                  ) : (
                    <>
                      <h3>Visit ID: {item.id}</h3>
                      <p><strong>Patient ID:</strong> {item.patientId}</p>
                      <p><strong>Doctor ID:</strong> {item.doctorId}</p>
                      <p><strong>Date:</strong> {item.date}</p>
                      <p><strong>Reason:</strong> {item.reason}</p>
                      <p><strong>Follow-up:</strong> {item.followUp ? "Required" : "Not Required"}</p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
