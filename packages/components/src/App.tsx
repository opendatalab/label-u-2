import MainView from '@/views/MainView';
import { i18n } from '@label-u/utils';
import React, { useEffect } from 'react';
import { connect,useDispatch } from 'react-redux';
import { store } from '.';
import { AppState } from './store';
import { ANNOTATION_ACTIONS } from './store/Actions';
import { ChangeCurrentTool, InitTaskData, loadImgList } from './store/annotation/actionCreators';
import { LoadFileAndFileData } from './store/annotation/reducer';
import { ToolInstance } from './store/annotation/types';
import {
  GetFileData,
  OnSave,
  OnSubmit,
  IFileItem,
  OnPageChange,
  OnStepChange,
  LoadFileList,
} from './types/data';
import { Footer, Header, Sider } from './types/main';
import { IStepInfo } from './types/step';
import loacalforage from 'localforage';
import { BasicConfig,Attribute,OneTag, TextConfig } from '@/interface/toolConfig';

interface IAnnotationStyle {
  strokeColor: string;
  fillColor: string;
  textColor: string;
  toolColor: any;
}

export interface AppProps {
  exportData?: (data: any[]) => void;
  goBack?: (data:any) => void;
  imgList?: IFileItem[];
  config?: string;
  stepList?: IStepInfo[];
  step?: number;
  onSubmit?: OnSubmit;
  onSave?: OnSave;
  onPageChange?: OnPageChange;
  onStepChange?: OnStepChange;
  getFileData?: GetFileData;
  pageSize?: number;
  loadFileList?: LoadFileList;
  headerName?: string;
  initialIndex?: number;
  className?: string;
  toolInstance?: ToolInstance;
  currentToolName?:string; // redux
  header?: Header;
  footer?: Footer;
  sider?: Sider;
  style?: {
    layout?: { [key: string]: any };
    header?: { [key: string]: any };
    sider?: { [key: string]: any };
    footer?: { [key: string]: any };
  };
  setToolInstance?: (tool: ToolInstance) => void;
  mode?: 'light' | 'dark'; // 临时需求应用于 toolFooter 的操作
  showTips?: boolean; // 是否展示 tips
  defaultLang?: 'en' | 'cn'; // 国际化设置
  leftSider?: React.ReactNode | React.ReactNode;
  tagConfigList?: OneTag[]; // 配置tag 信息，工具共享一套tag
  attributeList?: Attribute[]; // 标签配置选项，工具共享一套标签
  toolsBasicConfig: BasicConfig[]; // 多工具配置
  textConfig:TextConfig;
  // 标注信息扩展的功能
  dataInjectionAtCreation?: (annotationData: any) => {};
  // 渲染增强
  renderEnhance?: {
    staticRender?: (canvas: HTMLCanvasElement, data: any, style: IAnnotationStyle) => void;
    selectedRender?: (canvas: HTMLCanvasElement, data: any, style: IAnnotationStyle) => void;
    creatingRender?: (canvas: HTMLCanvasElement, data: any, style: IAnnotationStyle) => void;
  };
}

const App: React.FC<AppProps> = (props) => {
  const {
    imgList,
    step = 1,
    stepList = [],
    onSubmit,
    onSave,
    currentToolName,
    onPageChange,
    onStepChange,
    initialIndex = 0,
    toolInstance,
    tagConfigList,
    attributeList,
    toolsBasicConfig,
    textConfig,
    setToolInstance,
    getFileData,
    pageSize = 10,
    loadFileList,
    defaultLang = 'cn',
  } = props;

  const dispatch = useDispatch()
  // const [currentTool, setCurrentTool] = useState<string>('rectTool');


  useEffect(() => {
    if (
      (props.stepList && props.stepList.length > 0) ||
      (props.toolsBasicConfig && props.toolsBasicConfig.length > 0)
    ) {
      let initToolName = currentToolName;
      let findToolConfigByToolName =  toolsBasicConfig.filter((item)=>{
        return item.tool === currentToolName
      })
      // 当工具配置中不包含currentToolName时，重置currentToolName
      if(findToolConfigByToolName.length === 0){
        initToolName = toolsBasicConfig[0].tool;
        dispatch(ChangeCurrentTool(initToolName));
      }
      store.dispatch(
        InitTaskData({
          initToolName,
          onSubmit,
          stepList,
          tagConfigList,
          attributeList,
          toolsBasicConfig,
          textConfig,
          step,
          getFileData,
          pageSize,
          loadFileList,
          onSave,
          onPageChange,
          onStepChange,
        }),
      );

      initImgList();
      // 初始化国际化语言
      i18n.changeLanguage(defaultLang);
    }
  }, [props.toolsBasicConfig,props.attributeList,props.textConfig,props.tagConfigList, currentToolName]);

  useEffect(() => {
    if (toolInstance) {
      setToolInstance?.(toolInstance);
    }
  }, [toolInstance]);

  // 初始化imgList 优先以loadFileList方式加载数据
  const initImgList = () => {
    if (loadFileList) {
      loadImgList(store.dispatch, store.getState, initialIndex, true).then((isSuccess) => {
        if (isSuccess) {
          store.dispatch(LoadFileAndFileData(initialIndex));
        }
      });
    } else if (imgList && imgList.length > 0) {
      store.dispatch({
        type: ANNOTATION_ACTIONS.UPDATE_IMG_LIST,
        payload: {
          imgList,
        },
      });
      // 页数持久化
      loacalforage.getItem('nextIndex', (error, value) => {
        if (value) {
          store.dispatch(LoadFileAndFileData(value as number));
        } else {
          store.dispatch(LoadFileAndFileData(initialIndex));
        }
      });
    }
  };

  return (
    <div>
      <MainView {...props} currentToolName={currentToolName as string} />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  toolInstance: state.annotation.toolInstance,
  currentToolName:state.annotation.currentToolName
});

export default connect(mapStateToProps)(App);
