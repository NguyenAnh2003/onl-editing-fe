import React, { useCallback, useMemo, useRef, useState } from 'react';
import { updateUserMode } from '../../libs/page.api';
import { toast } from 'react-hot-toast';

const ColabUserCard = ({ pageId, userId, username, mode }) => {
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
  }, [mode, username, userId]);

  /** update mode inside component */
  const updateModeHandler = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        console.log({ userId, username, mode: e.target.value });
        /** update mode in colab api */
        const { data, status } = await updateUserMode(userId, pageId, e.target.value, username);
        if (status === 200) {
          console.log(data);
          toast.success('Change mode successfully');
        }
      } catch (error) {
        toast.error(error);
      }
    },
    [userId, username, mode]
  );

  return (
    <>
      <div className="w-full flex pt-3 pb-3 shadow pr-3">
        <div className="flex-1 min-w-0 ms-4">
          <p className="text-sm font-semibold">{username}</p>
        </div>
        <select onChange={updateModeHandler}>
          {options.map((i) => (
            <option key={i.id} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default ColabUserCard;
