import { Link } from "react-router-dom";
import {
  Button,
  Dropdown,
  Layout,
  Menu,
  message,
  type MenuProps,
} from "antd";
import { useEffect, useState } from "react";
import { loadManifest } from "../mf/manifest";
import {
  AppstoreOutlined,
} from "@ant-design/icons";
import { getKeycloak } from "../keycloak/keycloak";
import UserMenu from "../components/UserMenu";
import RouteManager from "../components/Route/RouteManager";
import { getMenus } from "../services/MenuService";
import { toMenuItems } from "../components/MappingIcon";
import { useNavigate } from "react-router-dom";

const { Content, Header, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

export default function MainLayout() {
  const navigate = useNavigate();
  const keycloak = getKeycloak();

  const [collapsed, setCollapsed] = useState(true);
  const [manifest, setManifest] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const loadMenu = async () => {
    try {
      const res = await getMenus();

      setMenuItems(toMenuItems(res.data));
    } catch (err) {
      message.error("Load menu failed", err);
    }
  };

  useEffect(() => {
    loadMenu();
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
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Content>
          <RouteManager />
        </Content>
      </Layout>
    </Layout>
  );
}
