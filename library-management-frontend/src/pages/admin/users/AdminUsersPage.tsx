import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Eye, Lock, Unlock, Shield, ChevronDown } from 'lucide-react';
import userApi from '../../../api/userApi';
import type { UserResponse, Role, UserStatus } from '../../../types';
import Badge from '../../../components/common/Badge';
import Pagination from '../../../components/common/Pagination';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { ROLE_LABELS, USER_STATUS_LABELS } from '../../../utils/constants';

const PAGE_SIZE = 10;

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | undefined>();
  const [statusFilter, setStatusFilter] = useState<UserStatus | undefined>();
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'lock' | 'unlock' | 'role';
    user: UserResponse;
    newValue?: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userApi.getAllUsers({ keyword: keyword || undefined, role: roleFilter, status: statusFilter, page, size: PAGE_SIZE, sortBy: 'createdAt', sortDir: 'desc' });
      const data = res.data.data;
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, [keyword, roleFilter, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      const { type, user, newValue } = confirmAction;
      if (type === 'lock') await userApi.updateUserStatus(user.id, 'LOCKED');
      else if (type === 'unlock') await userApi.updateUserStatus(user.id, 'ACTIVE');
      else if (type === 'role' && newValue) await userApi.updateUserRole(user.id, newValue as Role);
      setConfirmAction(null);
      fetchUsers();
    } catch {}
    finally { setActionLoading(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  const getRoleBadge = (role: Role) => {
    const variants: Record<Role, 'danger' | 'info' | 'default'> = { ADMIN: 'danger', LIBRARIAN: 'info', USER: 'default' };
    return <Badge variant={variants[role]} size="sm">{ROLE_LABELS[role]}</Badge>;
  };

  const getStatusBadge = (status: UserStatus) => (
    <Badge variant={status === 'ACTIVE' ? 'success' : 'danger'} dot size="sm">
      {USER_STATUS_LABELS[status]}
    </Badge>
  );

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-black text-surface-900">Quản lý Người Dùng</h1>
              <p className="text-surface-500 text-sm mt-0.5">{totalElements} tài khoản</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setPage(0); }}
                placeholder="Tìm tên, email..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div className="relative">
              <select
                value={roleFilter ?? ''}
                onChange={e => { setRoleFilter((e.target.value as Role) || undefined); setPage(0); }}
                className="appearance-none pl-4 pr-9 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">Tất cả quyền</option>
                <option value="ADMIN">Quản trị viên</option>
                <option value="LIBRARIAN">Thủ thư</option>
                <option value="USER">Người dùng</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter ?? ''}
                onChange={e => { setStatusFilter((e.target.value as UserStatus) || undefined); setPage(0); }}
                className="appearance-none pl-4 pr-9 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Đã khóa</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-surface-200 mx-auto mb-3" />
            <p className="text-surface-400 text-sm">Không có người dùng nào</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100 bg-surface-50/50">
                    <th className="text-left px-6 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Người dùng</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Điện thoại</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Quyền</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden md:table-cell">Trạng thái</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Ngày tạo</th>
                    <th className="text-right px-6 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-surface-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-surface-900">{user.fullName}</p>
                            <p className="text-xs text-surface-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-sm text-surface-600">{user.phone}</span>
                      </td>
                      <td className="px-4 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-4 hidden md:table-cell">{getStatusBadge(user.status)}</td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-xs text-surface-500">{formatDate(user.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.status === 'ACTIVE' ? (
                            <button
                              onClick={() => setConfirmAction({ type: 'lock', user })}
                              className="p-2 text-surface-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                              title="Khóa tài khoản"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmAction({ type: 'unlock', user })}
                              className="p-2 text-surface-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Mở khóa tài khoản"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-surface-100">
              <Pagination currentPage={page} totalPages={totalPages} totalElements={totalElements} pageSize={PAGE_SIZE} onPageChange={setPage} loading={loading} />
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Thông tin người dùng" size="md">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl">
                {selectedUser.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-surface-900 text-lg">{selectedUser.fullName}</h3>
                <p className="text-sm text-surface-500">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1.5">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>
            <div className="p-4 bg-surface-50 rounded-2xl space-y-2 text-sm">
              <Row label="Điện thoại" value={selectedUser.phone} />
              <Row label="Ngày tạo" value={formatDate(selectedUser.createdAt)} />
              <Row label="Cập nhật" value={formatDate(selectedUser.updatedAt)} />
            </div>

            {/* Role Change */}
            <div className="p-4 bg-surface-50 rounded-2xl">
              <p className="text-xs font-semibold text-surface-600 mb-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Đổi quyền hạn
              </p>
              <div className="flex gap-2 flex-wrap">
                {(['USER', 'LIBRARIAN', 'ADMIN'] as Role[]).map(role => (
                  <button
                    key={role}
                    onClick={() => setConfirmAction({ type: 'role', user: selectedUser, newValue: role })}
                    disabled={selectedUser.role === role}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      selectedUser.role === role
                        ? 'bg-primary-600 text-white cursor-not-allowed'
                        : 'bg-surface-200 text-surface-600 hover:bg-primary-100 hover:text-primary-700'
                    }`}
                  >
                    {ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={
          confirmAction?.type === 'lock' ? 'Khóa tài khoản' :
          confirmAction?.type === 'unlock' ? 'Mở khóa tài khoản' : 'Đổi quyền hạn'
        }
        message={
          confirmAction?.type === 'lock'
            ? `Khóa tài khoản của "${confirmAction?.user.fullName}"? Người dùng sẽ không thể đăng nhập.`
            : confirmAction?.type === 'unlock'
            ? `Mở khóa tài khoản của "${confirmAction?.user.fullName}"?`
            : `Đổi quyền của "${confirmAction?.user.fullName}" thành ${ROLE_LABELS[confirmAction?.newValue as Role || 'USER']}?`
        }
        confirmLabel="Xác nhận"
        loading={actionLoading}
        variant={confirmAction?.type === 'lock' ? 'danger' : 'warning'}
      />
    </div>
  );
};

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4 text-sm">
    <span className="text-surface-500 shrink-0">{label}</span>
    <span className="text-surface-700 text-right">{value}</span>
  </div>
);

export default AdminUsersPage;
