import { useEffect, useState } from "react";
import { Modal, Transfer, Spin, message } from "antd";
import { userApi } from "../../api/userApi";
import { roleApi } from "../../api/roleApi";
import type { RoleModel } from "../../models/role";
import type { UserModel } from "../../models/user";

interface RoleUserMapModalProps {
  visible: boolean;
  role: RoleModel | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function RoleUserMapModal({
  visible,
  role,
  onCancel,
  onSuccess,
}: RoleUserMapModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [initialTargetKeys, setInitialTargetKeys] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Yield to the next microtask to avoid synchronous setState inside useEffect body
      await Promise.resolve();
      if (visible && role) {
        setLoading(true);
        try {
          const [allUsers, mappedUserIds] = await Promise.all([
            userApi.getAll(),
            roleApi.getUserIdsByRoleId(role.RoleId),
          ]);
          setUsers(allUsers);
          const mappedIds = (mappedUserIds || []).map(String);
          setTargetKeys(mappedIds);
          setInitialTargetKeys(mappedIds);
        } catch (error) {
          console.error(error);
          message.error("Không thể tải danh sách người dùng");
        } finally {
          setLoading(false);
        }
      } else {
        setUsers([]);
        setTargetKeys([]);
        setInitialTargetKeys([]);
      }
    };
    loadData();
  }, [visible, role]);

  const handleSave = async () => {
    if (!role) return;
    setSubmitting(true);
    try {
      const added = targetKeys.filter((key) => !initialTargetKeys.includes(key));
      const removed = initialTargetKeys.filter((key) => !targetKeys.includes(key));

      const mapPromises = added.map((userId) =>
        roleApi.mapUserToRole(userId, role.RoleId)
      );
      const unmapPromises = removed.map((userId) =>
        roleApi.removeUserFromRole(userId, role.RoleId)
      );

      await Promise.all([...mapPromises, ...unmapPromises]);
      message.success("Cập nhật phân vai trò cho user thành công");
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra trong quá trình cập nhật");
    } finally {
      setSubmitting(false);
    }
  };

  const transferDataSource = users.map((u) => ({
    key: u.userId,
    title: u.userName || u.userId,
    description: u.age ? `${u.age} tuổi` : "",
  }));

  return (
    <Modal
      title={
        <span style={{ fontSize: 17, fontWeight: 700, color: "#1e1b4b" }}>
          Gán User vào Role: <span style={{ color: "#6366f1" }}>{role?.RoleName}</span>
        </span>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText={submitting ? "Đang lưu..." : "Lưu thay đổi"}
      cancelText="Huỷ"
      confirmLoading={submitting}
      okButtonProps={{ id: "btn-submit-map-modal", disabled: loading }}
      cancelButtonProps={{ id: "btn-cancel-map-modal", disabled: submitting }}
      width={700}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <Transfer
            dataSource={transferDataSource}
            targetKeys={targetKeys}
            onChange={(nextTargetKeys) => setTargetKeys(nextTargetKeys as string[])}
            render={(item) => (
              <span>
                <strong>{item.title}</strong>
                {item.description && (
                  <span style={{ color: "#9ca3af", marginLeft: 8, fontSize: 12 }}>
                    ({item.description})
                  </span>
                )}
              </span>
            )}
            showSearch
            filterOption={(inputValue, option) =>
              option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
              option.key.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
            }
            listStyle={{
              width: 300,
              height: 400,
            }}
            operations={["Thêm", "Xoá"]}
            titles={["Tất cả User", "Đang gán"]}
            locale={{
              searchPlaceholder: "Tìm theo tên hoặc ID...",
              itemUnit: "user",
              itemsUnit: "user",
            }}
          />
        </div>
      </Spin>
    </Modal>
  );
}
