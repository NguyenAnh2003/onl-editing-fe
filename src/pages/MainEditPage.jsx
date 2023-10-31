/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSpace, getColabPages, getPagesByUserId } from '../libs/page.api';
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
    if (!currentUser) {
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

  useEffect(() => {
    const fetchColab = async () => {
      const res = await getColabPages(currentUser.userId);
      console.log('colab', res);
      setColabPages(res.data);
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
      <div className="">
        <div className="">
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
          {/* currentUser pages (owner) */}
          Your pages
          {listPage ? (
            <div className="max-w-xs ">
              {listPage.map((i, index) => (
                <div>
                  {' '}
                  <Page key={index} setPageId={setPageId} name={i.name} _id={i._id} />
                </div>
              ))}
            </div>
          ) : (
            <p>None</p>
          )}
          {/* colab pages */}
          {colabPage ? (
            <div className="max-w-xs divide-y">
              {colabPage.map((i, index) => (
                <div>
                  {' '}
                  Your colab pages
                  <Page key={index} setPageId={setPageId} name={i.name} _id={i._id} />
                </div>
              ))}
            </div>
          ) : (
            <p>Don't have colab pages yet</p>
          )}
        </div>

        <div className="">{pageId ? <Editor pageId={pageId} /> : <>Leave</>}</div>
      </div>
    </div>
  );
};

export default MainEditPage;
