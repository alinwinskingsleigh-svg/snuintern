import ProfileForm from "../components/ProfileForm";

const ProfilePage = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <div>로그인이 필요합니다.</div>;
  }

  return <ProfileForm token={token} />;
};


export default ProfilePage;
