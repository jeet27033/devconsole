import React, { useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import CapRow from '@capillarytech/cap-ui-library/CapRow';
import CapColumn from '@capillarytech/cap-ui-library/CapColumn';
import CapIcon from '@capillarytech/cap-ui-library/CapIcon';
import style from './style';
import { SIDEBAR_ITEMS } from './columns';

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

const hasActiveChild = (item, activeKey) => {
  if (item.key === activeKey) return true;
  if (item.children) {
    return item.children.some((child) => hasActiveChild(child, activeKey));
  }
  return false;
};

const SidebarItem = ({ item, depth, activeKey, openKeys, onToggle, onNavigate }) => {
  const isOpen = openKeys.includes(item.key);
  const isActive = item.key === activeKey;
  const isLeaf = !item.children;

  if (isLeaf) {
    return (
      <div
        className={`sidebar-item depth-${depth}${isActive ? ' active' : ''}`}
        onClick={() => onNavigate(item.path)}
      >
        <span className="sidebar-item-text">{item.title}</span>
      </div>
    );
  }

  return (
    <div className="sidebar-group">
      <div
        className={`sidebar-item has-children depth-${depth}`}
        onClick={() => onToggle(item.key)}
      >
        <span className="sidebar-item-text">{item.title}</span>
        <CapIcon
          type={isOpen ? 'chevron-up' : 'chevron-down'}
          size="s"
          className="sidebar-arrow"
        />
      </div>
      {isOpen && (
        <div className="sidebar-children">
          {item.children.map((child) => (
            <SidebarItem
              key={child.key}
              item={child}
              depth={depth + 1}
              activeKey={activeKey}
              openKeys={openKeys}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CustomSidebar = ({ className, history, location }) => {
  const activeKey = findKeyByPath(SIDEBAR_ITEMS, location.pathname);

  const [openKeys, setOpenKeys] = useState(() => {
    if (!activeKey) return [];
    return findParentKeys(SIDEBAR_ITEMS, activeKey) || [];
  });

  const handleToggle = useCallback((key) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const handleNavigate = useCallback((path) => {
    if (path) {
      history.push(`/${path}`);
    }
  }, [history]);

  return (
    <CapRow className={`${className} custom-sidebar-wrapper`}>
      <CapColumn span={24} className="sidebar-menu">
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              depth={0}
              activeKey={activeKey}
              openKeys={openKeys}
              onToggle={handleToggle}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>
      </CapColumn>
    </CapRow>
  );
};

export default withRouter(withStyles(CustomSidebar, style));
