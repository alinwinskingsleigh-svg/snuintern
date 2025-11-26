import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '../icons/UploadIcon';
import '../css/ProfileForm.css';
import { putMe, getMe } from '../api/applicant';

interface ProfileFormProps {
  token: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ token }) => {
  const navigate = useNavigate();

  // 상태 관리
  const [studentId, setStudentId] = useState<string>('25');
  // [수정] 학과를 리스트 형태로 관리 (초기값: 입력창 1개)
  const [departments, setDepartments] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);

useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. GET으로 정보 가져오기 (저장된 데이터: "컴퓨터공학부,조경시스템")
        const data = await getMe(token); 
        
        if (data) {
          // 2. 학번 복구 (2021 -> 21)
          if (data.enrollYear) {
            setStudentId(String(data.enrollYear).slice(-2));
          }

          // 3. 학과 칸 복구 (핵심!)
          // "컴퓨터공학부,조경시스템" 문자열을 -> ['컴퓨터공학부', '조경시스템'] 배열로 변환
          if (data.department) {
            const savedDepartments = data.department.split(',');
            setDepartments(savedDepartments); 
            // setDepartments에 배열을 넣으면, 
            // 아래의 map() 함수가 돌면서 자동으로 입력창을 2개(또는 N개) 만들어줍니다.
          }
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchUserData();
  }, [token]);




  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  // [기능] 학과 입력값 변경
  const handleDepartmentChange = (index: number, value: string) => {
    const newDepts = [...departments];
    newDepts[index] = value;
    setDepartments(newDepts);
  };

  // [기능] 학과 입력창 추가 (새로운 줄 생성)
  const handleAddDepartmentRow = () => {
    setDepartments([...departments, '']); // 빈 문자열 추가 -> 새 입력창 렌더링
  };

  // [기능] 학과 입력창 삭제
  const handleRemoveDepartmentRow = (index: number) => {
    // 입력창이 1개 남았을 때는 삭제 대신 내용만 비우기 (선택 사항)
    if (departments.length === 1) {
      handleDepartmentChange(index, '');
      return;
    }
    const newDepts = departments.filter((_, i) => i !== index);
    setDepartments(newDepts);
  };

  // [유틸] 랜덤 문자열 생성
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

  // [유틸] 날짜 문자열 생성 (YYYYMMDD)
  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // [기능] 저장 버튼 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 빈 입력값 제거
    const validDepartments = departments
      .map((d) => d.trim())
      .filter((d) => d !== '');

    if (!studentId || validDepartments.length === 0) {
      alert('학번과 학과를 입력해주세요.');
      return;
    }

    if (!cvFile) {
      alert('이력서(PDF) 파일을 업로드해주세요.');
      return;
    }

    try {
      const randomStr = generateRandomString(10);
      const dateStr = getFormattedDate();
      const fileName = cvFile.name;

      const generatedCvKey = `static/private/CV/${randomStr}_${dateStr}/${fileName}`;

      let enrollYearNum = parseInt(studentId, 10);
      if (enrollYearNum < 100) {
        enrollYearNum += 2000;
      }

      // 배열을 콤마(,)로 합쳐서 전송
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
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="예: 25"
          />
        </div>
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

        {/* [수정] 하단에 '학과 추가' 버튼 배치 */}
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
        <label htmlFor="cv-upload" className="file-upload-label">
          <UploadIcon />
          <span className="file-name">
            {cvFile ? cvFile.name : 'PDF 파일만 업로드 가능해요.'}
          </span>
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
