import { useEffect, useState } from "react";
import { Button, Flex, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { functionApi } from "../../api/functionApi";
import type { FunctionModel } from "../../models/function";
import FunctionList from "./FunctionList";
import FunctionFormModal, { type ModalMode } from "./FunctionFormModal";

const { Title, Text } = Typography;

export default function Function() {
  const [data, setData] = useState<FunctionModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingRecord, setEditingRecord] = useState<FunctionModel | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await functionApi.getAll();
      setData(res);
    } catch {
      message.error("Không thể tải danh sách function");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.resolve();
      fetchAll();
    };
    init();
  }, []);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setModalMode("add");
  };

  const handleOpenEdit = (record: FunctionModel) => {
    setEditingRecord(record);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingRecord(null);
  };

  const handleSubmit = async (values: FunctionModel) => {
    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await functionApi.insert(values);
        message.success("Thêm function thành công");
      } else {
        await functionApi.update({ ...values, FunctionId: editingRecord!.FunctionId });
        message.success("Cập nhật function thành công");
      }
      handleCloseModal();
      fetchAll();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: FunctionModel) => {
    try {
      await functionApi.delete(record.FunctionId);
      message.success("Xoá function thành công");
      fetchAll();
    } catch {
      message.error("Xoá function thất bại");
    }
  };

  return (
    <div className="page-container">
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: 20 }}
        wrap
        gap={12}
      >
        <Flex align="center" gap={12}>
          <div>
            <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>
              Quản lý Function
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Tổng cộng{" "}
              <Text strong style={{ color: "#6366f1" }}>
                {data.length}
              </Text>{" "}
              nhóm chức năng chính trong hệ thống
            </Text>
          </div>
        </Flex>
        <Button
          id="btn-add-function"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAdd}
        >
          Thêm Function
        </Button>
      </Flex>

      <FunctionList
        data={data}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onRefresh={fetchAll}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <FunctionFormModal
        mode={modalMode}
        initialValues={editingRecord}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
