import { useEffect, useState } from "react";
import { Button, Flex, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { roleApi } from "../../api/roleApi";
import type { RoleModel } from "../../models/role";
import RoleList from "./RoleList";
import RoleFormModal, { type ModalMode } from "./RoleFormModal";

const { Title, Text } = Typography;

export default function Role() {
  const [data, setData] = useState<RoleModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingRecord, setEditingRecord] = useState<RoleModel | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await roleApi.getAll();
      setData(res);
    } catch {
      message.error("Không thể tải danh sách role");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setModalMode("add");
  };

  const handleOpenEdit = (record: RoleModel) => {
    setEditingRecord(record);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingRecord(null);
  };

  const handleSubmit = async (values: RoleModel) => {
    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await roleApi.insert(values);
        message.success("Thêm role thành công");
      } else {
        await roleApi.update({ ...values, RoleId: editingRecord!.RoleId });
        message.success("Cập nhật role thành công");
      }
      handleCloseModal();
      fetchAll();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: RoleModel) => {
    try {
      await roleApi.delete(record.RoleId);
      message.success("Xoá role thành công");
      fetchAll();
    } catch {
      message.error("Xoá role thất bại");
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
              Quản lý Role
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Tổng cộng{" "}
              <Text strong style={{ color: "#6366f1" }}>
                {data.length}
              </Text>{" "}
              role trong hệ thống
            </Text>
          </div>
        </Flex>
        <Button
          id="btn-add-role"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAdd}
        >
          Thêm Role
        </Button>
      </Flex>

      <RoleList
        data={data}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onRefresh={fetchAll}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <RoleFormModal
        mode={modalMode}
        initialValues={editingRecord}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
