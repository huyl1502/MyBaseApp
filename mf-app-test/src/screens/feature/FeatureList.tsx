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
import type { FeatureModel } from "../../models/feature";

const { Text } = Typography;

interface FeatureListProps {
  data: FeatureModel[];
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => Promise<void> | void;
  onEdit: (record: FeatureModel) => void;
  onDelete: (record: FeatureModel) => void;
}

export default function FeatureList({
  data,
  loading,
  search,
  onSearchChange,
  onRefresh,
  onEdit,
  onDelete,
}: FeatureListProps) {
  const columns: TableColumnsType<FeatureModel> = [
    {
      title: "Feature ID",
      dataIndex: "FeatureId",
      key: "FeatureId",
      width: 200,
      render: (val: string) => (
        <Text code style={{ fontSize: 12 }}>
          {val}
        </Text>
      ),
    },
    {
      title: "Tên Feature",
      dataIndex: "FeatureName",
      key: "FeatureName",
      sorter: (a, b) => a.FeatureName.localeCompare(b.FeatureName),
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
            id={`btn-edit-${record.FeatureId}`}
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá Feature"
            description={
              <>
                Bạn có chắc muốn xoá <strong>"{record.FeatureName}"</strong>?
              </>
            }
            onConfirm={() => onDelete(record)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <Button
              id={`btn-delete-${record.FeatureId}`}
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
    (f) =>
      f.FeatureName?.toLowerCase().includes(search.toLowerCase()) ||
      f.FeatureId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Flex gap={10} style={{ marginBottom: 14 }} wrap>
        <Input.Search
          id="feature-search"
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

      <Table<FeatureModel>
        rowKey="FeatureId"
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
