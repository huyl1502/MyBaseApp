// menuMapper.tsx

import React from "react";
import type { MenuProps } from "antd";

import {
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import type { MenuDto } from "../models/DTO/MenuDTO";

type MenuItem = Required<MenuProps>["items"][number];

const iconMap: Record<string, React.ReactNode> = {
  PieChartOutlined: <PieChartOutlined />,
  DesktopOutlined: <DesktopOutlined />,
  ContainerOutlined: <ContainerOutlined />,
  MailOutlined: <MailOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
};

export function toMenuItems(menus: MenuDto[]): MenuItem[] {
  return menus.map((m) => ({
    key: m.path ?? m.id,
    label: m.title,
    icon: m.icon ? iconMap[m.icon] : undefined,
    children: m.children
      ? toMenuItems(m.children)
      : undefined,
  }));
}