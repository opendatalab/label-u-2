import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { Collapse, Form, Input, Select } from 'antd';
import { AppState } from '../../../../store';
import { connect, useDispatch } from 'react-redux';
import { IFileItem } from '@/types/data';
import _ from 'lodash';
import { toolList } from '../../toolHeader/ToolOperation';
import AttributeEditorIcon from '@/assets/cssIcon/attribute_editor.svg';
import AttributeShowIcon from '@/assets/cssIcon/attribute_show.svg';
import AttributeUnionIcon from '@/assets/cssIcon/attribute_union.svg';
import emptyAttributeImg from '@/assets/common/emptyAttribute.png';
import AttributeHideIcon from '@/assets/common/attribute_hide.svg';
import AttributeShowHoverIcon from '@/assets/common/attribute_show_hover.svg';
import { ChangeCurrentTool, UpdateImgList } from '@/store/annotation/actionCreators';
import { ToolInstance } from '@/store/annotation/types';
import { PrevResult, Attribute, EToolName } from '@label-u/annotation';
import DrageModel from '@/components/dragModal';

const { Panel } = Collapse;
const { Option } = Select;

interface AttributeResult {
  isVisible: boolean;
  attributeName: string;
  toolInfo: ToolInfo[];
}

interface ToolInfo {
  toolName: string;
  order: number;
  isVisible: boolean;
  icon: any;
  textAttribute: string;
}

interface IProps {
  attributeList: Attribute[];
  imgIndex: number;
  imgList: IFileItem[];
  toolInstance: ToolInstance;
  currentToolName: string;
  basicResultList: [];
}

