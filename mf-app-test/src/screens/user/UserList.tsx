import {
  Table,
  Button,
  Space,
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
import type { UserModel } from "../../models/user";

const { Text } = Typography;

interface UserListProps {
  data: UserModel[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => Promise<void> | void;
  onEdit: (record: UserModel) => void;
  onDelete: (record: UserModel) => void;
}

export default function UserList({
  data,
  loading,
  search,
  onSearchChange,
  onRefresh,
  onEdit,
  onDelete,
}: UserListProps) {
  const columns: TableColumnsType<UserModel> = [
    {
      title: "Mã số (ID)",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (val: number) => (
        <Text style={{ fontSize: 13 }}>
          {val}
        </Text>
      ),
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 180,
      render: (val: string) => (
        <Text code style={{ fontSize: 13 }}>
          {val}
        </Text>
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => (a.userName || "").localeCompare(b.userName || ""),
      render: (val: string) => <Text strong>{val || "—"}</Text>,
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
      width: 120,
      align: "center",
      sorter: (a, b) => (a.age ?? 0) - (b.age ?? 0),
      render: (val: number) => <Text>{val ?? 0}</Text>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={6}>
          <Button
            id={`btn-edit-${record.userId}`}
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá người dùng"
            description={
              <>
                Bạn có chắc muốn xoá <strong>"{record.userName || record.userId}"</strong>?
              </>
            }
            onConfirm={() => onDelete(record)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              id={`btn-delete-${record.userId}`}
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

  const filteredData = data.filter((item) => {
    const term = search.toLowerCase();
    return (
      (item.userId || "").toLowerCase().includes(term) ||
      (item.userName || "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: 16 }}
        wrap
        gap={12}
      >
        <Input.Search
          id="search-user"
          placeholder="Tìm kiếm User ID, Tên..."
          allowClear
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 280 }}
        />
        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
          Làm mới
        </Button>
      </Flex>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `Tổng cộng ${total} dòng`,
        }}
        scroll={{ x: 600 }}
      />
    </>
  );
}
