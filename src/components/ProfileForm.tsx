import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '../icons/UploadIcon';
import '../css/ProfileForm.css';
import { getMe, putMe } from '../api/applicant';

interface ProfileFormProps {
  token: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ token }) => {
  const navigate = useNavigate();

  // 상태 관리
  const [studentId, setStudentId] = useState<string>('');
  const [departments, setDepartments] = useState<string[]>(['']);
  const [cvFile, setCvFile] = useState<File | null>(null);

  // 에러 상태 관리
  const [errors, setErrors] = useState<{
    studentId?: string;
    departments?: string;
    cvFile?: string;
    cvFileType?: string;
  }>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMe(token);

        if (data) {
          if (data.enrollYear) {
            setStudentId(String(data.enrollYear).slice(-2));
          }

          if (data.department) {
            const savedDepartments = data.department.split(',');
            setDepartments(savedDepartments);
          }
        }
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchUserData();
  }, [token]);

  // 파일 선택 핸들러
// 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. 파일이 선택되었는지 확인
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCvFile(file);
      setErrors((prev) => ({ ...prev, cvFile: undefined }));
    }
  };

  // 학과 입력값 변경
  const handleDepartmentChange = (index: number, value: string) => {
    const newDepts = [...departments];
    newDepts[index] = value;
    setDepartments(newDepts);
    if (value.trim() !== '') {
      setErrors((prev) => ({ ...prev, departments: undefined }));
    }
  };

  // 학과 입력창 추가
  const handleAddDepartmentRow = () => {
    setDepartments([...departments, '']);
  };

  // 학과 입력창 삭제
  const handleRemoveDepartmentRow = (index: number) => {
    if (departments.length === 1) {
      handleDepartmentChange(index, '');
      return;
    }
    const newDepts = departments.filter((_, i) => i !== index);
    setDepartments(newDepts);
  };

  // 랜덤 문자열 생성
  const generateRandomString = (length: number) => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // 날짜 문자열 생성
  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // 유효성 검사 함수
  const validate = () => {
    const newErrors: {
      studentId?: string;
      departments?: string;
      cvFile?: string;
      cvFileType?: string;
    } = {};
    let isValid = true;

    // 1. 학번 검사
    if (!studentId.trim()) {
      newErrors.studentId = '학번을 입력해주세요.';
      isValid = false;
    } else if (!/^\d{2}$/.test(studentId)) {
      // [✨ 유지] 숫자 2자리인지 검사 (입력 자체는 자유롭지만, 저장 시 여기서 걸러짐)
      newErrors.studentId = '학번은 2자리 정수로 입력해주세요. (e.g. 25)';
      isValid = false;
    }

    // 2. 학과 검사
    const validDepartments = departments
      .map((d) => d.trim())
      .filter((d) => d !== '');
    if (validDepartments.length === 0) {
      newErrors.departments = '최소 하나의 학과를 입력해주세요.';
      isValid = false;
    }

    // 3. 파일 검사
    if (!cvFile) {
      newErrors.cvFile = '이력서(PDF) 파일을 업로드해주세요.';
      isValid = false;
    }

    // 4. 파일 타입 검사
    if (cvFile && newErrors.cvFileType !== '.pdf' && cvFile.type !== 'application/pdf') {
      newErrors.cvFile = 'PDF 파일만 업로드 가능합니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, validDepartments };
  };

  // 저장 버튼 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, validDepartments } = validate();

    if (!isValid) {
      return;
    }

    try {
      const randomStr = generateRandomString(10);
      const dateStr = getFormattedDate();
      const fileName = cvFile!.name;

      const generatedCvKey = `static/private/CV/${randomStr}_${dateStr}/${fileName}`;

      // validate를 통과했으므로 studentId는 무조건 숫자 2자리 문자열임이 보장됨
      let enrollYearNum = parseInt(studentId, 10);
      if (enrollYearNum < 100) {
        enrollYearNum += 2000;
      }

      const formattedDepartment = validDepartments.join(',');

      await putMe(token, {
        enrollYear: enrollYearNum,
        department: formattedDepartment,
        cvKey: generatedCvKey,
      });

      alert('프로필이 성공적으로 저장되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>내 프로필 생성</h2>

      {/* 학번 */}
      <div className="form-group">
        <label htmlFor="studentId">
          학번 <span className="required">*</span>
        </label>
        <div className="input-group">
          <input
            type="text"
            id="studentId"
            value={studentId}
            className={errors.studentId ? 'input-error' : ''}
            // [✨ 수정] maxLength 삭제, replace 로직 삭제 -> 자유롭게 입력 가능
            onChange={(e) => {
              setStudentId(e.target.value);
              // 입력 시 에러가 있으면 해제
              if (errors.studentId)
                setErrors((prev) => ({ ...prev, studentId: undefined }));
            }}
            placeholder="예: 25"
          />
        </div>
        {errors.studentId && (
          <div className="error-message">{errors.studentId}</div>
        )}
      </div>

      {/* 학과 (다중 입력) */}
      <div className="form-group">
        <label>
          학과 <span className="required">*</span>
        </label>

        <div className="department-inputs-container">
          {departments.map((dept, index) => (
            <div className="input-button-group" key={index}>
              <input
                type="text"
                className={errors.departments ? 'input-error' : ''}
                value={dept}
                onChange={(e) => handleDepartmentChange(index, e.target.value)}
                placeholder="학과 입력"
              />
              {index > 0 && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleRemoveDepartmentRow(index)}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.departments && (
          <div className="error-message">{errors.departments}</div>
        )}

        <button
          type="button"
          className="add-row-button"
          onClick={handleAddDepartmentRow}
        >
          + 학과 추가
        </button>
      </div>

      {/* 이력서 (CV) - 파일 업로드 */}
      <div className="form-group">
        <label htmlFor="cv-upload">
          이력서 (CV) <span className="required">*</span>
        </label>

        <label
          htmlFor="cv-upload"
          className={`file-upload-label ${errors.cvFile ? 'input-error' : ''}`}
        >
          <UploadIcon size={200} />
          <span className="file-name">
            {cvFile ? cvFile.name : 'PDF 파일만 업로드 가능해요.'}
          </span>
          <input
            id="cv-upload"
            name="cv-upload"
            type="file"
            className="sr-only"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
          />
        </label>

        {errors.cvFile && <div className="error-message">{errors.cvFile}</div>}

        {cvFile !== null && (
          <button
            type="button"
            className="delete-button-File"
            onClick={() => handleRemoveFile()}
          >
            삭제
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
        <button type="submit" className="submit-button">
          저장
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
