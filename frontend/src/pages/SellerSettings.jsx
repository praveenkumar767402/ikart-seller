import React from 'react';
import { Save, User, MapPin, Globe, FileText } from 'lucide-react';
import './SellerProducts.css'; // Reusing styles for consistency (or create new if needed)

const SellerSettings = () => {
    const [profile, setProfile] = React.useState({
        companyName: '',
        email: '',
        bio: '',
        location: '',
        website: ''
    });
    const [loading, setLoading] = React.useState(true);
    const [message, setMessage] = React.useState('');

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch('http://localhost:8000/api/seller/profile', {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch('http://localhost:8000/api/seller/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(profile)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Profile updated successfully! ✅');
                setProfile(data.seller);
            } else {
                setMessage('Failed to update profile ❌');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage('Error connecting to server ❌');
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="seller-products">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your account and profile</p>
                </div>
            </div>

            <div className="settings-container" style={{ maxWidth: '800px', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><User size={16} style={{ display: 'inline', marginRight: '8px' }} />Company Name</label>
                        <input type="text" name="companyName" value={profile.companyName} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email (Cannot be changed)</label>
                        <input type="email" value={profile.email} disabled className="bg-gray-100 cursor-not-allowed" />
                    </div>

                    <div className="form-group">
                        <label><FileText size={16} style={{ display: 'inline', marginRight: '8px' }} />Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio || ''}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tell us about your brand..."
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label><MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />Location</label>
                            <input type="text" name="location" value={profile.location || ''} onChange={handleChange} placeholder="e.g. New York, USA" />
                        </div>
                        <div className="form-group">
                            <label><Globe size={16} style={{ display: 'inline', marginRight: '8px' }} />Website</label>
                            <input type="text" name="website" value={profile.website || ''} onChange={handleChange} placeholder="https://yourbrand.com" />
                        </div>
                    </div>

                    {message && <div className={`message ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`} style={{ marginBottom: '1rem', fontWeight: '500' }}>{message}</div>}

                    <div className="modal-actions" style={{ marginTop: '2rem' }}>
                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerSettings;
