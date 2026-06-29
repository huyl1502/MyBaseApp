import { useEffect } from "react";
import { Modal, Form, Input, Switch } from "antd";
import type { FeatureModel } from "../../models/feature";

export type ModalMode = "add" | "edit" | null;

interface FeatureFormModalProps {
  mode: ModalMode;
  initialValues?: FeatureModel | null;
  submitting: boolean;
  onSubmit: (values: FeatureModel) => void;
  onCancel: () => void;
}

export default function FeatureFormModal({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: FeatureFormModalProps) {
  const [form] = Form.useForm<FeatureModel>();

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
          {mode === "add" ? "Thêm Feature mới" : "Chỉnh sửa Feature"}
        </span>
      }
      open={!!mode}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={submitting ? "Đang lưu..." : (mode === "add" ? "Thêm Feature" : "Lưu thay đổi")}
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
          label="Feature ID"
          name="FeatureId"
          rules={[{ required: true, message: "Vui lòng nhập Feature ID" }]}
        >
          <Input
            id="field-featureId"
            placeholder="Nhập Feature ID"
            disabled={mode === "edit"}
          />
        </Form.Item>

        <Form.Item
          label="Tên Feature"
          name="FeatureName"
          rules={[{ required: true, message: "Vui lòng nhập tên Feature" }]}
        >
          <Input id="field-featureName" placeholder="Nhập tên Feature" />
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
