import { useEffect } from "react";
import { Modal, Form, Input, Switch } from "antd";
import type { RoleModel } from "../../models/role";

export type ModalMode = "add" | "edit" | null;

interface RoleFormModalProps {
  mode: ModalMode;
  initialValues?: RoleModel | null;
  submitting: boolean;
  onSubmit: (values: RoleModel) => void;
  onCancel: () => void;
}

export default function RoleFormModal({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: RoleFormModalProps) {
  const [form] = Form.useForm<RoleModel>();

  useEffect(() => {
    if (mode === "add") {
      form.resetFields();
      form.setFieldsValue({ Enabled: true });
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
          {mode === "add" ? "Thêm Role mới" : "Chỉnh sửa Role"}
        </span>
      }
      open={!!mode}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={submitting ? "Đang lưu..." : (mode === "add" ? "Thêm Role" : "Lưu thay đổi")}
      cancelText="Huỷ"
      confirmLoading={submitting}
      okButtonProps={{ id: "btn-submit-modal" }}
      cancelButtonProps={{ id: "btn-cancel-modal", disabled: submitting }}
      width={560}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        requiredMark="optional"
      >
        <Form.Item
          label="Role ID"
          name="RoleId"
          rules={[{ required: true, message: "Vui lòng nhập Role ID" }]}
        >
          <Input
            id="field-roleId"
            placeholder="Nhập Role ID"
            disabled={mode === "edit"}
          />
        </Form.Item>

        <Form.Item
          label="Tên Role"
          name="RoleName"
          rules={[{ required: true, message: "Vui lòng nhập tên Role" }]}
        >
          <Input id="field-roleName" placeholder="Nhập tên Role" />
        </Form.Item>

        <Form.Item label="Hoạt động" name="Enabled" valuePropName="checked">
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
