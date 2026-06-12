import React from 'react';
import { Dropdown, Space, Avatar, type MenuProps } from 'antd';
import { DownOutlined, UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';

type UserMenuProps = {
  keycloak: any;
};

const UserMenu: React.FC<UserMenuProps> = ({ keycloak }) => {
  const userName =
    keycloak.tokenParsed?.name ||
    keycloak.tokenParsed?.preferred_username ||
    'User';
  const userEmail = keycloak.tokenParsed?.email;

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div>
          <div style={{ fontWeight: 600 }}>{userName}</div>
          {userEmail && (
            <div style={{ fontSize: 12, color: '#999' }}>{userEmail}</div>
          )}
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'change-password',
      icon: <LockOutlined />, 
      label: 'Đổi mật khẩu',
      onClick: () => keycloak.accountManagement(),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />, 
      label: 'Đăng xuất',
      danger: true,
      onClick: () => keycloak.logout(),
    },
  ];

  return (
    <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
      <Space style={{ cursor: 'pointer', color: '#fff' }}>
        <Avatar icon={<UserOutlined />} />
        {userName}
        <DownOutlined />
      </Space>
    </Dropdown>
  );
};

export default UserMenu;
