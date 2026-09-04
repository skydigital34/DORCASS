const CLOUDINARY_CONFIG_KEY = 'dorcass_cloudinary_custom_config_v1';

// Default Cloudinary config for DORCASS
const DEFAULT_CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'nlog05bi',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'dorcass'
};

/**
 * Get active Cloudinary configuration
 */
export const getActiveCloudinaryConfig = () => {
  try {
    const saved = localStorage.getItem(CLOUDINARY_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.cloudName) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading saved Cloudinary config:', e);
  }
  return DEFAULT_CLOUDINARY_CONFIG;
};

/**
 * Save Cloudinary configuration
 */
export const saveCloudinaryConfig = (config) => {
  try {
    localStorage.setItem(CLOUDINARY_CONFIG_KEY, JSON.stringify(config));
    return config;
  } catch (e) {
    console.error('Failed to save Cloudinary config:', e);
    throw e;
  }
};

/**
 * Check if Cloudinary is configured
 */
export const isCloudinaryConfigured = () => {
  const cfg = getActiveCloudinaryConfig();
  return Boolean(cfg && cfg.cloudName && cfg.uploadPreset);
};

/**
 * Upload an image file directly to Cloudinary
 * @param {File} file - Browser File object (PNG, JPG, etc.)
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Cloudinary Secure Delivery URL
 */
export const uploadImageToCloudinary = (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const cfg = getActiveCloudinaryConfig();

    if (!cfg.cloudName || !cfg.uploadPreset) {
      // If Cloudinary credentials are not entered yet, convert to Data URL fallback
      console.warn('Cloudinary Cloud Name or Upload Preset not configured, using direct image data');
      const reader = new FileReader();
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cfg.uploadPreset);
    formData.append('folder', 'dorcass_products');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url) {
            if (onProgress) onProgress(100);
            resolve(res.secure_url);
          } else {
            reject(new Error('Cloudinary response did not include a secure_url'));
          }
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Cloudinary upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during Cloudinary upload'));
    };

    xhr.send(formData);
  });
};
