import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import type { UserModel } from "../../models/user";

export type ModalMode = "add" | "edit" | null;

interface UserFormModalProps {
  mode: ModalMode;
  initialValues?: UserModel | null;
  submitting: boolean;
  onSubmit: (values: UserModel) => void;
  onCancel: () => void;
}

export default function UserFormModal({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: UserFormModalProps) {
  const [form] = Form.useForm<UserModel>();

  useEffect(() => {
    if (mode === "add") {
      form.resetFields();
      form.setFieldsValue({ age: 0 });
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
          {mode === "add" ? "Thêm Người dùng mới" : "Chỉnh sửa Người dùng"}
        </span>
      }
      open={!!mode}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={submitting ? "Đang lưu..." : (mode === "add" ? "Thêm User" : "Lưu thay đổi")}
      cancelText="Huỷ"
      confirmLoading={submitting}
      okButtonProps={{ id: "btn-submit-modal" }}
      cancelButtonProps={{ id: "btn-cancel-modal", disabled: submitting }}
      width={480}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        requiredMark="optional"
      >
        <Form.Item
          label="User ID"
          name="userId"
          rules={[{ required: true, message: "Vui lòng nhập User ID" }]}
        >
          <Input
            id="field-userId"
            placeholder="Nhập User ID"
            disabled={mode === "edit"}
          />
        </Form.Item>

        <Form.Item
          label="Tên người dùng"
          name="userName"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
        >
          <Input id="field-userName" placeholder="Nhập tên người dùng" />
        </Form.Item>

        <Form.Item
          label="Tuổi"
          name="age"
          rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}
        >
          <InputNumber
            id="field-age"
            min={0}
            style={{ width: "100%" }}
            placeholder="0"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
