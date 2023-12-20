/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-empty-pattern */
import React, { useCallback } from 'react';
import { GrDocumentText } from 'react-icons/gr';
import { deletePage } from '../libs/page.api';
import { Toaster, toast } from 'react-hot-toast';
import { ImCross } from 'react-icons/im';

const Page = React.memo(({ setPageId, pId, name, removePage, isColab }) => {
  /** select with setPageId */
  const selectHandler = useCallback(() => {
    setPageId(pId);
    return () => {
      setPageId('');
    };
  }, [pId, name]);

  /** remove page */
  const removeHandler = async () => {
    try {
      console.log(`pageId: ${pId}`);
      const { data, status } = await deletePage(pId);
      if (status === 200 && data) {
        removePage((prev) => {
          return prev.filter((x) => x._id !== pId);
        });
        toast.success(data);
      }
    } catch (error) {
      console.error(error);
      /** Toast for error */
      toast.error(error.message);
    }
  };

  return (
    <div>
      {/** Toaster */}
      <Toaster reverseOrder={false} position="top-right" />
      <div className="w-full cursor-pointer">
        <div className="items-center space-x-4 flex flex-row bg-white pr-3">
          <div className="flex flex-row w-full bg-white items-center pl-3">
            <GrDocumentText size={24} />
            <div className="w-full" onClick={selectHandler}>
              <p className="text-lg font-semibold pt-5 pb-5 pl-3">{name}</p>
            </div>
          </div>
          {/** Icon */}
          {isColab === false ? <ImCross size={15} onClick={removeHandler} /> : <></>}
        </div>
      </div>
    </div>
  );
});

export default Page;
