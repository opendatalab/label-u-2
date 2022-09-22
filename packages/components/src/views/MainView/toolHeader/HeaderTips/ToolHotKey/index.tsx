import { Popover } from 'antd/es';
import _ from 'lodash';
import React, { useState } from 'react';

import hotKeySvg from '@/assets/annotation/toolHotKeyIcon/icon_kj1.svg';
import hotKeyHoverSvg from '@/assets/annotation/toolHotKeyIcon/icon_kj_h.svg';
import { EToolName } from '@/data/enums/ToolType';
import rectToolShortcutTable from './rectToolShortCutTable';
import pointToolShortcutTable from './point';
import polygonToolShortcutTable from './polygon';
import lineToolShortCutTable from './line';
import tagToolSingleShortCutTable from './tag';
import textToolShortCutTable from './text';
import videoToolShortCutTable from './videoTag';

import { footerCls } from '../index';
import { useTranslation } from 'react-i18next';
import { cTool } from '@label-u/annotation';

const { EVideoToolName } = cTool;

interface IProps {
  style?: any;
  title?: React.ReactElement<any>;
  toolName?: string;
}

const shortCutTable: any = {
  [EToolName.Rect]: rectToolShortcutTable,
  [EToolName.Tag]: tagToolSingleShortCutTable,
  [EToolName.Point]: pointToolShortcutTable,
  [EToolName.Polygon]: polygonToolShortcutTable,
  [EToolName.Line]: lineToolShortCutTable,
  [EToolName.Text]: textToolShortCutTable,
  [EVideoToolName.VideoTagTool]: videoToolShortCutTable,
};

const ToolHotKey: React.FC<IProps> = ({ style, title, toolName }) => {
  const [svgFlag, setFlag] = useState(false);
  const { t } = useTranslation();

  if (!toolName) {
    return null;
  }

  const renderImg = (info: Element | string) => {
    if (typeof info === 'string') {
      return <img width={16} height={16} src={info} style={iconStyle} />;
    }
    return info;
  };
  const shortCutStyle = {
    width: 320,
    display: 'flex',
    justifyContent: 'space-between',
    margin: '23px 21px',
  };

  const iconStyle = {
    marginRight: 10,
  };

  const shortCutNameStyles: React.CSSProperties = {
    display: 'block',
    padding: '0 3px',
    minWidth: '20px',
    marginRight: '3px',
    border: '1px solid rgba(204,204,204,1)',
    verticalAlign: 'middle',
    fontSize: '12px',
    textAlign: 'center',
  };

  const setHotKey = (info: any, index: number) => (
    <div style={shortCutStyle} key={index}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {renderImg(info.icon)}
        {t(info.name)}
      </span>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {info.noticeInfo && (
          <span style={{ marginRight: '5px', color: '#CCCCCC' }}>{t(info.noticeInfo)}</span>
        )}
        {setSVG(info.shortCut, info.shortCutUseHtml, info.linkSymbol)}
      </span>
    </div>
  );

  const setSVG = (list: any[], useDangerInnerHtml = false, linkSymbol?: string) => {
    const listDom = list.map((item, index) => {
      if (useDangerInnerHtml) {
        return (
          <span key={index} style={{ display: 'flex' }}>
            <span style={shortCutNameStyles} dangerouslySetInnerHTML={{ __html: item }} />
          </span>
        );
      }

      if (index < list.length - 1) {
        if (typeof item === 'number') {
          return (
            <span key={index} style={{ display: 'flex' }}>
              <span style={shortCutNameStyles}>{item}</span>
              <span style={{ marginRight: '3px' }}>~</span>
            </span>
          );
        }

        if (item?.startsWith('data')) {
          return (
            <span key={index} style={{ display: 'flex' }}>
              <span className='shortCutButton' style={{ marginRight: '3px' }}>
                <img width={16} height={23} src={item} />
              </span>
              <span style={{ marginRight: '3px' }}>+</span>
            </span>
          );
        }
        return (
          <span key={index} style={{ display: 'flex' }}>
            <span style={shortCutNameStyles}>{item}</span>
            <span style={{ marginRight: '3px' }}>{linkSymbol || '+'}</span>
          </span>
        );
      }
      if (typeof item === 'number') {
        return (
          <span key={index} style={{ display: 'flex' }}>
            <span style={shortCutNameStyles}>{item}</span>
          </span>
        );
      }
      if (item?.startsWith('data')) {
        return (
          <span className='shortCutButton' key={index} style={{ marginRight: '3px' }}>
            <img width={16} height={23} src={item} />
          </span>
        );
      }
      return (
        <span style={shortCutNameStyles} key={index}>
          {item}
        </span>
      );
    });
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {listDom}
      </div>
    );
  };

  const content = (
    <div className={`${footerCls}__hotkey-content`}>
      {shortCutTable[toolName]?.map((info: any, index: number) => setHotKey(info, index))}
    </div>
  );
  const containerStyle = style || { width: 100 };

  // 不存在对应的工具则不展示的快捷键
  if (!shortCutTable[toolName]) {
    return null;
  }

  return (
    // @ts-ignore
    <Popover
      placement='topLeft'
      content={content}
      // @ts-ignore
      onMouseMove={() => setFlag(true)}
      onMouseLeave={() => {
        setFlag(false);
      }}
      overlayClassName='tool-hotkeys-popover'
      // visible={svgFlag}
    >
      <div
        className='shortCutTitle'
        onMouseMove={() => setFlag(true)}
        onMouseLeave={() => setFlag(false)}
        style={containerStyle}
      >
        {/* {title ?? (
          <a className='svg'>
            <img
              src={svgFlag ? hotKeyHoverSvg : hotKeySvg}
              width={15}
              height={13}
              style={{ marginRight: '5px' }}
            /> */}

          <a>{t('Hotkeys')}</a>  
          {/* </a>
        )} */}
      </div>
    </Popover>
  );
};

export default ToolHotKey;
