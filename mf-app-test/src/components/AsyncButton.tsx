import { useState } from "react";
import { Button, type ButtonProps } from "antd";

export interface AsyncButtonProps extends Omit<ButtonProps, "onClick" | "loading"> {
  /** Hàm onClick bắt buộc trả về Promise để AsyncButton tự bắt trạng thái loading */
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<unknown>;
  /** Dòng chữ sẽ hiển thị khi nút đang ở trạng thái loading (tuỳ chọn) */
  loadingText?: string;
}

export default function AsyncButton({
  onClick,
  loadingText,
  children,
  ...props
}: AsyncButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setInternalLoading(true);
    try {
      await onClick(e);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Button {...props} loading={internalLoading} onClick={handleClick}>
      {internalLoading && loadingText ? loadingText : children}
    </Button>
  );
}