const AttributeRusult: FC<IProps> = ({
  imgIndex,
  imgList,
  toolInstance,
  currentToolName,
  attributeList,
  basicResultList,
}) => {
  const [attributeResultList, setAttributeResultList] = useState<AttributeResult[]>([]);
  // const attributeShowRef = useRef<HTMLImageElement>(null);
  const dispatch = useDispatch();
  // 将标注结果转换为attributeResultList 格式
  const [content, setContent] = useState<ReactElement>(<div />);
  // const [result,setResult] = useState();
  const [chooseToolInfo, setChooseToolInfo] = useState<ToolInfo>({
    toolName: '',
    order: -1,
    isVisible: true,
    icon: '',
    textAttribute: '',
  });

  const dragModalRef = useRef<any>();
  useEffect(() => {
    initToolInfo();
  }, []);

  const initToolInfo = () => {
    const initStr = JSON.stringify({
      toolName: '',
      order: -1,
      isVisible: true,
      icon: '',
      textAttribute: '',
    });
    localStorage.setItem('toolInfo', initStr);
  };

  useEffect(() => {
    if (imgList && imgList.length > 0) {
      let currentImgResult = JSON.parse(imgList[imgIndex].result as string);
      let resultKeys = Object.keys(currentImgResult);
      let tmpAttributeResult: AttributeResult[] = [];
      let attributeMap = new Map();
      for (let item of toolList) {
        if (resultKeys.indexOf(item.toolName) >= 0) {
          let result = currentImgResult[item.toolName].result;
          if (result && Array.isArray(result)) {
            for (let oneLabel of result) {
              // eslint-disable-next-line max-depth
              if (attributeMap.has(oneLabel.attribute)) {
                let tmpToolInfo = attributeMap.get(oneLabel.attribute);
                tmpToolInfo.push({
                  toolName: item.toolName,
                  order: oneLabel.order,
                  icon: item.commonSvg,
                  isVisible: oneLabel.isVisible,
                  textAttribute: oneLabel.textAttribute,
                });
              } else {
                attributeMap.set(oneLabel.attribute, [
                  {
                    toolName: item.toolName,
                    order: oneLabel.order,
                    icon: item.commonSvg,
                    isVisible: oneLabel.isVisible,
                    textAttribute: oneLabel.textAttribute,
                  },
                ]);
              }
            }
          }
        }
      }
      // 初始化attributeResultList
      for (let key of attributeMap.keys()) {
        let toolInfo = attributeMap.get(key);
        let isVisible = true;
        if(toolInfo.length>0){
          for(let tool of toolInfo){
            if(!tool.isVisible){
              isVisible = false;
              break;
            }
          }
        }
        tmpAttributeResult.push({
          isVisible: isVisible,
          attributeName: key,
          toolInfo: attributeMap.get(key),
        });
      }
      setAttributeResultList(tmpAttributeResult);
    }
  }, [imgList, imgIndex]);

  // 修改标注描述信息 || 修改是否可以显示
  const updateLabelResult = (toolInfo: ToolInfo) => {
    let oldImgResult = JSON.parse(imgList[imgIndex].result as string);
    // 更新结果
    if (
      oldImgResult[toolInfo.toolName].result &&
      oldImgResult[toolInfo.toolName].result.length > 0
    ) {
      let newToolLabelItems = oldImgResult[toolInfo.toolName].result.map(
        (item: { order: number; isVisible: boolean }) => {
          if (item.order === toolInfo.order) {
            return {
              ...item,
              isVisible: toolInfo.isVisible,
              textAttribute: toolInfo.textAttribute,
            };
          }
          return item;
        },
      );
      oldImgResult[toolInfo.toolName].result = newToolLabelItems;
    }
    imgList[imgIndex].result = JSON.stringify(oldImgResult);
    dispatch(UpdateImgList(imgList));
    updateCanvasView(oldImgResult);
  };

  // 批量修改是否可以显示
  const updateLabelsResult = (attributeResult: AttributeResult) => {
    let oldImgResult = JSON.parse(imgList[imgIndex].result as string);
    // 更新标注结果
    let newToolInfo: ToolInfo[] = [];
    if (attributeResult.toolInfo.length > 0) {
      newToolInfo = attributeResult.toolInfo.map((item) => {
        return { ...item, isVisible: attributeResult.isVisible };
      });
    }
    attributeResult.toolInfo = newToolInfo;
    const newAttributeResultList = attributeResultList.map((item, index) => {
      if (item.attributeName === attributeResult.attributeName) {
        return { ...attributeResult };
      }
      return item;
    });
    setAttributeResultList(newAttributeResultList);
    // 更新显示结果
    if (attributeResult.toolInfo && attributeResult.toolInfo.length > 0) {
      for (let oneTool of attributeResult.toolInfo) {
        if (
          oldImgResult[oneTool.toolName].result &&
          oldImgResult[oneTool.toolName].result.length > 0
        ) {
          let newToolLabelItems = oldImgResult[oneTool.toolName].result.map(
            (item: { order: number; isVisible: boolean }) => {
              if (item.order === oneTool.order) {
                return {
                  ...item,
                  isVisible: attributeResult.isVisible,
                };
              }
              return item;
            },
          );
          oldImgResult[oneTool.toolName].result = newToolLabelItems;
        }
      }
      imgList[imgIndex].result = JSON.stringify(oldImgResult);
      dispatch(UpdateImgList(imgList));
      updateCanvasView(oldImgResult);
    }
  };

  // 批量删除标注
  const deleteLabelByAttribute = (attributeResult: AttributeResult) => {
    let oldImgResult = JSON.parse(imgList[imgIndex].result as string);
    const newAttributeResultList = attributeResultList.reduce((res, item) => {
      if (item.attributeName !== attributeResult.attributeName) {
        res.push(item);
      }
      return res;
    }, [] as AttributeResult[]);
    setAttributeResultList(newAttributeResultList);

    // 更新删除后显示结果
    if (attributeResult.toolInfo && attributeResult.toolInfo.length > 0) {
      for (let oneTool of attributeResult.toolInfo) {
        if (
          oldImgResult[oneTool.toolName].result &&
          oldImgResult[oneTool.toolName].result.length > 0
        ) {
          let newToolLabelItems = oldImgResult[oneTool.toolName].result.reduce(
            (
              res: { order: number; isVisible: boolean }[],
              item: { order: number; isVisible: boolean },
            ) => {
              if (item.order !== oneTool.order) {
                res.push(item);
              }
              return res;
            },
            [],
          );
          oldImgResult[oneTool.toolName].result = newToolLabelItems;
        }
      }
      imgList[imgIndex].result = JSON.stringify(oldImgResult);
      dispatch(UpdateImgList(imgList));
      updateCanvasView(oldImgResult);
    }
  };

  // 删除标注
  const delelteLabel = (toolInfo: ToolInfo) => {
    let oldImgResult = JSON.parse(imgList[imgIndex].result as string);
    // 更新结果
    if (
      oldImgResult[toolInfo.toolName].result &&
      oldImgResult[toolInfo.toolName].result.length > 0
    ) {
      let newToolLabelItems = oldImgResult[toolInfo.toolName].result.reduce(
        (
          res: { order: number; isVisible: boolean }[],
          item: { order: number; isVisible: boolean },
        ) => {
          if (item.order !== toolInfo.order) {
            res.push(item);
          }
          return res;
        },
        [],
      );
      oldImgResult[toolInfo.toolName].result = newToolLabelItems;
    }
    imgList[imgIndex].result = JSON.stringify(oldImgResult);
    dispatch(UpdateImgList(imgList));
    updateCanvasView(oldImgResult);
  };

  // 更新pre 标注结果
  const updateCanvasView = (newLabelResult: any) => {
    const prevResult: PrevResult[] = [];
    for (let oneTool of toolList) {
      if (oneTool.toolName !== currentToolName && newLabelResult[oneTool.toolName]) {
        let onePrevResult = {
          toolName: oneTool.toolName,
          result: newLabelResult[oneTool.toolName].result,
        };
        prevResult.push(onePrevResult);
      }
      if (oneTool.toolName === currentToolName) {
        toolInstance.setResult(newLabelResult[oneTool.toolName].result);
      }
    }
    toolInstance.setPrevResultList(prevResult);
    toolInstance.render();
  };

  // 根据标签及工具 修改标签及描述
  const updateLabelResultByOrderAndToolName = (
    order: number,
    fromToolName: string,
    toAttributeName: string,
    toAttributeText: string,
  ) => {
    let oldImgResult = JSON.parse(imgList[imgIndex].result as string);
    // 更新结果
    if (oldImgResult[fromToolName].result && oldImgResult[fromToolName].result.length > 0) {
      let newToolLabelItems = oldImgResult[fromToolName].result.map(
        (item: { order: number; isVisible: boolean; attribute: string; textAttribute: string }) => {
          if (item.order === order) {
            return {
              ...item,
              attribute: toAttributeName,
              textAttribute: toAttributeText,
            };
          }
          return item;
        },
      );
      oldImgResult[fromToolName].result = newToolLabelItems;
    }
    imgList[imgIndex].result = JSON.stringify(oldImgResult);
    dispatch(UpdateImgList(imgList));
    updateCanvasView(oldImgResult);
  };

  // 设置选中线条
  const setSelectedLabel = (toolInfo: ToolInfo) => {
    // 选中当前标注
    let toolInfoStr = JSON.stringify(toolInfo);
    localStorage.setItem('toolInfo', toolInfoStr);
    // 切换工具
    dispatch(ChangeCurrentTool(toolInfo.toolName));
    setChooseToolInfo(toolInfo);
  };

  useEffect(() => {
    if (imgList && basicResultList) {
      const toolInfoStr = localStorage.getItem('toolInfo');
      // 获取basicReuslt 有哪几种标注结果
      const basicResultTools = basicResultList.reduce((res, item: { toolName: string }) => {
        res.push(item.toolName);
        return res;
      }, [] as string[]);

      if (toolInfoStr && toolInfoStr.length > 0) {
        const chooseToolInfo = JSON.parse(toolInfoStr as string);
        let imgResult = JSON.parse(imgList[imgIndex].result as string);
        if (
          toolInstance &&
          chooseToolInfo.toolName &&
          chooseToolInfo.toolName === currentToolName &&
          basicResultTools.indexOf(chooseToolInfo.toolName) < 0 &&
          imgResult[chooseToolInfo.toolName].result &&
          imgResult[chooseToolInfo.toolName].result.length > 0
        ) {
          for (let item of imgResult[chooseToolInfo.toolName].result) {
            if (item.order === chooseToolInfo.order) {
              // eslint-disable-next-line max-depth
              if (chooseToolInfo.toolName === EToolName.Line) {
                // @ts-ignore
                toolInstance?.setActiveAreaByPoint(item?.pointList[0]);
                // 选中之后，重新初始化
                initToolInfo();
              } else if (chooseToolInfo.toolName === EToolName.Point) {
                // @ts-ignore
                toolInstance?.setSelectedID(item.id);
                // 选中之后，重新初始化
                initToolInfo();
              } else if (chooseToolInfo.toolName === EToolName.Polygon) {
                // @ts-ignore
                toolInstance?.setSelectedID(item.id);
                // 选中之后，重新初始化
                initToolInfo();
              } else if (chooseToolInfo.toolName === EToolName.Rect) {
                // @ts-ignore
                toolInstance?.setSelectedID(item.id);
                // 选中之后，重新初始化
                initToolInfo();
              }
            }
          }
        }
      }
    }
  }, [toolInstance, basicResultList, chooseToolInfo]);

  const generateContent = (toolInfo: ToolInfo, attributeResult: AttributeResult) => {
    let children = [];
    for (let item of attributeList) {
      // eslint-disable-next-line react/jsx-no-undef
      children.push(<Option key={item.key}>{item.value}</Option>);
    }
    return (
      <Form
        name='basic'
        layout='vertical'
        initialValues={{
          changeAttribute: attributeResult.attributeName,
          description: toolInfo.textAttribute,
        }}
        autoComplete='off'
        onFieldsChange={(_, allFields) => {
          updateLabelResultByOrderAndToolName(
            toolInfo.order,
            toolInfo.toolName,
            allFields[0].value,
            allFields[1].value,
          );
        }}
      >
        <Form.Item
          label='标签'
          name='changeAttribute'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{
              width: '100%',
            }}
          >
            {children}
          </Select>
        </Form.Item>
        <Form.Item
          label='描述'
          name='description'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    );
  };

  if (!attributeResultList || attributeResultList.length === 0) {
    return (
      <div className='containerBox'>
        <img className='emptyAttributeImg' src={emptyAttributeImg} />
      </div>
    );
  }

  return (
    <div>
      <DrageModel
        title='详细信息'
        ref={dragModalRef}
        width={333}
        okWord='确认'
        cancelWord='取消'
        content={content}
      />
      <Collapse defaultActiveKey={['1']}>
        {attributeResultList &&
          attributeResultList.length > 0 &&
          attributeResultList.map((item, index) => {
            return (
              <Panel
                header={
                  <div className='attributeResultLi' key={item.attributeName + item.isVisible}>
                    <span>{item.attributeName}</span>{' '}
                    <div className='attributeResultRightImgBox'>
                      {item.isVisible ? (
                        <img
                          className='hoverShow'
                          id={`${item.attributeName}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLabelsResult({ ...item, isVisible: false });
                            // const newTItem = { ...item, isVisible: false };
                            // updateLabelVisible(tItem, false);
                            // updateLabelResult(newTItem);
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            // attributeShowRef.current?.setAttribute('src', AttributeShowHoverIcon);
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            // attributeShowRef.current?.setAttribute('src', AttributeShowIcon);
                          }}
                          src={AttributeShowIcon}
                          style={{ marginRight: '10px' }}
                        />
                      ) : (
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLabelsResult({ ...item, isVisible: true });
                            // updateLabelVisible(tItem, true);
                          }}
                          src={AttributeHideIcon}
                          style={{ marginRight: '10px' }}
                        />
                      )}
                      <img
                        src={AttributeUnionIcon}
                        className='hoverShow'
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLabelByAttribute(item);
                        }}
                      />
                    </div>{' '}
                  </div>
                }
                key={index}
              >
                {item.toolInfo &&
                  item.toolInfo.length > 0 &&
                  item.toolInfo.map((tItem, tIndex) => {
                    return (
                      <div
                        key={tItem.toolName + tItem.order}
                        className='attributeResultLi'
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLabel(tItem);
                        }}
                      >
                        <span>{tIndex}.</span>
                        <img src={tItem.icon} style={{ marginLeft: '5px', marginRight: '5px' }} />
                        <span
                          title={item.attributeName}
                          style={{
                            marginRight: '36px',
                            width: '83px',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                        >
                          {item.attributeName}
                        </span>
                        <div className='attributeResultRightImgBox'>
                          <img
                            id={`${tItem.toolName + tItem.order} + edit`}
                            onClick={(e) => {
                              e.stopPropagation();
                              // @ts-ignore
                              const boundingClientRect = document
                                .getElementById(`${tItem.toolName + tItem.order} + edit`)
                                .getBoundingClientRect();
                              const tmpBounds = {
                                left: boundingClientRect.left,
                                top: boundingClientRect.top,
                              };

                              dragModalRef.current.switchModal(true);
                              dragModalRef.current.switchSetBounds(tmpBounds);
                              setContent(generateContent(tItem, item));
                            }}
                            src={AttributeEditorIcon}
                            className='hoverShow'
                            style={{ marginRight: '10px' }}
                          />
                          {tItem.isVisible ? (
                            <img
                              className='hoverShow'
                              id={`${tItem.toolName + tItem.order}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newTItem = { ...tItem, isVisible: false };
                                // updateLabelVisible(tItem, false);
                                updateLabelResult(newTItem);
                              }}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById(`${tItem.toolName + tItem.order}`)
                                  ?.setAttribute('src', AttributeShowHoverIcon);
                                // attributeShowRef.current?.setAttribute('src', AttributeShowHoverIcon);
                              }}
                              onMouseLeave={(e) => {
                                e.stopPropagation();
                                // attributeShowRef.current?.setAttribute('src', AttributeShowIcon);
                                document
                                  .getElementById(`${tItem.toolName + tItem.order}`)
                                  ?.setAttribute('src', AttributeShowIcon);
                              }}
                              src={AttributeShowIcon}
                              style={{ marginRight: '10px' }}
                            />
                          ) : (
                            <img
                              onClick={(e) => {
                                e.stopPropagation();
                                // updateLabelVisible(tItem, true);
                                const newTItem = { ...tItem, isVisible: true };
                                updateLabelResult(newTItem);
                              }}
                              src={AttributeHideIcon}
                              style={{ marginRight: '10px' }}
                            />
                          )}
                          <img
                            src={AttributeUnionIcon}
                            className='hoverShow'
                            onClick={(e) => {
                              e.stopPropagation();
                              delelteLabel(tItem);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </Panel>
            );
          })}
      </Collapse>
    </div>
  );
};

const getStateMap = (state: AppState) => {
  return {
    imgList: [...state.annotation.imgList],
    imgIndex: state.annotation.imgIndex,
    toolInstance: state.annotation.toolInstance,
    currentToolName: state.annotation.currentToolName,
    attributeList: state.annotation.attributeList,
    basicResultList: state.annotation.basicResultList,
  };
};

export default connect(getStateMap)(AttributeRusult);
