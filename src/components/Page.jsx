/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-empty-pattern */
import React from 'react';

const Page = React.memo(({ setPageId, _id, name }) => {
  const selectHandler = () => {
    setPageId(_id);
  };

  return (
    <div>
      <div onClick={selectHandler} className="w-full cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="flex-1 w-fit">
            <p className="text-lg font-bold bg-gray-500 pt-5 pb-5 pl-3">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Page;
