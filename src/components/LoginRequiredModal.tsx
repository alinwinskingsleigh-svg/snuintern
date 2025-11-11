// src/components/LoginRequiredModal.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface LoginRequiredModalProps {
  onClose: () => void;
}

/**
 * 찜하기 시 로그인 유도가 필요한 경우에 나타나는 모달 (스펙)
 */
const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  // TODO: CSS 파일이 없으므로 인라인 스타일로 임시 적용
  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "400px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 20px",
    margin: "5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>찜하기를 하려면 로그인이 필요해요</h3>
        <p>계정이 없으시다면 지금 바로 회원가입해보세요</p>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{ ...buttonStyle, backgroundColor: "#333", color: "white" }}
          >
            로그인하기
          </button>
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              backgroundColor: "#f0f0f0",
              color: "#333",
            }}
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
