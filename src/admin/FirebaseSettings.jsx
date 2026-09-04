import React, { useState, useEffect } from 'react';
import { 
  getActiveFirebaseConfig, 
  saveFirebaseConfig, 
  testFirebaseConnection, 
  isFirebaseConfigured 
} from '../services/firebase';
import { 
  getActiveCloudinaryConfig, 
  saveCloudinaryConfig, 
  isCloudinaryConfigured 
} from '../services/cloudinary';
import { initFirestoreSync } from '../services/storeService';

export const FirebaseSettings = ({ onToast, onNavigateStore }) => {
  // Firebase state
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });

  // Cloudinary state
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloudName: '',
    uploadPreset: ''
  });

  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingCloudinary, setIsSavingCloudinary] = useState(false);

  useEffect(() => {
    const active = getActiveFirebaseConfig();
    if (active) {
      setConfig({
        apiKey: active.apiKey || '',
        authDomain: active.authDomain || '',
        projectId: active.projectId || '',
        storageBucket: active.storageBucket || '',
        messagingSenderId: active.messagingSenderId || '',
        appId: active.appId || ''
      });
    }

    const activeCld = getActiveCloudinaryConfig();
    if (activeCld) {
      setCloudinaryConfig({
        cloudName: activeCld.cloudName || '',
        uploadPreset: activeCld.uploadPreset || ''
      });
    }
  }, []);

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value.trim() }));
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testFirebaseConnection(config);
      setTestResult(res);
      if (res.success && onToast) {
        onToast('✓ Firebase Firestore connection verified successfully!');
      }
    } catch (e) {
      setTestResult({ success: false, message: e.message || 'Connection test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      saveFirebaseConfig(config);
      initFirestoreSync();
      if (onToast) onToast('✨ Firebase configuration saved & reloaded!');
      setTestResult({ success: true, message: 'Settings saved! Live Firebase sync is active.' });
    } catch (e) {
      setTestResult({ success: false, message: e.message || 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCloudinary = (e) => {
    e.preventDefault();
    setIsSavingCloudinary(true);
    try {
      saveCloudinaryConfig(cloudinaryConfig);
      if (onToast) onToast('☁️ Cloudinary settings saved!');
    } catch (e) {
      if (onToast) onToast('Failed to save Cloudinary settings');
    } finally {
      setIsSavingCloudinary(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to reset Firebase settings?')) {
      const empty = {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
      };
      setConfig(empty);
      saveFirebaseConfig(empty);
      setTestResult(null);
      if (onToast) onToast('Firebase config reset to default.');
    }
  };

  const isConfigActive = isFirebaseConfigured();
  const isCldActive = isCloudinaryConfigured();

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Store Cloud Integrations</h1>
          <p className="admin-page-subtitle">
            Firebase Firestore (Database for descriptions & data) + Cloudinary (Image Hosting).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn-secondary" onClick={onNavigateStore}>
            Go to Storefront
          </button>
        </div>
      </div>

      {/* Cloudinary Integration Card */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 className="admin-card-title">☁️ Cloudinary Image Storage Settings</h2>
            <span style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '12px',
              background: isCldActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isCldActive ? 'var(--admin-success)' : 'var(--admin-warning)',
              fontWeight: 700
            }}>
              {isCldActive ? 'Cloudinary Active' : 'Configure Cloudinary'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveCloudinary} style={{ padding: '24px' }}>
          <p style={{ fontSize: '0.86rem', color: 'var(--admin-text-muted)', marginBottom: '16px' }}>
            When you upload PNG/JPG image files in the Product Form, they will be uploaded directly to your Cloudinary Media account, and the generated URL will be stored in Firebase!
          </p>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">
                Cloud Name <span className="req">*</span>
              </label>
              <input 
                type="text" 
                className="admin-input-text" 
                placeholder="e.g. dxyz123abc" 
                value={cloudinaryConfig.cloudName}
                onChange={(e) => setCloudinaryConfig(prev => ({ ...prev, cloudName: e.target.value.trim() }))}
                required
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '4px' }}>
                Your Cloudinary Account Cloud Name
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                Upload Preset (Unsigned) <span className="req">*</span>
              </label>
              <input 
                type="text" 
                className="admin-input-text" 
                placeholder="e.g. dorcass_preset or ml_default" 
                value={cloudinaryConfig.uploadPreset}
                onChange={(e) => setCloudinaryConfig(prev => ({ ...prev, uploadPreset: e.target.value.trim() }))}
                required
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '4px' }}>
                Create in Cloudinary Console: Settings ⚙️ ➔ Upload ➔ Add upload preset ➔ Signing Mode: <strong>Unsigned</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button 
              type="submit" 
              className="admin-btn-primary"
              disabled={isSavingCloudinary}
            >
              {isSavingCloudinary ? 'Saving...' : 'Save Cloudinary Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Firebase Firestore Status Banner */}
      <div style={{
        background: isConfigActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
        border: `1px solid ${isConfigActive ? 'var(--admin-success)' : 'var(--admin-warning)'}`,
        borderRadius: 'var(--admin-radius-md)',
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: isConfigActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: isConfigActive ? 'var(--admin-success)' : 'var(--admin-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
          }}>
            {isConfigActive ? '✓' : '⚡'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--admin-text-main)' }}>
              {isConfigActive ? 'Firebase Firestore Connected & Active' : 'Firebase Ready for Connection'}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--admin-text-muted)' }}>
              {isConfigActive 
                ? `Project: ${config.projectId || 'dorcass-1d1ad'} • Real-time Firestore sync enabled`
                : 'Enter your Firebase web credentials below to enable live cloud sync.'}
            </div>
          </div>
        </div>

        <button 
          type="button" 
          className="admin-btn-secondary"
          onClick={handleTest}
          disabled={isTesting || !config.apiKey}
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {testResult && (
        <div style={{
          background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${testResult.success ? 'var(--admin-success)' : 'var(--admin-danger)'}`,
          color: testResult.success ? 'var(--admin-success)' : 'var(--admin-danger)',
          padding: '12px 18px',
          borderRadius: 'var(--admin-radius-sm)',
          marginBottom: '20px',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          {testResult.success ? '✓ ' : '✕ '} {testResult.message}
        </div>
      )}

      {/* Firebase Configuration Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">🔥 Firebase Credentials (Firestore Database)</h2>
        </div>

        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">
                API Key (apiKey) <span className="req">*</span>
              </label>
              <input 
                type="text" 
                className="admin-input-text" 
                placeholder="AIzaSy..." 
                value={config.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">
                Project ID (projectId) <span className="req">*</span>
              </label>
              <input 
                type="text" 
                className="admin-input-text" 
                placeholder="dorcass-1d1ad" 
                value={config.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Auth Domain (authDomain)</label>
              <input 
                type="text" 
                className="admin-input-text" 
                placeholder="dorcass-1d1ad.firebaseapp.com" 
                value={config.authDomain}
                onChange={(e) => handleChange('authDomain', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">App ID (appId)</label>
              <input 
                type="text" 
                className="admin-input-text" 
                placeholder="1:245053468271:web:67b10777337da3e197a79a" 
                value={config.appId}
                onChange={(e) => handleChange('appId', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <button 
              type="button" 
              className="admin-btn-secondary" 
              onClick={handleClear}
              style={{ color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }}
            >
              Reset Configuration
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="admin-btn-secondary"
                onClick={handleTest}
                disabled={isTesting || !config.apiKey}
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
              <button 
                type="submit" 
                className="admin-btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save & Enable Firebase'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
