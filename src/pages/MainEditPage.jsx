/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { getPage, getPagesByUserId } from '../libs/page.api';
import Page from '../components/Page';
import ReactQuillEditor from '../components/ReactQuillEditor';
import { UserContext } from '../store/UserProvider';
import { useNavigation } from 'react-router-dom';

/**
 * page list
 * editor component
 */

const MainEditPage = () => {
  const [pageId, setPageID] = useState('');
  const [listPage, setListPage] = useState([]);
  const { currentUser } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!currentUser) return;
    console.log('currentUser', currentUser);
  }, []);

  /** fetching pages from userId */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /** fetch pages by userId*/
        const data = await getPagesByUserId(currentUser.userId);
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
          {listPage ? (
            <></>
          ) : (
            <>None</>
          )}
        </div>

        <div className="">{pageId ? <ReactQuillEditor /> : <>Leave</>}</div>
      </div>
    </div>
  );
};

export default MainEditPage;
