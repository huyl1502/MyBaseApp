import { useEffect, useState } from "react";
import { Button, Flex, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { userApi } from "../../api/userApi";
import type { UserModel } from "../../models/user";
import UserList from "./UserList";
import UserFormModal, { type ModalMode } from "./UserFormModal";

const { Title, Text } = Typography;

export default function User() {
  const [data, setData] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingRecord, setEditingRecord] = useState<UserModel | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      setData(res);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách người dùng");
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

  const handleOpenEdit = (record: UserModel) => {
    setEditingRecord(record);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingRecord(null);
  };

  const handleSubmit = async (values: UserModel) => {
    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await userApi.insert(values);
        message.success("Thêm người dùng thành công");
      } else {
        await userApi.update({ ...values, id: editingRecord!.id, userId: editingRecord!.userId });
        message.success("Cập nhật người dùng thành công");
      }
      handleCloseModal();
      fetchAll();
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: UserModel) => {
    try {
      await userApi.delete(record.userId);
      message.success("Xoá người dùng thành công");
      fetchAll();
    } catch (err) {
      console.error(err);
      message.error("Xoá người dùng thất bại");
    }
  };

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
        <div>
          <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>
            Quản lý Người dùng
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Tổng cộng{" "}
            <Text strong style={{ color: "#6366f1" }}>
              {data.length}
            </Text>{" "}
            người dùng trong hệ thống
          </Text>
        </div>
        <Button
          id="btn-add-user"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAdd}
        >
          Thêm Người dùng
        </Button>
      </Flex>

      {/* Danh sách */}
      <UserList
        data={data}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onRefresh={fetchAll}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Modal thêm / sửa */}
      <UserFormModal
        mode={modalMode}
        initialValues={editingRecord}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
