/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-empty-pattern */
import React from 'react';
import { GrDocumentText } from 'react-icons/gr';

const Page = React.memo(({ setPageId, _id, name }) => {
  const selectHandler = () => {
    setPageId(_id);
  };

  return (
    <div>
      <div onClick={selectHandler} className="w-full cursor-pointer">
        <div className="items-center space-x-4">
          <div className="flex flex-row w-full bg-white items-center pl-3">
            <GrDocumentText size={24}/>
            <div className='w-full'>
              <p className="text-lg font-semibold pt-5 pb-5 pl-3">{name}</p>
            </div>
          </div>
          {/** Icon */}
        </div>
      </div>
    </div>
  );
});

export default Page;
