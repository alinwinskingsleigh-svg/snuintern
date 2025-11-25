import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { getMe, putMe } from "../api/applicant";


interface ProfileFormProps {
  token: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ token }) => {
  const [enrollYear, setEnrollYear] = useState("");
  const [departments, setDepartments] = useState<string[]>([""]); // 첫 칸 주전공
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 기존 프로필 불러오기
    getMe(token)
      .then((data) => {
        setEnrollYear(String(data.enrollYear).slice(2)); // 2021 -> "21"
        setDepartments(data.department.split(","));
      })
      .catch((err: unknown) => {
        const axiosErr = err as AxiosError<{ code: string }>;

        if (axiosErr.response?.data?.code === "APPLICANT_002") {
          // 프로필 없음
          setDepartments([""]);
        } else console.error(err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleDepartmentChange = (index: number, value: string) => {
    const newDeps = [...departments];
    newDeps[index] = value;
    setDepartments(newDeps);
  };

  const addDepartment = () => {
    if (departments.length < 7) setDepartments([...departments, ""]);
  };

  const removeDepartment = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      setCvFile(file);
    } else {
      alert("PDF 파일만 5MB 이하로 업로드 가능합니다.");
    }
  };

  const handleSubmit = async () => {
    if (!/^\d{2}$/.test(enrollYear)) {
      alert("학번은 두 자리 숫자로 입력해주세요.");
      return;
    }
    if (!departments[0]) {
      alert("주전공은 필수입니다.");
      return;
    }
    const uniqueDeps = Array.from(new Set(departments.filter(Boolean)));
    const enrollFull = parseInt(enrollYear, 10) < 50 ? `20${enrollYear}` : `19${enrollYear}`;

    const cvKey = cvFile
      ? `static/private/CV/${Math.random().toString(36).slice(2, 12)}_20${new Date()
          .toISOString()
          .slice(2, 10)}/${cvFile.name}`
      : "";

    try {
      await putMe(token, {
        enrollYear: Number(enrollFull),
        department: uniqueDeps.join(","),
        cvKey,
      });
      alert("프로필 저장 완료!");
    } catch (err) {
      console.error(err);
      alert("저장 실패");
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="profile-form">
      <label>
        학번:{" "}
        <input
          type="text"
          value={enrollYear}
          onChange={(e) => setEnrollYear(e.target.value)}
          maxLength={2}
        />
      </label>

      <div>
        학과:
        {departments.map((dep, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={dep}
              onChange={(e) => handleDepartmentChange(idx, e.target.value)}
            />
            {idx > 0 && (
              <button onClick={() => removeDepartment(idx)}>삭제</button>
            )}
          </div>
        ))}
        {departments.length < 7 && <button onClick={addDepartment}>추가</button>}
      </div>

      <div>
        이력서:
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        {cvFile && <span>{cvFile.name}</span>}
        {cvFile && <button onClick={() => setCvFile(null)}>삭제</button>}
      </div>

      <button onClick={handleSubmit}>저장</button>
    </div>
  );
};

export default ProfileForm;
