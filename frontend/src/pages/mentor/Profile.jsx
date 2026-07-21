import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import UserAvatar from '../../components/UserAvatar';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [expertise, setExpertise] = useState(user?.expertise?.join(', ') || '');
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setSubmitting(true);
      const res = await api.post('/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSubmitting(false);
      if (res.data.success) {
        setAvatar(res.data.url);
        success('Profile image uploaded! Click Save Profile to apply.');
      } else {
        error(res.data.message || 'Image upload failed');
      }
    } catch (err) {
      setSubmitting(false);
      console.error(err);
      error(err.response?.data?.message || 'Error uploading image');
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    success('Avatar removed. Click Save Profile to apply.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Name cannot be empty');
      return;
    }

    setSubmitting(true);
    const skillsArray = skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const expertiseArray = expertise
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const res = await updateProfile({
      name,
      bio,
      avatar,
      skills: skillsArray,
      expertise: expertiseArray,
    });
    setSubmitting(false);

    if (res.success) {
      success('Profile updated successfully! Check your new avatar.');
    } else {
      error(res.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-left">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-8">Mentor Profile</h1>
      
      <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm">
        
        {/* Profile Avatar Card Preview */}
        <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-6">
          <UserAvatar
            user={{ name: name || user?.name, avatar }}
            className="w-16 h-16 text-2xl font-black ring-4 ring-indigo-50 bg-slate-50"
          />
          <div>
            <h3 className="font-bold text-slate-800 text-base">{user?.name}</h3>
            <span className="inline-block text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
              {user?.role} Account
            </span>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Profile Picture
            </label>
            <div className="flex flex-wrap gap-2.5 mt-1">
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm inline-block">
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl transition border border-rose-100"
                >
                  Remove Current Photo
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1.5 leading-normal">
              Upload a high-quality JPG or PNG image. Max file size is 5MB.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Brief Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your research, teaching philosophy, or background..."
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Expertise Categories (comma separated)
            </label>
            <input
              type="text"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="e.g. Web Development, Deep Learning"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Tech Skills (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, PyTorch"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? 'Saving changes...' : 'Save Profile'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Profile;
