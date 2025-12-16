import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Stethoscope, 
  Plus, 
  Save, 
  Calendar,
  FileText,
  User,
  X,
  Heart
} from 'lucide-react';
import { base_host } from '../global';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  email: string;
  phone: string;
}

interface Diagnosis {
  id: number;
  diagnosis: string;
  prescriptions: string;
  suggestions: string;
  diagnosis_date: string;
  doctor_name: string;
  doctor_specialization: string;
}

const DoctorsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'doctors' | 'diagnoses'>('diagnoses');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [addingDiagnosis, setAddingDiagnosis] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newDiagnosis, setNewDiagnosis] = useState({
    doctor_id: '',
    diagnosis: '',
    prescriptions: '',
    suggestions: '',
    diagnosis_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      fetchDoctors();
      fetchDiagnoses();
    }
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${base_host}api/doctors.php`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchDiagnoses = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${base_host}api/doctors.php?user_id=${user.id}`);
      setDiagnoses(response.data);
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDiagnosis = async () => {
    if (!user) return;
    
    try {
      await axios.post(`${base_host}api/doctors.php?user_id=${user.id}`, newDiagnosis);
      
      setNewDiagnosis({
        doctor_id: '',
        diagnosis: '',
        prescriptions: '',
        suggestions: '',
        diagnosis_date: new Date().toISOString().split('T')[0]
      });
      setAddingDiagnosis(false);
      fetchDiagnoses();
    } catch (error) {
      console.error('Error adding diagnosis:', error);
    }
  };

  if (loading) {
    return (
      <div className="doctors-page">
        <div className="loading">Loading medical data...</div>
      </div>
    );
  }

  return (
    <div className="doctors-page">
      <nav className="navbar">
        <div className="nav-brand">
          <Heart className="icon" size={30} />
          <span>CradiaHi</span>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/food">Food</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/streaks">Streaks</Link>
        </div>
      </nav>

      <div className="doctors-header">
        <h1>Medical Care</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'diagnoses' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagnoses')}
          >
            <FileText size={20} /> My Diagnoses
          </button>
          <button 
            className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <Stethoscope size={20} /> Available Doctors
          </button>
        </div>
      </div>

      {activeTab === 'diagnoses' && (
        <div className="doctors-section">
          <div className="diagnoses-header">
            <h3>Your Medical Diagnoses</h3>
            <button className="btn btn-primary" onClick={() => setAddingDiagnosis(true)}>
              <Plus size={20} /> Add Diagnosis
            </button>
          </div>

          {addingDiagnosis && (
            <div className="diagnosis-form">
              <h3>Add New Diagnosis</h3>
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  value={newDiagnosis.doctor_id}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, doctor_id: e.target.value})}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Diagnosis</label>
                <textarea
                  value={newDiagnosis.diagnosis}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, diagnosis: e.target.value})}
                  placeholder="Enter diagnosis details"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Prescriptions</label>
                <textarea
                  value={newDiagnosis.prescriptions}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, prescriptions: e.target.value})}
                  placeholder="List medications and dosages"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Doctor's Suggestions</label>
                <textarea
                  value={newDiagnosis.suggestions}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, suggestions: e.target.value})}
                  placeholder="Enter lifestyle changes, follow-up instructions, etc."
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Diagnosis Date</label>
                <input
                  type="date"
                  value={newDiagnosis.diagnosis_date}
                  onChange={(e) => setNewDiagnosis({...newDiagnosis, diagnosis_date: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleAddDiagnosis}>
                  <Save size={20} /> Save Diagnosis
                </button>
                <button className="btn btn-secondary" onClick={() => setAddingDiagnosis(false)}>
                  <X size={20} /> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="diagnoses-list">
            {diagnoses.length === 0 ? (
              <div className="no-diagnoses">
                <FileText size={48} />
                <h3>No Diagnoses Yet</h3>
                <p>Add your first medical diagnosis to start tracking your health journey.</p>
              </div>
            ) : (
              diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="diagnosis-item">
                  <div className="diagnosis-header">
                    <div className="doctor-info">
                      <h4>Dr. {diagnosis.doctor_name}</h4>
                      <p>{diagnosis.doctor_specialization}</p>
                    </div>
                    <div className="diagnosis-date">
                      <Calendar size={16} />
                      {new Date(diagnosis.diagnosis_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="diagnosis-content">
                    <div className="diagnosis-section">
                      <h5>Diagnosis:</h5>
                      <p>{diagnosis.diagnosis}</p>
                    </div>
                    
                    <div className="diagnosis-section">
                      <h5>Prescriptions:</h5>
                      <p>{diagnosis.prescriptions}</p>
                    </div>
                    
                    <div className="diagnosis-section">
                      <h5>Suggestions:</h5>
                      <p>{diagnosis.suggestions}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="doctors-section">
          <h3>Available Doctors</h3>
          <div className="doctors-list">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-header">
                  <div className="doctor-avatar">
                    <User size={40} />
                  </div>
                  <div className="doctor-info">
                    <h4>Dr. {doctor.name}</h4>
                    <p className="specialization">{doctor.specialization}</p>
                  </div>
                </div>
                
                <div className="doctor-contact">
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <p><strong>Phone:</strong> {doctor.phone}</p>
                </div>
                
                <div className="doctor-actions">
                  <button className="btn btn-primary btn-sm">
                    Book Appointment
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;