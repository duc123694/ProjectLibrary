export const APP_NAME = 'LibraryHub';
export const APP_DESCRIPTION = 'Hệ thống Quản lý Thư viện & Cho thuê sách Online';

export const ROLES = {
  ADMIN: 'ADMIN' as const,
  LIBRARIAN: 'LIBRARIAN' as const,
  USER: 'USER' as const,
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Quản trị viên',
  LIBRARIAN: 'Thủ thư',
  USER: 'Người dùng',
};

export const USER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  LOCKED: 'Đã khóa',
};

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};
