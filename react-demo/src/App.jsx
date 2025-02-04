import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { DoctorsPatientsProvider } from "./context/DoctorsPatientsContext"; // Import provider
import Search from "./components/Search";
import BookAppointment from "./components/BookAppointment";
import "./App.css";

function App() {
    return (
        <DoctorsPatientsProvider> {/* Wrap the app in the provider */}
            <Router>
                <div className="app-container">
                    <h1>Patients & Doctors System</h1>

                    {/* Navigation Buttons */}
                    <div className="button-container">
                        <Link to="/search">
                            <button>Search for doctors, patients, and visits</button>
                        </Link>
                        <Link to="/book-appointment">
                            <button>Book an appointment</button>
                        </Link>
                    </div>

                    {/* Define Routes */}
                    <Routes>
                        <Route path="/search" element={<Search />} />
                        <Route path="/book-appointment" element={<BookAppointment />} />
                        <Route path="/" element={<h2>Welcome! Choose an option above.</h2>} />
                    </Routes>
                </div>
            </Router>
        </DoctorsPatientsProvider>
    );
}

export default App;
