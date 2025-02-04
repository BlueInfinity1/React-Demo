import React, { createContext, useState, useEffect } from "react";
import { fetchDoctorsAndPatients } from "../services/api";

export const DoctorsPatientsContext = createContext();

export const DoctorsPatientsProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            console.log("Starting data fetch");
            setLoading(true);
            try {
                const data = await fetchDoctorsAndPatients();
                console.log("Data fetched:", data);
                setDoctors(data.doctors);
                setPatients(data.patients);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
            console.log("Data fetch complete");
        };
        loadData();
    }, []);

    return (
        <DoctorsPatientsContext.Provider
          value={{ doctors, setDoctors, patients, setPatients, loading }}
        >
          {children}
        </DoctorsPatientsContext.Provider>
      );
      
};
