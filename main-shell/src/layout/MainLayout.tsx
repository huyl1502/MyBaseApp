import { Routes, Route, Link } from "react-router-dom";
import {
  Button,
  Dropdown,
  Layout,
  Menu,
  type MenuProps,
} from "antd";
import { useEffect, useState } from "react";
import { loadManifest } from "../mf/manifest";
import RemotePage from "../components/RemotePage";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { getKeycloak } from "../keycloak/keycloak";
import UserMenu from "../components/UserMenu";

const { Content, Header, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export default function MainLayout() {
  const keycloak = getKeycloak();

  const items: MenuItem[] = [
    { key: "1", icon: <PieChartOutlined />, label: "Option 1" },
    { key: "2", icon: <DesktopOutlined />, label: "Option 2" },
    { key: "3", icon: <ContainerOutlined />, label: "Option 3" },
    {
      key: "sub1",
      label: "Navigation One",
      icon: <MailOutlined />,
      children: [
        { key: "5", label: "Option 5" },
        { key: "6", label: "Option 6" },
        { key: "7", label: "Option 7" },
        { key: "8", label: "Option 8" },
      ],
    },
    {
      key: "sub2",
      label: "Navigation Two",
      icon: <AppstoreOutlined />,
      children: [
        { key: "9", label: "Option 9" },
        { key: "10", label: "Option 10" },
        {
          key: "sub3",
          label: "Submenu",
          children: [
            { key: "11", label: "Option 11" },
            { key: "12", label: "Option 12" },
          ],
        },
      ],
    },
  ];

  const [collapsed, setCollapsed] = useState(true);

  const [manifest, setManifest] = useState<any>(null);

  useEffect(() => {
    loadManifest().then(setManifest);
  }, []);

  if (!manifest) return <>Loading...</>;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: 50,
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown
            menu={{
              items: manifest.modules.map((m: any) => ({
                key: m.route,
                label: <Link to={m.route}>{m.displayName}</Link>,
              })),
            }}
            placement="bottomLeft"
            trigger={["click"]}
          >
            <Button
              type="text"
              icon={<AppstoreOutlined />}
              style={{ color: "#fff" }}
            />
          </Dropdown>

          <div style={{ marginLeft: 12, color: "#fff" }}>Header</div>
        </div>

        {/* RIGHT */}
        <UserMenu keycloak={keycloak} />
      </Header>

      {/* CONTENT */}
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            defaultSelectedKeys={["1"]}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            tooltip={{ placement: "left" }}
            items={items}
          />
        </Sider>
        <Content>
          <Routes>
            {manifest.modules.map((m: any) => (
              <Route
                key={m.name}
                path={`${m.route}/*`}
                element={<RemotePage module={m} />}
              />
            ))}

            <Route path="*" element={<div>Home</div>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
