/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-empty-pattern */
import React from 'react';

const Page = React.memo(({ setPageId, _id, name }) => {
  const selectHandler = () => {
    setPageId(_id);
  };

  return (
    <>
      <li onClick={selectHandler} className="pb-3 sm:pb-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium bg-gray-500">{name}</p>
          </div>
        </div>
      </li>
    </>
  );
});

export default Page;
