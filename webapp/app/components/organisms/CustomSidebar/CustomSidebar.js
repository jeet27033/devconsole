import React, { useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import CapMenu from '@capillarytech/cap-ui-library/CapMenu';
import CapRow from '@capillarytech/cap-ui-library/CapRow';
import CapColumn from '@capillarytech/cap-ui-library/CapColumn';
import style from './style';
import { SIDEBAR_ITEMS } from './constants';

const renderMenuItems = (items, depth = 0) =>
  items.map((item) => {
    if (item.children) {
      return (
        <CapMenu.SubMenu
          key={item.key}
          title={item.title}
          className={`depth-${depth}`}
        >
          {renderMenuItems(item.children, depth + 1)}
        </CapMenu.SubMenu>
      );
    }
    return (
      <CapMenu.Item
        key={item.key}
        className={`depth-${depth}${depth === 0 ? ' top-level-item' : ''}`}
      >
        {item.title}
      </CapMenu.Item>
    );
  });

const findPathByKey = (items, targetKey) => {
  for (const item of items) {
    if (item.key === targetKey) return item.path;
    if (item.children) {
      const found = findPathByKey(item.children, targetKey);
      if (found) return found;
    }
  }
  return null;
};

const findKeyByPath = (items, pathname) => {
  for (const item of items) {
    if (item.path && pathname.endsWith(item.path)) return item.key;
    if (item.children) {
      const found = findKeyByPath(item.children, pathname);
      if (found) return found;
    }
  }
  return null;
};

const findParentKeys = (items, targetKey, parents = []) => {
  for (const item of items) {
    if (item.key === targetKey) return parents;
    if (item.children) {
      const found = findParentKeys(item.children, targetKey, [...parents, item.key]);
      if (found) return found;
    }
  }
  return null;
};

const CustomSidebar = ({ className, history, location }) => {
  const activeKey = findKeyByPath(SIDEBAR_ITEMS, location.pathname);

  const [selectedKeys, setSelectedKeys] = useState(activeKey ? [activeKey] : []);
  const [openKeys, setOpenKeys] = useState(() => {
    if (!activeKey) return [];
    return findParentKeys(SIDEBAR_ITEMS, activeKey) || [];
  });

  const handleSelect = useCallback(({ key }) => {
    setSelectedKeys([key]);
    const path = findPathByKey(SIDEBAR_ITEMS, key);
    if (path) {
      history.push(`/${path}`);
    }
  }, [history]);

  const handleOpenChange = useCallback((keys) => {
    setOpenKeys(keys);
  }, []);

  return (
    <CapRow className={`${className} custom-sidebar-wrapper`}>
      <CapColumn span={24} className="sidebar-menu">
        <CapMenu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={handleSelect}
          onOpenChange={handleOpenChange}
          className="sidebar-nav"
        >
          {renderMenuItems(SIDEBAR_ITEMS)}
        </CapMenu>
      </CapColumn>
    </CapRow>
  );
};

export default withRouter(withStyles(CustomSidebar, style));
