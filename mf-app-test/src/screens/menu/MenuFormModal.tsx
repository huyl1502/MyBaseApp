import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
} from "antd";
import type { MenuModel } from "../../types/menu";

export type ModalMode = "add" | "edit" | null;

interface MenuFormModalProps {
  mode: ModalMode;
  initialValues?: MenuModel | null;
  submitting: boolean;
  onSubmit: (values: MenuModel) => void;
  onCancel: () => void;
}

export default function MenuFormModal({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: MenuFormModalProps) {
  const [form] = Form.useForm<MenuModel>();

  useEffect(() => {
    if (mode === "add") {
      form.resetFields();
      form.setFieldsValue({ isActive: true, orderIndex: 0 });
    } else if (mode === "edit" && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [mode, initialValues, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: 17, fontWeight: 700, color: "#1e1b4b" }}>
          {mode === "add" ? "Thêm Menu mới" : "Chỉnh sửa Menu"}
        </span>
      }
      open={!!mode}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={mode === "add" ? "Thêm Menu" : "Lưu thay đổi"}
      cancelText="Huỷ"
      confirmLoading={submitting}
      okButtonProps={{ id: "btn-submit-modal", className: "btn-gradient" }}
      cancelButtonProps={{ id: "btn-cancel-modal" }}
      width={560}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        requiredMark="optional"
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}
        >
          <Form.Item
            label="Menu ID"
            name="menuId"
            rules={[{ required: true, message: "Vui lòng nhập Menu ID" }]}
          >
            <Input
              id="field-menuId"
              placeholder="Nhập Menu ID"
              disabled={mode === "edit"}
            />
          </Form.Item>

          <Form.Item
            label="Tên Menu"
            name="menuName"
            rules={[{ required: true, message: "Vui lòng nhập tên menu" }]}
          >
            <Input id="field-menuName" placeholder="Nhập tên menu" />
          </Form.Item>

          <Form.Item label="Icon" name="icon">
            <Input id="field-icon" placeholder="VD: home, settings..." />
          </Form.Item>

          <Form.Item label="URL" name="url">
            <Input id="field-url" placeholder="VD: /dashboard" />
          </Form.Item>

          <Form.Item label="Parent ID" name="parentId">
            <Input id="field-parentId" placeholder="ID menu cha (nếu có)" />
          </Form.Item>

          <Form.Item label="Thứ tự" name="orderIndex">
            <InputNumber
              id="field-orderIndex"
              min={0}
              style={{ width: "100%" }}
              placeholder="0"
            />
          </Form.Item>
        </div>

        <Form.Item label="Hoạt động" name="isActive" valuePropName="checked">
          <Switch
            id="toggle-isActive"
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
