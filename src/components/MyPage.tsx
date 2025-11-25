import React, { useState } from "react";
import BookmarksTab from "./BookmarksTab";
import ProfileTab from "./ProfileTab";

const MyPage: React.FC<{ token: string }> = ({ token }) => {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "profile">("bookmarks");

  return (
    <div className="mypage">
      <div className="tabs">
        <button
          className={activeTab === "bookmarks" ? "active" : ""}
          onClick={() => setActiveTab("bookmarks")}
        >
          관심 공고
        </button>
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          내 정보
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "bookmarks" ? <BookmarksTab token={token} /> : <ProfileTab token={token} />}
      </div>
    </div>
  );
};

export default MyPage;
