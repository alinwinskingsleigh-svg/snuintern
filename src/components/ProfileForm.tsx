import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '../icons/UploadIcon';
import '../css/ProfileForm.css';
import { putMe } from '../api/applicant'; // API 함수 import

// 토큰을 props로 받아야 API 호출이 가능합니다.
interface ProfileFormProps {
  token: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ token }) => {
  const navigate = useNavigate();

  // 초기값은 필요에 따라 props로 받은 user 정보로 설정할 수도 있습니다.
  const [studentId, setStudentId] = useState<string>('25');
  const [department, setDepartment] = useState<string>('컴공');
  const [cvFile, setCvFile] = useState<File | null>(null);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  // [수정] 학과 "추가" 버튼 핸들러
  // 백엔드 구조상 학과가 1개이므로, 리스트 추가가 아닌 입력 확인 용도로 사용합니다.
  const handleAddDepartment = () => {
    if (!department.trim()) {
      alert('학과를 입력해주세요.');
      return;
    }
    alert(`'${department}' 학과가 입력되었습니다.`);
  };

  // [수정] "저장" 버튼 핸들러 (폼 제출)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 유효성 검사
    if (!studentId || !department) {
      alert('학번과 학과를 모두 입력해주세요.');
      return;
    }

    try {
      // 2. 파일 업로드 로직 (TODO: 실제 구현 필요)
      // 현재 API는 cvKey(문자열)를 요구합니다. 
      // 실제로는 여기서 파일을 서버/S3에 올리고 받은 키를 cvKey에 넣어야 합니다.
      // 임시로 파일 이름을 키로 사용합니다.
      const cvKey = cvFile ? cvFile.name : 'temp_cv_key';

      // 3. API 호출 (저장)
      await putMe(token, {
        enrollYear: parseInt(studentId, 10), // 문자열 -> 숫자 변환
        department: department,
        cvKey: cvKey,
      });

      alert('프로필이 성공적으로 저장되었습니다.');
      
      // 4. 저장 후 뒤로가기
      navigate(-1); 

    } catch (error) {
      console.error('프로필 저장 실패:', error);
      alert('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      
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
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="예: 25"
          />
        </div>
      </div>

      {/* 학과 */}
      <div className="form-group">
        <label htmlFor="department">
          학과 <span className="required">*</span>
        </label>
        <div className="input-button-group">
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          {/* [수정] type="button" 명시 및 onClick 핸들러 연결 */}
          <button
            type="button"
            className="add-button"
            onClick={handleAddDepartment}
          >
            추가
          </button>
        </div>
      </div>

      {/* 이력서 (CV) - 파일 업로드 */}
      <div className="form-group">
        <label htmlFor="cv-upload">
          이력서 (CV) <span className="required">*</span>
        </label>
        <label
          htmlFor="cv-upload"
          className="file-upload-label"
        >
          <UploadIcon />
          <span className="file-name">{cvFile ? cvFile.name : 'PDF 파일만 업로드 가능해요.'}</span>
          <input 
            id="cv-upload" 
            name="cv-upload" 
            type="file" 
            className="sr-only" 
            accept=".pdf" 
            onChange={handleFileChange} 
          />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {/* 저장 버튼: type="submit" 유지 */}
        <button type="submit" className="submit-button">
          저장
        </button>
        
        {/* [수정] 뒤로가기 버튼: type="button" 및 onClick 연결 */}
        <button 
          type="button" 
          className="cancel-button"
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;