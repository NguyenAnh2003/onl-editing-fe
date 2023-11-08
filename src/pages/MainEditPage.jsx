/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSpace, getColabPages, getDataByPageId, getPagesByUserId } from '../libs/page.api';
import Page from '../components/Page';
import { UserContext } from '../store/UserProvider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Editor from '../components/Editor';

/**
 * page list
 * editor component
 */

const MainEditPage = () => {
  /** navigate */
  const navigate = useNavigate();
  /** setPageId used for component props onClick */
  const [pageId, setPageId] = useState('');
  const [listPage, setListPage] = useState([]);
  /** list Colab page */
  const [colabPage, setColabPages] = useState([]);
  const { currentUser } = useContext(UserContext);
  const pageName = useRef(null);

  useEffect(() => {
    if (currentUser === null) {
      navigate('/signin');
    }
  }, []);

  /** fetching pages from userId */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /** fetch pages by userId*/
        const res = await getPagesByUserId(currentUser.userId);
        // console.log(res.data);
        /** data */
        setListPage(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  /**
   * get colab pages with array of pageId
   * using each pageId and fetching data of each
   */
  useEffect(() => {
    const fetchColab = async () => {
      const res = await getColabPages(currentUser.userId);
      // const colabs = await Promise.all()
      if (res.data) {
        const responseColabs = [];
        await Promise.all(
          res.data.map(async (i) => {
            const colabPage = await getDataByPageId(i.pageId)
              .then((res) => res.data)
              .catch((err) => console.error(err));
            /** set colab pages */
            responseColabs.push(colabPage);
          })
        );
        console.log('response colabs', responseColabs);
        setColabPages(responseColabs);
      }
    };
    fetchColab();
  }, []);

  /** create page handler  */
  const createPageHandler = async () => {
    /**
     * @param userId
     * @param pageName
     */
    console.log('page name', pageName.current.value);
    try {
      const data = await createSpace(currentUser.userId, pageName.current.value);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Modal */}
      <PopupState variant="popper" popupId="demo-popup-popper">
        {(popupState) => (
          <div>
            <Button variant="contained" {...bindToggle(popupState)}>
              Create new Page
            </Button>
            <Popper {...bindPopper(popupState)} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    <Typography sx={{ p: 2 }}>Name of your Page</Typography>
                    <input ref={pageName} />
                    <button onClick={createPageHandler}>Create</button>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </div>
        )}
      </PopupState>
      <div className="mx-auto pl-5 pr-5 grid grid-cols-12 gap-2 h-screen">
        <div className="col-span-12 w-4/3 h-full rounded border border-gray-400 bg-gray-200 sm:col-span-4">
          {/* currentUser pages (owner)
          col for pages
         */}
          <p className="text-xl font-bold pb-5">Your pages</p>
          {listPage && listPage ? (
            <div className="w-full gap-4 flex flex-col">
              {listPage.map((i, index) => (
                <div>
                  {' '}
                  <Page key={index} setPageId={setPageId} name={i.name} _id={i._id} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl">Create your own page</p>
          )}
          {/* colab pages */}
          <p className="text-xl font-bold pt-3 pb-5">Your colab pages</p>
          {colabPage && colabPage ? (
            <div className="w-full divide-y gap-4 flex flex-col">
              {colabPage.map((i, index) => (
                <div>
                  {' '}
                  <Page key={index} setPageId={setPageId} name={i.name} _id={i._id} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl font-bold ">Don't have colab pages yet</p>
          )}
        </div>
        {/** Editor component */}
        <div className="w-5/7 h-full col-span-12 rounded border border-gray-500 bg-gray-200 sm:col-span-8">
          {pageId ? <Editor pageId={pageId} /> : <>Click 1 page for editing</>}
        </div>
      </div>
    </div>
  );
};

export default MainEditPage;
