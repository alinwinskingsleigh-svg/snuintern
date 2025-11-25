import React, { useState } from 'react';
import UploadIcon from '../icons/UploadIcon';
import '../css/ProfileForm.css'; // 새로 분리한 CSS 파일 import

const ProfileForm: React.FC = () => {
  const [studentId, setStudentId] = useState<string>('25');
  const [department, setDepartment] = useState<string>('컴공');
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      studentId,
      department,
      cvFile: cvFile?.name
    });
    console.log('프로필이 저장되었습니다.'); 
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
          <button
            type="button"
            className="add-button"
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
          <input id="cv-upload" name="cv-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button type="submit" className="submit-button">
          저장
        </button>
        <button type="button" className="cancel-button">
          뒤로가기
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;