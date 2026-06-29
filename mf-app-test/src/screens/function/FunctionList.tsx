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
import type { FunctionModel } from "../../models/function";

const { Text } = Typography;

interface FunctionListProps {
  data: FunctionModel[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => Promise<void> | void;
  onEdit: (record: FunctionModel) => void;
  onDelete: (record: FunctionModel) => void;
}

export default function FunctionList({
  data,
  loading,
  search,
  onSearchChange,
  onRefresh,
  onEdit,
  onDelete,
}: FunctionListProps) {
  const columns: TableColumnsType<FunctionModel> = [
    {
      title: "Function ID",
      dataIndex: "FunctionId",
      key: "FunctionId",
      width: 240,
      render: (val: string) => (
        <Text code style={{ fontSize: 12 }}>
          {val}
        </Text>
      ),
    },
    {
      title: "Tên Function",
      dataIndex: "FunctionName",
      key: "FunctionName",
      sorter: (a, b) => a.FunctionName.localeCompare(b.FunctionName),
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
            id={`btn-edit-${record.FunctionId}`}
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá Function"
            description={
              <>
                Bạn có chắc muốn xoá <strong>"{record.FunctionName}"</strong>?
              </>
            }
            onConfirm={() => onDelete(record)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              id={`btn-delete-${record.FunctionId}`}
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

  // Hàm filter đệ quy cho cây dữ liệu
  const filterTree = (nodes: FunctionModel[], q: string): FunctionModel[] => {
    return nodes
      .map((node) => ({ ...node }))
      .filter((node) => {
        const matchesCurrent =
          node.FunctionName?.toLowerCase().includes(q.toLowerCase()) ||
          node.FunctionId?.toLowerCase().includes(q.toLowerCase());

        if (node.Children && node.Children.length > 0) {
          const filteredChildren = filterTree(node.Children, q);
          node.Children = filteredChildren.length > 0 ? filteredChildren : undefined;
          return matchesCurrent || filteredChildren.length > 0;
        }

        return matchesCurrent;
      });
  };

  const filteredData = search ? filterTree(data, search) : data;

  return (
    <>
      <Flex gap={10} style={{ marginBottom: 14 }} wrap>
        <Input.Search
          id="function-search"
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

      <Table<FunctionModel>
        rowKey="FunctionId"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        size="middle"
        scroll={{ x: 800 }}
        expandable={{ childrenColumnName: "Children" }}
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
