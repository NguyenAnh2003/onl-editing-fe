import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { deleteUserColab, updateUserMode } from '../../libs/page.api';
import { toast } from 'react-hot-toast';

const ColabUserCard = ({ colabId, pageId, userId, username, mode, setColabUsers }) => {
  /** setup mode value */
  const options = useMemo(() => {
    return mode === 'edit'
      ? [
          { id: 1, label: mode, value: mode },
          { id: 2, label: 'view', value: 'view' },
        ]
      : [
          { id: 1, label: mode, value: mode },
          { id: 2, label: 'edit', value: 'edit' },
        ];
  }, [mode, username, userId, colabId]);

  /** delete user from colab page */
  const deleteUserHandler = useCallback(async () => {
    try {
      const { status } = await deleteUserColab(colabId);
      if (status === 204) {
        toast.success('Delete successfully');
        setColabUsers((prev) => {
          return prev.filter((x) => x._id !== colabId);
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.data);
    }
  }, [userId, username, mode, colabId]);

  /** update mode inside component */
  const updateModeHandler = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        console.log({ userId, username, mode: e.target.value });
        /** update mode in colab api */
        const { data, status } = await updateUserMode(
          colabId,
          userId,
          pageId,
          e.target.value,
          username
        );
        if (status === 200) {
          console.log(data);
          toast.success('Change mode successfully');
        }
      } catch (error) {
        toast.error(error);
      }
    },
    [userId, username, mode, colabId]
  );

  return (
    <>
      <div className="w-full flex justify-between pl-3 pt-3 pb-3 shadow pr-3">
        <div className="flex flex-row items-center">
          <RxCross1 size={15} className="mt-1 cursor-pointer" onClick={deleteUserHandler} />
          <div className="flex-1 min-w-0 ms-4">
            <p className="text-sm font-semibold">{username}</p>
          </div>
        </div>
        <select
          onChange={updateModeHandler}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm outline-none"
        >
          {options.map((i) => (
            <option key={i.id} value={i.value} className="">
              {i.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default ColabUserCard;
