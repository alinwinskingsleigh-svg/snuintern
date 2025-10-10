import React, { useState } from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="input-field">
      <label>{label}</label>
      <div className="input-wrapper">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-box"
        />
        {isPassword && (
          <span className="eye" onClick={() => setShow(!show)}>
            {show ? "👁️" : "🙈"}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
