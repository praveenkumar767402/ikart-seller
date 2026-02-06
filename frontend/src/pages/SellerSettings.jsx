import React, { useState, useEffect } from 'react';
import { Save, User, MapPin, Globe, FileText, Camera } from 'lucide-react';
import './SellerProducts.css'; // Reusing styles

const SellerSettings = () => {
    const [profile, setProfile] = useState({
        companyName: '',
        email: '',
        bio: '',
        location: '',
        website: '',
        image: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch('/api/seller/profile', {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
                if (data.image) setPreview(data.image);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Saving...');
        try {
            const token = localStorage.getItem('sellerToken');
            const formData = new FormData();
            formData.append('companyName', profile.companyName);
            formData.append('bio', profile.bio || '');
            formData.append('location', profile.location || '');
            formData.append('website', profile.website || '');
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const response = await fetch('/api/seller/profile', {
                method: 'PUT',
                headers: {
                    'x-auth-token': token
                    // Content-Type not needed, fetch sets it for FormData
                },
                body: formData
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

                    {/* Profile Image Section */}
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1rem' }}>
                            <img
                                src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.companyName || 'User')}&background=f3f4f6`}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                            <label htmlFor="image-upload" style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--color-primary)', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                <Camera size={18} />
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Click the camera icon to update photo</p>
                    </div>

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
