import React, { useState } from "react";
import axios from "axios";
import "./Search.css"; 

function Search() {
  const [entityType, setEntityType] = useState("patients");
  const [criteria, setCriteria] = useState({
    hasInsurance: false,  // Default to false
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch data from AWS API Gateway
  const fetchData = async () => {
    setLoading(true);
    setResults([]); // Clear previous results

    // Prepare the query parameters
    const params = {
        table: entityType, // Lambda expects "table"
    
        // Patients Search Filters
        ...(entityType === "patients" && criteria.hasInsurance !== undefined && { has_insurance: criteria.hasInsurance }),
    
        // Doctors Search Filters
        ...(entityType === "doctors" && criteria.specialty && { specialty: criteria.specialty }),
        // Name and location criteria can't currently be set up from the app UI
        ...(entityType === "doctors" && criteria.name && { name: criteria.name }), 
        ...(entityType === "doctors" && criteria.location && { location: criteria.location }), 
    
        // Visits Search Filters
        ...(entityType === "visits" && criteria.startDate && { start_date: criteria.startDate }),
        ...(entityType === "visits" && criteria.endDate && { end_date: criteria.endDate }),
        ...(entityType === "visits" && criteria.specialty && { specialty: criteria.specialty }),
        ...(entityType === "visits" && criteria.followUp !== undefined && { follow_up: criteria.followUp }),
    };
    

    try {
      console.log("Sending Query Params:", params);
      const response = await axios.get("https://pppqz9gut3.execute-api.us-east-1.amazonaws.com/dev/search", { params });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
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
        {/* Patients Search Filters */}
        {entityType === "patients" && (
          <label>
            <input
              type="checkbox"
              checked={criteria.hasInsurance}
              onChange={(e) =>
                setCriteria({ ...criteria, hasInsurance: e.target.checked })
              }
            />
            Has Insurance
          </label>
        )}

        {/* Doctors Search Filters */}
        {entityType === "doctors" && (
          <div className="form-group">
            <label>Specialty:</label>
            <select onChange={(e) => setCriteria({ ...criteria, specialty: e.target.value })}>
              <option value="">Any</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>
        )}

        {/* Visits Search Filters */}
        {entityType === "visits" && (
          <div className="visits-filters">
            <div className="form-group">
              <label>Start Date:</label>
              <input type="date" onChange={(e) => setCriteria({ ...criteria, startDate: e.target.value })} />
            </div>

            <div className="form-group">
              <label>End Date:</label>
              <input type="date" onChange={(e) => setCriteria({ ...criteria, endDate: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Doctor Specialty:</label>
              <select onChange={(e) => setCriteria({ ...criteria, specialty: e.target.value })}>
                <option value="">Any</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <input type="checkbox" id="followUp" onChange={(e) => setCriteria({ ...criteria, followUp: e.target.checked })} />
              <label htmlFor="followUp">Is a Follow-up Visit</label>
            </div>
          </div>
        )}
      </div>

      <button onClick={fetchData}>Search</button>

      {/* Results displayed in individual boxes */}
      <div className="results-container">
        <h2>Results</h2>
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} className="result-box">
              {Object.entries(item).map(([key, value]) => (
            <p key={key}>
                {/* Format visit_date to remove time part */}
                <strong>{key}:</strong> {key === "visit_date" ? value.split("T")[0] : String(value)}  
            </p>
            ))}
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
