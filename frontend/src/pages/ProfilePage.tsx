import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  Plus, 
  Edit2,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { base_host } from '../global';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  age: number;
  blood_type: string;
  allergies: string;
}

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
}

interface JournalEntry {
  id: number;
  content: string;
  type: 'text' | 'audio';
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingContact, setAddingContact] = useState(false);
  const [newJournalEntry, setNewJournalEntry] = useState('');
  const [loading, setLoading] = useState(true);

  const [editedProfile, setEditedProfile] = useState<UserProfile>({
    id: 0,
    name: '',
    email: '',
    age: 0,
    blood_type: '',
    allergies: ''
  });

  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile and emergency contacts
      const profileResponse = await axios.get(`${base_host}api/profile.php?user_id=${user.id}`);
      setProfile(profileResponse.data.user);
      setEditedProfile(profileResponse.data.user);
      setEmergencyContacts(profileResponse.data.emergency_contacts);
      
      // Fetch journal entries
      const journalsResponse = await axios.get(`${base_host}api/journals.php?user_id=${user.id}`);
      setJournalEntries(journalsResponse.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      await axios.put(`${base_host}api/profile.php?user_id=${user.id}`, editedProfile);
      setProfile(editedProfile);
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddContact = async () => {
    if (!user) return;
    
    try {
      await axios.post(`${base_host}api/profile.php?user_id=${user.id}`, newContact);
      setAddingContact(false);
      setNewContact({ name: '', phone: '', relationship: '' });
      fetchProfileData();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleAddJournalEntry = async () => {
    if (!user || !newJournalEntry.trim()) return;
    
    try {
      await axios.post(`${base_host}api/journals.php?user_id=${user.id}`, {
        content: newJournalEntry,
        type: 'text'
      });
      setNewJournalEntry('');
      fetchProfileData();
    } catch (error) {
      console.error('Error adding journal entry:', error);
    }
  };

  const handleDeleteJournalEntry = async (id: number) => {
    if (!user) return;
    
    try {
      await axios.delete(`${base_host}api/journals.php`, {
        data: { id, user_id: user.id }
      });
      fetchProfileData();
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      

      <div className="profile-header">
        <h1>My Profile</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setEditingProfile(!editingProfile)}
        >
          {editingProfile ? <X size={20} /> : <Edit2 size={20} />}
          {editingProfile ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-section">
        <h2><User className="icon" size={24} /> Personal Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Name:</span>
            {editingProfile ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                className="info-input"
              />
            ) : (
              <span className="info-value">{profile?.name}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{profile?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Age:</span>
            {editingProfile ? (
              <input
                type="number"
                value={editedProfile.age}
                onChange={(e) => setEditedProfile({...editedProfile, age: parseInt(e.target.value)})}
                className="info-input"
              />
            ) : (
              <span className="info-value">{profile?.age}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Blood Type:</span>
            {editingProfile ? (
            <select
                value={editedProfile.blood_type}
                onChange={(e) => setEditedProfile({...editedProfile, blood_type: e.target.value})}
                className="info-input"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <span className="info-value">{profile?.blood_type || 'Not specified'}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Allergies:</span>
            {editingProfile ? (
              <textarea
                value={editedProfile.allergies}
                onChange={(e) => setEditedProfile({...editedProfile, allergies: e.target.value})}
                className="info-input"
                rows={3}
              />
            ) : (
              <span className="info-value">{profile?.allergies || 'None specified'}</span>
            )}
          </div>
        </div>
        {editingProfile && (
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={handleUpdateProfile}>
              <Save size={20} /> Save Changes
            </button>
            <button className="btn btn-secondary" onClick={() => setEditingProfile(false)}>
              <X size={20} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2><Phone className="icon" size={24} /> Emergency Contacts</h2>
        <div className="emergency-contacts">
          {emergencyContacts.length === 0 ? (
            <p>No emergency contacts added yet.</p>
          ) : (
            emergencyContacts.map((contact) => (
              <div key={contact.id} className="contact-item">
                <div className="contact-info">
                  <h4>{contact.name}</h4>
                  <p><Phone size={16} /> {contact.phone}</p>
                  <p>{contact.relationship}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {!addingContact ? (
          <button className="btn btn-primary" onClick={() => setAddingContact(true)}>
            <Plus size={20} /> Add Emergency Contact
          </button>
        ) : (
          <div className="add-contact-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Contact Name"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleAddContact}>
                <Save size={20} /> Save Contact
              </button>
              <button className="btn btn-secondary" onClick={() => setAddingContact(false)}>
                <X size={20} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2><Calendar className="icon" size={24} /> Health Journal</h2>
        <div className="journal-section">
          <div className="journal-form">
            <textarea
              placeholder="Write about your health journey today..."
              value={newJournalEntry}
              onChange={(e) => setNewJournalEntry(e.target.value)}
              rows={4}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleAddJournalEntry}
              disabled={!newJournalEntry.trim()}
            >
              Add Entry
            </button>
          </div>
          
          <div className="journal-entries">
            {journalEntries.length === 0 ? (
              <p>No journal entries yet. Start documenting your health journey!</p>
            ) : (
              journalEntries.map((entry) => (
                <div key={entry.id} className="journal-entry">
                  <div className="journal-header">
                    <span className="journal-date">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                    <span className="journal-type">{entry.type}</span>
                    <button 
                      className="btn btn-icon btn-danger"
                      onClick={() => handleDeleteJournalEntry(entry.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="journal-content">
                    {entry.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;