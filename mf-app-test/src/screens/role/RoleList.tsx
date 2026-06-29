import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Flex,
  Typography,
  Popconfirm,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import AsyncButton from "../../components/AsyncButton";
import type { RoleModel } from "../../models/role";

const { Text } = Typography;

interface RoleListProps {
  data: RoleModel[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => Promise<void> | void;
  onEdit: (record: RoleModel) => void;
  onDelete: (record: RoleModel) => void;
}

export default function RoleList({
  data,
  loading,
  search,
  onSearchChange,
  onRefresh,
  onEdit,
  onDelete,
}: RoleListProps) {
  const columns: TableColumnsType<RoleModel> = [
    {
      title: "Role ID",
      dataIndex: "RoleId",
      key: "RoleId",
      width: 200,
      render: (val: string) => (
        <Text code style={{ fontSize: 12 }}>
          {val}
        </Text>
      ),
    },
    {
      title: "Tên Role",
      dataIndex: "RoleName",
      key: "RoleName",
      sorter: (a, b) => a.RoleName.localeCompare(b.RoleName),
      render: (val: string) => <Text strong>{val}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "Enabled",
      key: "Enabled",
      width: 150,
      align: "center",
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Tắt", value: false },
      ],
      onFilter: (value, record) => record.Enabled === value,
      render: (val: boolean) =>
        val ? (
          <Tag color="success">
            Hoạt động
          </Tag>
        ) : (
          <Tag color="default">
            Tắt
          </Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={6}>
          <Button
            id={`btn-edit-${record.RoleId}`}
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá Role"
            description={
              <>
                Bạn có chắc muốn xoá <strong>"{record.RoleName}"</strong>?
              </>
            }
            onConfirm={() => onDelete(record)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              id={`btn-delete-${record.RoleId}`}
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(
    (r) =>
      r.RoleName?.toLowerCase().includes(search.toLowerCase()) ||
      r.RoleId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Flex gap={10} style={{ marginBottom: 14 }} wrap>
        <Input.Search
          id="role-search"
          placeholder="Tìm kiếm theo tên, ID..."
          allowClear
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onSearch={onSearchChange}
          style={{ maxWidth: 360 }}
        />
        <AsyncButton
          id="btn-refresh"
          icon={<ReloadOutlined />}
          onClick={async () => {
            await onRefresh();
          }}
          loadingText="Đang tải..."
        >
          Làm mới
        </AsyncButton>
      </Flex>

      <Table<RoleModel>
        rowKey="RoleId"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        size="middle"
        scroll={{ x: 800 }}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} kết quả`,
        }}
      />
    </>
  );
}
