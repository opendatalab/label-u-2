import { RectOperation } from './core/toolOperation/rectOperation';
import TagOperation from './core/toolOperation/tagOperation';
import PointOperation from './core/toolOperation/pointOperation';
import LineToolOperation from './core/toolOperation/LineToolOperation';
import TextToolOperation from './core/toolOperation/TextToolOperation';
import PolygonOperation from './core/toolOperation/polygonOperation';
import MeasureOperation from './core/toolOperation/measureOperation';
import { BasicToolOperation } from './core/toolOperation/basicToolOperation';
import ViewOperation from './core/toolOperation/ViewOperation';

// Constant
import * as cAnnotation from './constant/annotation';
import * as cAnnotationTask from './constant/annotationTask';
import * as cKeyCode from './constant/keyCode';
import * as cStyle from './constant/style';
import * as cTool from './constant/tool';

// Utils
import TagUtils from './utils/tool/TagUtils';
import uuid from './utils/uuid';
import CommonToolUtils from './utils/tool/CommonToolUtils';
// TODO 后续将 Util 后缀 => Utils
import MarkerUtils from './utils/tool/MarkerUtils';
import RectUtils from './utils/tool/RectUtils';
import AxisUtils from './utils/tool/AxisUtils';
import DrawUtils from './utils/tool/DrawUtils';
import ImgUtils from './utils/ImgUtils';
import MathUtils from './utils/MathUtils';

// ToolListener
import DblClickEventListener from './utils/tool/DblClickEventListener'; // 暂时这样支持外部工具的使用

import AnnotationEngine from './core/index';

export { EToolName } from './constant/tool';

const toolUtils = CommonToolUtils;

// 工具对外暴露配置统一定义
export * from './interface/conbineTool';

export {
  // 各类图形操作
  RectOperation,
  TagOperation,
  PointOperation,
  LineToolOperation,
  PolygonOperation,
  TextToolOperation,
  BasicToolOperation,
  MeasureOperation,
  ViewOperation,
  // 固定操作
  cAnnotation,
  cAnnotationTask,
  cKeyCode,
  cStyle,
  cTool,
  // 工具包
  toolUtils,
  uuid,
  DblClickEventListener,
  CommonToolUtils,
  MarkerUtils,
  RectUtils,
  AxisUtils,
  TagUtils,
  DrawUtils,
  ImgUtils,
  MathUtils,
  AnnotationEngine,
};
