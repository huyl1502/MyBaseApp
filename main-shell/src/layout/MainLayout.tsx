import {
  Layout,
  Menu,
  message,
  type MenuProps,
} from "antd";
import { useEffect, useState } from "react";
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await getMenus();

        setMenuItems(toMenuItems(res.data));
      } catch (err) {
        console.error("Load menu failed", err);
        message.error("Load menu failed");
      }
    };

    loadMenu();
  }, []);


  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          height: 50,
        }}
      >
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
