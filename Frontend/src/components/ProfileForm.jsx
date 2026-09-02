import { useState, useEffect } from 'react';

const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition duration-150';

const ProfileForm = ({ profile, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    techStack: '',
    experience: 'Fresher',
    currentRole: '',
    location: '',
    bio: '',
    skills: '',
    linkedin: '',
    github: '',
  });

  useEffect(() => {
    if (profile?.profile) {
      setFormData({
        techStack: profile.profile.techStack || '',
        experience: profile.profile.experience || 'Fresher',
        currentRole: profile.profile.currentRole || '',
        location: profile.profile.location || '',
        bio: profile.profile.bio || '',
        skills: profile.profile.skills || '',
        linkedin: profile.profile.linkedin || '',
        github: profile.profile.github || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const experienceOptions = ['Fresher', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Principal'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tech stack</label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js"
            className={inputClass}
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience level</label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`${inputClass} bg-white`}
          >
            {experienceOptions.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Current Role */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Current role</label>
          <input
            type="text"
            name="currentRole"
            value={formData.currentRole}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer"
            className={inputClass}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA"
            className={inputClass}
          />
        </div>

        {/* Skills */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, MongoDB, AWS"
            className={inputClass}
          />
        </div>

        {/* Bio */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about yourself..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn URL</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourname"
            className={inputClass}
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">GitHub URL</label>
          <input
            type="url"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/yourusername"
            className={inputClass}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors duration-200"
        >
          {loading ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;