/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createSpace, getColabPages, getDataByPageId, getPagesByUserId } from '../libs/page.api';
import Page from '../components/Page';
import { UserContext } from '../store/UserProvider';
import { GoHubot } from 'react-icons/go';
import ChatPanel from '../components/ChatPanel';
import Editor from '../components/Editor';
import CreatePageModal from '../components/modals/CreatePageModal';
import { toast } from 'react-hot-toast';

/**
 * page list
 * editor component
 */

const Home = () => {
  /** navigate */
  const navigate = useNavigate();
  /** setPageId used for component props onClick */
  const [pageId, setPageId] = useState('');
  const [listPage, setListPage] = useState([]);
  /** list Colab page */
  const [colabPage, setColabPages] = useState([]);
  const { currentUser } = useContext(UserContext);
  const pageName = useRef(null);
  /** open modal */
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  /** */
  const [isColabPage, setIsColab] = useState(false);

  /** fetching pages from userId */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /** fetch pages by userId*/
        const res = await getPagesByUserId(currentUser.userId);
        if (res.status === 200) {
          setListPage(res.data);
        }
        /** colabs */
        const colabResults = await getColabPages(currentUser.userId);
        console.log(colabResults.data);
        if (colabResults.data) {
          const responseColabs = [];
          await Promise.all(
            colabResults.data.map(async (x) => {
              const colabPage = await getDataByPageId(x.pageId)
                .then(({ status, data }) => {
                  if (status === 200) return data;
                })
                .catch((err) => console.error(err));
              /** set colab pages */
              responseColabs.push(colabPage);
            })
          );
          console.log('response colabs', responseColabs);
          setColabPages(responseColabs);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    return () => {
      setListPage([]);
      setColabPages([]);
    };
  }, []);

  /** create page handler  */
  const createPageHandler = useCallback(async () => {
    /**
     * @param userId
     * @param pageName
     */
    console.log('page name', pageName.current.value);
    try {
      if (pageName.current.value === '') {
        toast.error('Page name is null');
        // return;
      } else {
        const { data, status } = await createSpace(currentUser.userId, pageName.current.value);
        if (status === 200) {
          toast.success('Create page successfully');
          setTimeout(() => {
            setListPage((prev) => {
              return [...prev, data];
            });
          }, 300);
          console.log(data);
          pageName.current.value = ''; // set pageName ref to empty
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Cannot create page');
    }
  }, [pageName, currentUser]);

  return (
    <div>
      <div className="relative">
        {/* Modal */}
        <CreatePageModal pageName={pageName && pageName} createPageHandler={createPageHandler} />
        {/** chat panel */}
        {open ? <ChatPanel open={open} handleClose={handleClose} /> : <></>}
        <div className="mx-auto pl-5 pr-5 grid grid-cols-12 gap-2 h-screen">
          <div className="pl-2 pr-2 col-span-12 w-4/3 h-full rounded border border-gray-400 bg-gray-200 sm:col-span-4">
            <p className="text-xl font-bold pb-5">Your pages</p>
            {listPage && listPage ? (
              <div className="w-full gap-1 flex flex-col">
                {listPage.map((i, index) => (
                  <div key={index}>
                    {' '}
                    <Page
                      setPageId={setPageId}
                      name={i?.name}
                      pId={i?._id}
                      removePage={setListPage}
                      isColab={false}
                      setIsColab={setIsColab}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xl">Create your own page</p>
            )}
            {/* colab pages */}
            <p className="text-xl font-bold pt-3 pb-5">Your colab pages</p>
            {colabPage && colabPage ? (
              <div className="w-full divide-y gap-1 flex flex-col">
                {colabPage.map((i, index) => (
                  <div key={index}>
                    {' '}
                    <Page
                      setPageId={setPageId}
                      name={i?.name}
                      pId={i?._id}
                      isColab={true}
                      removePage={null}
                      setIsColab={setIsColab}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xl font-bold ">Don't have colab pages yet</p>
            )}
          </div>
          {/** Editor component */}
          <div className="w-5/7 h-full col-span-12 rounded border border-gray-500 bg-gray-200 sm:col-span-8">
            {pageId ? (
              <Editor isColab={isColabPage} pageId={pageId} />
            ) : (
              <div className="flex flex-col align-middle justify-center">
                <p className="text-center font-semibold">Click 1 page for editing</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/** ask ai pop up */}
      <div className="fixed right-12 bottom-10">
        <div className="">
          <GoHubot
            onClick={handleOpen}
            size={50}
            className="p-2 rounded-full border border-solid border-black cursor-pointer bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
