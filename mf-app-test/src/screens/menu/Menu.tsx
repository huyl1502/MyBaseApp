import { useEffect, useState } from "react";
import { Button, Flex, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { menuApi } from "../../api/menuApi";
import type { MenuModel } from "../../models/menu";
import MenuList from "./MenuList";
import MenuFormModal, { type ModalMode } from "./MenuFormModal";

const { Title, Text } = Typography;

export default function Menu() {
  const [data, setData] = useState<MenuModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingRecord, setEditingRecord] = useState<MenuModel | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await menuApi.getAll();
      setData(res);
    } catch {
      message.error("Không thể tải danh sách menu");
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

  // ── Handlers ────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingRecord(null);
    setModalMode("add");
  };

  const handleOpenEdit = (record: MenuModel) => {
    setEditingRecord(record);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingRecord(null);
  };

  const handleSubmit = async (values: MenuModel) => {
    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await menuApi.insert(values);
        message.success("Thêm menu thành công");
      } else {
        await menuApi.update({ ...values, MenuId: editingRecord!.MenuId });
        message.success("Cập nhật menu thành công");
      }
      handleCloseModal();
      fetchAll();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: MenuModel) => {
    try {
      await menuApi.delete(record.MenuId);
      message.success("Xoá menu thành công");
      fetchAll();
    } catch {
      message.error("Xoá menu thất bại");
    }
  };

  // ── Render ───────────────────────────────────────────────
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
          <div>
            <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>
              Quản lý Menu
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Tổng cộng{" "}
              <Text strong style={{ color: "#6366f1" }}>
                {data.length}
              </Text>{" "}
              menu trong hệ thống
            </Text>
          </div>
        </Flex>
        <Button
          id="btn-add-menu"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAdd}
        >
          Thêm Menu
        </Button>
      </Flex>

      {/* Danh sách */}
      <MenuList
        data={data}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onRefresh={fetchAll}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Modal thêm / sửa */}
      <MenuFormModal
        mode={modalMode}
        initialValues={editingRecord}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
