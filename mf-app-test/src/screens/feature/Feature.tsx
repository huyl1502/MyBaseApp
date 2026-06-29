import { useEffect, useState } from "react";
import { Button, Flex, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { featureApi } from "../../api/featureApi";
import type { FeatureModel } from "../../models/feature";
import FeatureList from "./FeatureList";
import FeatureFormModal, { type ModalMode } from "./FeatureFormModal";

const { Title, Text } = Typography;

export default function Feature() {
  const [data, setData] = useState<FeatureModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingRecord, setEditingRecord] = useState<FeatureModel | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await featureApi.getAll();
      setData(res);
    } catch {
      message.error("Không thể tải danh sách feature");
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

  const handleOpenEdit = (record: FeatureModel) => {
    setEditingRecord(record);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingRecord(null);
  };

  const handleSubmit = async (values: FeatureModel) => {
    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await featureApi.insert(values);
        message.success("Thêm feature thành công");
      } else {
        await featureApi.update({ ...values, FeatureId: editingRecord!.FeatureId });
        message.success("Cập nhật feature thành công");
      }
      handleCloseModal();
      fetchAll();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: FeatureModel) => {
    try {
      await featureApi.delete(record.FeatureId);
      message.success("Xoá feature thành công");
      fetchAll();
    } catch {
      message.error("Xoá feature thất bại");
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
              Quản lý Feature
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Tổng cộng{" "}
              <Text strong style={{ color: "#6366f1" }}>
                {data.length}
              </Text>{" "}
              feature trong hệ thống
            </Text>
          </div>
        </Flex>
        <Button
          id="btn-add-feature"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenAdd}
        >
          Thêm Feature
        </Button>
      </Flex>

      <FeatureList
        data={data}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onRefresh={fetchAll}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <FeatureFormModal
        mode={modalMode}
        initialValues={editingRecord}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
