/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { getSpace } from '../libs/space.api';
import Page from '../components/Page';
import ReactQuillEditor from '../components/ReactQuillEditor';

/**
 * page list
 * editor component
 */

const MainEditPage = () => {
  const [pageId, setPageID] = useState('');
  const [listPage, setListPage] = useState([]);

  /** fetching pages from userId */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /** fetch pages */
        const data = await getSpace();
        console.log(data);
        /** prev => ... prev, data */
        setListPage((prev) => [...prev, data]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="">
        <div className="">
          {listPage.map((i, index) => (
            <></>
          ))}
          <p>logram asmdm</p>
        </div>

        <div className="">{pageId ? <ReactQuillEditor /> : <>Leave</>}</div>
      </div>
    </div>
  );
};

export default MainEditPage;
