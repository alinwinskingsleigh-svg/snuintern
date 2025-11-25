import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getBookmarks } from '../api/post';

interface Bookmark {
  id: string;
  companyName: string;
  positionTitle: string;
  employmentEndDate: string;
}

const BookmarksTab: React.FC<{ token: string }> = ({ token }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    getBookmarks(token).then(setBookmarks).catch(console.error);
  }, [token]);

  const getStatusColor = (date: string) => {
    const endDate = dayjs(date);
    const today = dayjs();
    if (!date || endDate.diff(today, 'day') >= 0) return 'blue';
    return 'red';
  };

  return (
    <div className="bookmarks-tab">
      {bookmarks.map((b) => (
        <div key={b.id} className="bookmark-item">
          <h3>{b.companyName}</h3>
          <p>{b.positionTitle}</p>
          <p style={{ color: getStatusColor(b.employmentEndDate) }}>
            {b.employmentEndDate
              ? dayjs(b.employmentEndDate).format('YYYY-MM-DD')
              : '상시 모집'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BookmarksTab;
