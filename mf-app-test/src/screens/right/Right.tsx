import { useEffect, useState } from "react";
import {
  Table,
  Checkbox,
  Select,
  Typography,
  Card,
  Flex,
  Spin,
  message,
  Input,
  Tag,
  Button,
} from "antd";
import type { TableColumnsType } from "antd";
import { ReloadOutlined, LockOutlined } from "@ant-design/icons";
import { roleApi } from "../../api/roleApi";
import { featureApi } from "../../api/featureApi";
import { functionApi } from "../../api/functionApi";
import { rightApi } from "../../api/rightApi";
import type { RoleModel } from "../../models/role";
import type { FeatureModel } from "../../models/feature";
import type { FunctionModel } from "../../models/function";
import type { RightModel } from "../../models/right";

const { Title, Text } = Typography;

export default function Right() {
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [features, setFeatures] = useState<FeatureModel[]>([]);
  const [functions, setFunctions] = useState<FunctionModel[]>([]);
  const [rights, setRights] = useState<RightModel[]>([]);

  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [searchFeature, setSearchFeature] = useState("");
  const [updatingCells, setUpdatingCells] = useState<Record<string, boolean>>({});

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, featuresRes, functionsRes, rightsRes] = await Promise.all([
        roleApi.getAll(),
        featureApi.getAll(),
        functionApi.getAll(),
        rightApi.getAll(),
      ]);

      // Only display active roles/features/functions if they have Enabled property
      setRoles(rolesRes.filter((r) => r.Enabled !== false));
      setFeatures(featuresRes.filter((f) => f.Enabled !== false));
      setFunctions(functionsRes.filter((fn) => fn.Enabled !== false));
      setRights(rightsRes);

      // Default to first role if none selected yet
      const activeRoles = rolesRes.filter((r) => r.Enabled !== false);
      if (activeRoles.length > 0 && !selectedRoleId) {
        setSelectedRoleId(activeRoles[0].RoleId);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể tải dữ liệu cấu hình phân quyền");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch rights only (useful for light-weight sync after checkbox toggles)
  const fetchRights = async () => {
    try {
      const rightsRes = await rightApi.getAll();
      setRights(rightsRes);
    } catch (error) {
      console.error("Lỗi đồng bộ danh sách quyền:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = async (
    featureId: string,
    functionId: string,
    checked: boolean,
    existingRightId?: string
  ) => {
    if (!selectedRoleId) {
      message.warning("Vui lòng chọn một vai trò (Role) trước");
      return;
    }

    const cellKey = `${featureId}-${functionId}`;
    setUpdatingCells((prev) => ({ ...prev, [cellKey]: true }));

    try {
      if (checked) {
        // Grant permission (insert Right)
        const success = await rightApi.insert({
          RoleId: selectedRoleId,
          FeatureId: featureId,
          FunctionId: functionId,
        });
        if (success) {
          message.success("Đã cấp quyền thành công");
        } else {
          message.error("Cấp quyền thất bại");
        }
      } else {
        // Revoke permission (delete Right)
        if (existingRightId) {
          const success = await rightApi.delete(existingRightId);
          if (success) {
            message.success("Đã thu hồi quyền thành công");
          } else {
            message.error("Thu hồi quyền thất bại");
          }
        } else {
          message.error("Không tìm thấy thông tin định danh quyền hạn để thu hồi");
        }
      }
      // Re-fetch rights to update UI states with correct Right IDs
      await fetchRights();
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra trong quá trình cập nhật phân quyền");
    } finally {
      setUpdatingCells((prev) => ({ ...prev, [cellKey]: false }));
    }
  };

  // Filter features based on search query
  const filteredFeatures = features.filter(
    (f) =>
      f.FeatureName.toLowerCase().includes(searchFeature.toLowerCase()) ||
      f.FeatureId.toLowerCase().includes(searchFeature.toLowerCase())
  );

  // Columns definition for the matrix table
  const columns: TableColumnsType<FeatureModel> = [
    {
      title: "Feature \\ Function",
      dataIndex: "FeatureName",
      key: "FeatureName",
      width: 250,
      fixed: "left",
      render: (text: string, record: FeatureModel) => (
        <div>
          <Text strong style={{ color: "#1e1b4b" }}>
            {text}
          </Text>
          <div style={{ fontSize: "11px" }}>
            <Text type="secondary">{record.FeatureId}</Text>
          </div>
        </div>
      ),
    },
    // Generate function columns dynamically
    ...functions.map((fn) => ({
      title: (
        <div style={{ textAlign: "center" }}>
          <div>{fn.FunctionName}</div>
          <Tag color="cyan" style={{ fontSize: "10px", margin: 0, scale: "0.85" }}>
            {fn.FunctionId}
          </Tag>
        </div>
      ),
      key: fn.FunctionId,
      width: 130,
      align: "center" as const,
      render: (_: any, featureRecord: FeatureModel) => {
        // Find existing right mapping for selected Role, current Feature and Function
        const right = rights.find(
          (r) =>
            r.RoleId === selectedRoleId &&
            r.FeatureId === featureRecord.FeatureId &&
            r.FunctionId === fn.FunctionId
        );
        const isChecked = !!right;
        const cellKey = `${featureRecord.FeatureId}-${fn.FunctionId}`;
        const isCellUpdating = !!updatingCells[cellKey];

        return (
          <Spin spinning={isCellUpdating} size="small">
            <Checkbox
              checked={isChecked}
              disabled={!selectedRoleId}
              onChange={(e) =>
                handleCheckboxChange(
                  featureRecord.FeatureId,
                  fn.FunctionId,
                  e.target.checked,
                  right?.RightId
                )
              }
            />
          </Spin>
        );
      },
    })),
  ];

  // Count active rights for selected role
  const selectedRoleRightsCount = rights.filter((r) => r.RoleId === selectedRoleId).length;

  return (
    <div className="page-container">
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: 20 }}
        wrap
        gap={12}
      >
        <Flex align="center" gap={12}>
          <LockOutlined style={{ fontSize: 24, color: "#6366f1" }} />
          <div>
            <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>
              Ma Trận Phân Quyền
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Cấu hình chức năng chi tiết cho từng vai trò trong hệ thống
            </Text>
          </div>
        </Flex>

        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
          Làm mới
        </Button>
      </Flex>

      {/* Select Role and Search bar Card */}
      <Card
        style={{
          marginBottom: 16,
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px -1px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: "16px 20px" }}
      >
        <Flex gap={20} wrap align="center">
          <Flex align="center" gap={8} style={{ minWidth: 280 }}>
            <span style={{ fontWeight: 600 }}>Chọn Vai Trò (Role):</span>
            <Select
              id="role-select"
              style={{ width: 220 }}
              placeholder="Chọn vai trò"
              value={selectedRoleId}
              onChange={(val) => setSelectedRoleId(val)}
              loading={loading}
              options={roles.map((r) => ({
                label: r.RoleName,
                value: r.RoleId,
              }))}
            />
          </Flex>

          <Flex align="center" gap={8} style={{ flexGrow: 1, maxWidth: 400 }}>
            <span style={{ fontWeight: 600 }}>Tìm Feature:</span>
            <Input.Search
              id="feature-search"
              placeholder="Tìm kiếm feature..."
              allowClear
              value={searchFeature}
              onChange={(e) => setSearchFeature(e.target.value)}
            />
          </Flex>

          {selectedRoleId && (
            <Tag color="purple" style={{ padding: "4px 10px", fontSize: "13px" }}>
              Vai trò hiện tại đang có <strong>{selectedRoleRightsCount}</strong> quyền được cấp
            </Tag>
          )}
        </Flex>
      </Card>

      {/* Permission Matrix Table */}
      <Card
        style={{
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px -1px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table<FeatureModel>
          rowKey="FeatureId"
          columns={columns}
          dataSource={filteredFeatures}
          loading={loading}
          size="middle"
          scroll={{ x: "max-content", y: "calc(100vh - 350px)" }}
          pagination={false}
          bordered
          className="excel-matrix-table"
        />
      </Card>
    </div>
  );
}
