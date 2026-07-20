import React, { useState, useEffect } from 'react';
import { User, Lock, Camera, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import userApi from '../../api/userApi';
import type { UpdateUserRequest, ChangePasswordRequest } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROLE_LABELS } from '../../utils/constants';

type Tab = 'info' | 'password';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>('info');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Info form
  const [infoForm, setInfoForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  // Password form
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    if (user) {
      setInfoForm({ fullName: user.fullName, phone: user.phone, avatar: user.avatar || '' });
    }
  }, [user]);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const req: UpdateUserRequest = {
        fullName: infoForm.fullName,
        phone: infoForm.phone,
        avatar: infoForm.avatar || undefined,
      };
      const res = await userApi.updateUser(user.id, req);
      updateUser(res.data.data);
      showMsg('success', 'Cập nhật thông tin thành công!');
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      showMsg('error', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      showMsg('error', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      const req: ChangePasswordRequest = {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmNewPassword: pwForm.confirmNewPassword,
      };
      await userApi.changePassword(user.id, req);
      showMsg('success', 'Đổi mật khẩu thành công!');
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-600" />
          <div className="px-6 pb-6 -mt-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-3xl bg-white border-4 border-white shadow-xl overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-3xl font-black text-white">{user.fullName.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <h1 className="text-2xl font-black text-surface-900">{user.fullName}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-surface-500">{user.email}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-surface-100">
            {[
              { id: 'info' as Tab, icon: User, label: 'Thông tin cá nhân' },
              { id: 'password' as Tab, icon: Lock, label: 'Đổi mật khẩu' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setMessage(null); }}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all -mb-px ${
                  tab === t.id
                    ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Message */}
            {message && (
              <div className={`flex items-center gap-3 p-4 rounded-2xl mb-5 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* Info Tab */}
            {tab === 'info' && (
              <form onSubmit={handleInfoSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-surface-600 mb-1.5">Họ và tên</label>
                  <input
                    type="text"
                    value={infoForm.fullName}
                    onChange={e => setInfoForm(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-600 mb-1.5">Số điện thoại</label>
                  <input
                    type="tel"
                    value={infoForm.phone}
                    onChange={e => setInfoForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-600 mb-1.5">Email (không thể đổi)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 bg-surface-100 border border-surface-200 rounded-2xl text-sm text-surface-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-surface-600 mb-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    URL ảnh đại diện
                  </label>
                  <input
                    type="url"
                    value={infoForm.avatar}
                    onChange={e => setInfoForm(p => ({ ...p, avatar: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-500/20 transition-all disabled:opacity-60"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {tab === 'password' && (
              <form onSubmit={handlePwSubmit} className="space-y-5">
                {[
                  { key: 'currentPassword', label: 'Mật khẩu hiện tại', show: showPw.current, toggle: () => setShowPw(p => ({ ...p, current: !p.current })) },
                  { key: 'newPassword', label: 'Mật khẩu mới', show: showPw.new, toggle: () => setShowPw(p => ({ ...p, new: !p.new })) },
                  { key: 'confirmNewPassword', label: 'Xác nhận mật khẩu mới', show: showPw.confirm, toggle: () => setShowPw(p => ({ ...p, confirm: !p.confirm })) },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-surface-600 mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.show ? 'text' : 'password'}
                        value={pwForm[field.key as keyof typeof pwForm]}
                        onChange={e => setPwForm(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full pl-4 pr-12 py-3 bg-surface-50 border border-surface-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                        required
                        minLength={field.key !== 'currentPassword' ? 6 : 1}
                      />
                      <button
                        type="button"
                        onClick={field.toggle}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                      >
                        {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-500/20 transition-all disabled:opacity-60"
                  >
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
