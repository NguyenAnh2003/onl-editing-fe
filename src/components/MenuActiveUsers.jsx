/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { AvatarGroup } from 'primereact/avatargroup';
import { Tooltip } from 'primereact/tooltip';
import { Avatar } from 'primereact/avatar';
import { Menubar } from 'primereact/menubar';

const MenuActiveUsers = ({ group, currentUser }) => {
  return (
    <div>
      <Menubar
        model={[]}
        start={
          <AvatarGroup>
            {group
              .filter((x) => x.userId !== currentUser?.userId)
              .map((i) => (
                <Fragment key={i.socketId}>
                  <Tooltip
                    target={`#avatar_${i.socketId}`}
                    content={i.name}
                    position="top"
                  ></Tooltip>
                  <Avatar
                    id={`avatar_${i.socketId}`}
                    label={i.name.charAt(0)}
                    shape="circle"
                    style={{ backgroundColor: i.color }}
                    className="transition-all	transition-duration-200 border-2 border-transparent text-white"
                  />
                </Fragment>
              ))}
          </AvatarGroup>
        }
      />
    </div>
  );
};

export default MenuActiveUsers;
