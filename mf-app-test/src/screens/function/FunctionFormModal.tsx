import { useEffect } from "react";
import { Modal, Form, Input, Switch } from "antd";
import type { FunctionModel } from "../../models/function";

export type ModalMode = "add" | "edit" | null;

interface FunctionFormModalProps {
  mode: ModalMode;
  initialValues?: FunctionModel | null;
  submitting: boolean;
  onSubmit: (values: FunctionModel) => void;
  onCancel: () => void;
}

export default function FunctionFormModal({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: FunctionFormModalProps) {
  const [form] = Form.useForm<FunctionModel>();

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
          {mode === "add" ? "Thêm Function mới" : "Chỉnh sửa Function"}
        </span>
      }
      open={!!mode}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={submitting ? "Đang lưu..." : (mode === "add" ? "Thêm Function" : "Lưu thay đổi")}
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
          label="Function ID"
          name="FunctionId"
          rules={[{ required: true, message: "Vui lòng nhập Function ID" }]}
        >
          <Input
            id="field-functionId"
            placeholder="Nhập Function ID"
            disabled={mode === "edit"}
          />
        </Form.Item>

        <Form.Item
          label="Tên Function"
          name="FunctionName"
          rules={[{ required: true, message: "Vui lòng nhập tên Function" }]}
        >
          <Input id="field-functionName" placeholder="Nhập tên Function" />
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
