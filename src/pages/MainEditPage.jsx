/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { getPage } from '../libs/space.api';
import Page from '../components/Page';
import ReactQuillEditor from '../components/ReactQuillEditor';
import { UserContext } from '../UserProvider';

/**
 * page list
 * editor component
 */

const MainEditPage = () => {
  const [pageId, setPageID] = useState('');
  const [listPage, setListPage] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) return;
    console.log('currentUser', currentUser);
  }, []);

  /** fetching pages from userId */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /** fetch pages */
        const data = await getPage();
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
