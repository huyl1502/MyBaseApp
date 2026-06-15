// menuMapper.tsx

import React from "react";
import type { MenuProps } from "antd";

import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import type { MenuDto } from "../models/DTO/MenuDTO";

type MenuItem = Required<MenuProps>["items"][number];

const iconMap: Record<string, React.ReactNode> = {
  PieChartOutlined: <PieChartOutlined />,
  DesktopOutlined: <DesktopOutlined />,
  ContainerOutlined: <ContainerOutlined />,
  MailOutlined: <MailOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  SettingOutlined: <SettingOutlined />,
  MenuOutlined: <MenuOutlined />
};

export function toMenuItems(menus: MenuDto[]): MenuItem[] {
  return menus.map((m) => ({
    key: m.Url ?? m.MenuId,
    label: m.MenuName,
    icon: m.Icon ? iconMap[m.Icon] : undefined,
    children: m.Children
      ? toMenuItems(m.Children)
      : undefined,
  }));
}