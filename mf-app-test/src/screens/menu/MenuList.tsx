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
import type { MenuModel } from "../../models/menu";

const { Text } = Typography;

interface MenuListProps {
  data: MenuModel[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => Promise<void> | void;
  onEdit: (record: MenuModel) => void;
  onDelete: (record: MenuModel) => void;
}

export default function MenuList({
  data,
  loading,
  search,
  onSearchChange,
  onRefresh,
  onEdit,
  onDelete,
}: MenuListProps) {
  const columns: TableColumnsType<MenuModel> = [
    {
      title: "Menu ID",
      dataIndex: "MenuId",
      key: "MenuId",
      width: 160,
      render: (val: string) => (
        <Text code style={{ fontSize: 12 }}>
          {val}
        </Text>
      ),
    },
    {
      title: "Tên Menu",
      dataIndex: "MenuName",
      key: "MenuName",
      sorter: (a, b) => a.MenuName.localeCompare(b.MenuName),
      render: (val: string) => <Text strong>{val}</Text>,
    },
    {
      title: "Icon",
      dataIndex: "Icon",
      key: "Icon",
      width: 120,
      render: (val: string) =>
        val ? (
          <Tag color="orange">
            {val}
          </Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "URL",
      dataIndex: "Url",
      key: "Url",
      render: (val: string) =>
        val ? (
          <Text code style={{ fontSize: 12 }}>
            {val}
          </Text>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Thứ tự",
      dataIndex: "OrderIndex",
      key: "OrderIndex",
      width: 90,
      align: "center",
      sorter: (a, b) => (a.OrderIndex ?? 0) - (b.OrderIndex ?? 0),
      render: (val: number) => (
        <Tag
          color="blue"
          style={{ minWidth: 30, textAlign: "center" }}
        >
          {val ?? 0}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "Enabled",
      key: "Enabled",
      width: 130,
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
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={6}>
          <Button
            id={`btn-edit-${record.MenuId}`}
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá menu"
            description={
              <>
                Bạn có chắc muốn xoá <strong>"{record.MenuName}"</strong>?
              </>
            }
            onConfirm={() => onDelete(record)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              id={`btn-delete-${record.MenuId}`}
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
    (m) =>
      m.MenuName?.toLowerCase().includes(search.toLowerCase()) ||
      m.MenuId?.toLowerCase().includes(search.toLowerCase()) ||
      (m.Url ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Toolbar */}
      <Flex gap={10} style={{ marginBottom: 14 }} wrap>
        <Input.Search
          id="menu-search"
          placeholder="Tìm kiếm theo tên, ID, URL..."
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
            // Bao bọc thành Promise để AsyncButton tự bắt loading
            await onRefresh();
          }}
          loadingText="Đang tải..."
        >
          Làm mới
        </AsyncButton>
      </Flex>

      {/* Table */}
      <Table<MenuModel>
        rowKey="MenuId"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        size="middle"
        scroll={{ x: 900 }}
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
