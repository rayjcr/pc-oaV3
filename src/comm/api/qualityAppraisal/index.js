import fetch from '../../script/utils/fetch';
// const prea = '/api/base/' // base拼接
// const prejlk = '/api/jlk/' // jlk 拼接
// const preQuality = '/api/quality'
const preQuality = '/api/evaluation'
const test = '/test'


/** 获取综合素质评价项目的全局配置(只限开关数据) **/
export function getConfig(query) {
  return fetch({
    url: `${preQuality}/configuration/getConfig`,
    method: 'get',
    data: query
  });
}

/** 保存综合素质评价项目的全局配置(只限开关数据) **/
export function saveConfig(query) {
    return fetch({
        url: `${preQuality}/configuration/saveConfig`,
        method: 'post',
        data: query
    });
}

/** 获取综合素质评价项目的全局配置(目前包括评价消息推送和评价撤回配置) **/
export function getDictConfig(query) {
  return fetch({
    url: `${preQuality}/configurationDict/getConfig`,
    method: 'get',
    data: query
  });
}

/** 保存综合素质评价项目的全局配置(目前包括评价消息推送和评价撤回配置) **/
export function saveDictConfig(query) {
  return fetch({
    url: `${preQuality}/configurationDict/saveConfig`,
    method: 'post',
    data: query
  });
}

/** 获取教师评价提醒设置 **/
export function getNotifyConfig(query) {
    return fetch({
      url: `${preQuality}/notifyConfiguration/getConfig`,
      method: 'get',
      data: query
    });
}

/** 保存教师评价提醒设置 **/
export function saveNotifyConfig(query) {
    return fetch({
        url: `${preQuality}/notifyConfiguration/saveConfig`,
        method: 'post',
        data: query
    });
}

/** 保存勋章数量分配设置 **/
export function saveMedalAllotConfig(query) {
    return fetch({
        url: `${preQuality}/notifyConfiguration/saveMedalAllotConfig`,
        method: 'post',
        data: query
    });
}

// /** 全部学校荣誉设置 **/
// export function getHonorSetting(query) {
//     return fetch({
//         url: `${preQuality}/classHonorSetting/getInfo`,
//         method: 'get',
//         data: query
//     });
// }

/** 获取班级荣誉设置 */
export function getClassHonorSetting(query) {
    return fetch({
        url: `${preQuality}/classHonorSetting/getInfo`,
        method: 'get',
        data: query
    });
}

/** 班级荣誉设置修改或添加 **/
export function classHonorSetting(query) {
    return fetch({
        url: `${preQuality}/classHonorSetting/addOrUpdate`,
        method: 'post',
        data: query
    });
}

/** 删除班级荣誉项(手动奖励部分) **/
export function delClassHonor(query) {
    return fetch({
        url: `${preQuality}/classHonor/del/`+query,
        method: 'get',
        // data: query
    });
}

/** 获取勋章数量分配详情 **/
export function getMedalAll(query) {
    return fetch({
        url: `${preQuality}/medalAllot/getMedalAllotConfig`,
        method: 'get',
        params: query
    });
}

/** 保存勋章数量分配详情 **/
export function saveMedalAll(query) {
    return fetch({
        url: `${preQuality}/medalAllot/saveMedalAllotConfig`,
        method: 'POST',
        data: query
    });
}







/** 商品-分页列表 **/
export function getGoodsListPage(query) {
    return fetch({
        url: `${preQuality}/goods/listPage`,
        method: 'post',
        data: query
    });
}

/** 商品-保存(新增,修改) **/
export function saveGoods(query) {
    return fetch({
        url: `${preQuality}/goods/saveOrUpdate`,
        method: 'post',
        data: query
    });
}

/** 商品-删除 **/
export function deleteGoods(query) {
    return fetch({
        url: `${preQuality}/goods/delete?goodsId=`+query,
        method: 'post',
        data: query
    });
}

/** 商品-类别列表 **/
export function getGoodsTypeList(query) {
    return fetch({
        url: `${preQuality}/goodsType/list`,
        method: 'get',
        params: query
    });
}

/** 商品类别 -保存(新增,修改) **/
export function saveGoodsType(query) {
    return fetch({
        url: `${preQuality}/goodsType/saveOrUpdate`,
        method: 'post',
        data: query
    });
}

/** 商品类别 -删除 **/
export function deleteGoodsType(query) {
    return fetch({
        url: `${preQuality}/goodsType/delete?id=`+query,
        headers:{'Content-Type':'application/json'},
        method: 'post',
        data: query
    });
}

/** 商品设置或者取消首页展示 -删除 **/
export function setTop(query) {
    return fetch({
        url: `${preQuality}/goods/setTop`,
        headers:{'Content-Type':'application/json'},
        method: 'post',
        params: query
    });
}

/** 获取商品订单列表 **/
export function getGoodsOrder(query) {
    return fetch({
        url: `${preQuality}/goodsOrder/listPage`,
        method: 'post',
        data: query
    });
}

/** 修改订单状态 **/
export function changeGoodsStatus(query) {
  return fetch({
    url: `${preQuality}/goodsOrder/changeOrderStatus`,
    method: 'post',
    data: query
  });
}

/** 导出订单列表 **/
export function exportOrderRecord(query) {
  return fetch({
    url: `${preQuality}/goodsOrder/static/exportOrderList`,
    method: 'post',
    data: query,
    responseType: 'arraybuffer'
  });
}

/** 获取值周列表 **/
export function getWeekPage(query) {
    return fetch({
        url: `${preQuality}/week/getPage`,
        method: 'get',
        params: query
    });
}

/** 获取值周详细信息 **/
export function getWeekDetail(query) {
    return fetch({
        url: `${preQuality}/week/getWeekGroup/`+query,
        method: 'get',
        params: query
    });
}

/** 调整值周教师 */
export function updateWeekTeacher(query) {
    return fetch({
        url: `${preQuality}/week/updateWeekTeacher/`+query.weekId,
        method: 'put',
        data: query
    });
}

/** 更新周次时间 */
export function updateWeekTime(query) {
    return fetch({
        url: `${preQuality}/week/updateWeekTime`,
        method: 'post',
        data: query
    });
}

/** 分页查询采集规则 */
export function getRuleItem(query) {
    return fetch({
        url: `${preQuality}/ruleItem/getPage`,
        method: 'get',
        params: query
    });
}

/** 新建采集规则 */
export function addRuleItem(query) {
    return fetch({
        url: `${preQuality}/ruleItem/add`,
        method: 'post',
        data: query
    });
}

/** 删除采集规则 */
export function delRuleItem(query) {
    return fetch({
        url: `${preQuality}/ruleItem/del/`+query,
        method: 'delete',
        // data: query
    });
}

/** 修改采集规则 */
export function updateRuleItem(query) {
    return fetch({
        url: `${preQuality}/ruleItem/update/`+query.ruleId,
        method: 'put',
        data: query
    });
}

/** 获取详细采集规则 */
export function getRuleItemDetail(query) {
    return fetch({
        url: `${preQuality}/ruleItem/get/`+query,
        method: 'get',
        // data: query
    });
}


/**分页获取所有教师评价统计 */
export function getEvaluationRecord(query){
    return fetch({
        url: `${preQuality}/evaluationRecord/getAllStatisticsPage`,
        method: 'get',
        params: query
    });
}

/**分页获取评价日志 */
export function getTeacherLog(query){
    return fetch({
        url: `${preQuality}/evaluationRecord/getTeacherEvaluationLog`,
        method: 'POST',
        data: query
    });
}

/**导入周次数据 */
export function importWeekData(query){
    return fetch({
        url: `${preQuality}/week/importWeekData`,
        method: 'POST',
        data: query
    });
}


/**个人评价统计 */
export function userStatistics(query){
    return fetch({
        url: `${preQuality}/userStatistics/pageList`,
        method: 'post',
        data: query
    });
}
/**按勋章等级导出个人评价统计 */
export function exportLvMedalRecord(query){
    return fetch({
        url: `${preQuality}/userStatistics/static/exportLvMedalRecord`,
        method: 'post',
        data: query,
        responseType: 'arraybuffer'
    });
}
/**按勋章类型导出个人评价统计 */
export function exportDimensionMedalRecord(query){
    return fetch({
        url: `${preQuality}/userStatistics/static/exportDimensionMedalRecord`,
        method: 'post',
        data: query,
        responseType: 'arraybuffer'
    });
}


/**班级评价统计 */
export function classStatistics(query){
    return fetch({
        url: `${preQuality}/classStatistics/pageList`,
        method: 'post',
        data: query
    });
}

/**评价审核列表 */
export function evaluationRecodeItem(query){
    return fetch({
        url: `${preQuality}/evaluationRecodeItem/pageListByStaffNo`,
        method: 'post',
        data: query
    });
}

/**评价审核 */
export function audit(query){
    return fetch({
        url: `${preQuality}/evaluationRecord/audit`,
        method: 'get',
        params: query
    });
}

/**评价批量审核 */
export function batchaudit(query){
    return fetch({
        url: `${preQuality}/evaluationRecord/auditBatch`,
        method: 'post',
        params: query
    });
}
/**根据班级代码查询班级信息 */
export function getClass(query){
    return fetch({
        url: `/api/base/jcBjsj/selectBjListById`,
        method: 'get',
        params: query
    });
}


/**分页获取班级荣誉统计集合 */
export function classHonor(query){
    return fetch({
        url: `${preQuality}/classHonorRecord/getList`,
        method: 'get',
        params: query
    });
}

/**获取全校荣誉项 */
export function classHonorList(query){
    return fetch({
        url: `${preQuality}/classHonor/getAll`,
        method: 'get',
        params: query
    });
}
/**保存荣誉 */
export function publishHonor(query){
    return fetch({
        url: `${preQuality}/classHonorRecord/addOrUpdate`,
        method: 'post',
        data: query
    });
}
/**手动发布荣誉 */
export function publishReward(query){
    return fetch({
        url: `${preQuality}/classHonorRecord/publish`,
        method: 'post',
        data: query
    });
}

/**创建二维码*/
export function createQRcode(query){
    return fetch({
        url: `${preQuality}/evaluationQR/addInfo`,
        method: 'post',
        data: query
    });
}
/**删除二维码*/
export function deleteQRcode(query){
    return fetch({
        url: `${preQuality}/evaluationQR/delete?id=`+query,
        method: 'post',
        // data: query
    });
}
/**获取二维码列表*/
export function getQRcodeList(query){
    return fetch({
        url: `${preQuality}/evaluationQR/getPageList`,
        method: 'post',
        data: query
    });
}
/**下载二维码*/
export function downloadQRcode(query){
    return fetch({
        url: `${preQuality}/evaluationQR/download`,
        method: 'post',
        params: query,
        responseType: 'arraybuffer',
        timeout: 0
    });
}
/**修改二维码状态*/
export function changeQRcodeStatus(query){
    return fetch({
        url: `${preQuality}/evaluationQR/updateStatus`,
        method: 'post',
        data: query
    });
}

/**获取自定义角色的列表*/
export function getCustomroleAll(query){
    return fetch({
        url: `${preQuality}/customrole/list`,
        method: 'get',
        params: query
    });
}

/**系统角色的列表*/
export function getSystemroleAll(query){
    return fetch({
        url: `${preQuality}/customrole/systemList`,
        method: 'get',
        params: query
    });
}


/**新建角色*/
export function addCustomrole(query){
    return fetch({
        url: `${preQuality}/customrole/add`,
        method: 'post',
        data: query
    });
}

/**更新角色*/
export function editCustomrole(query){
    return fetch({
        url: `${preQuality}/customrole/edit`,
        method: 'post',
        data: query
    });
}

/**删除角色*/
export function delCustomrole(query){
    return fetch({
        url: `${preQuality}/customrole/remove`,
        method: 'get',
        params: query
    });
}

/**获取相关评价项*/
export function getEvaluation(query){
    return fetch({
        url: `${preQuality}/evaluationItemJurisdiction/listHaveJurisdictionEvaluation`,
        method: 'get',
        params: query
    });
}

/**保存指定角色所拥有的评价项*/
export function saveEvaluation(query){
    return fetch({
        url: `${preQuality}/evaluationItemJurisdiction/SaveHaveJurisdictionEvaluation`,
        method: 'post',
        data: query
    });
}

/**保存任课老师拥有的评价项*/
export function saveTeacherEvaluation(query){
    return fetch({
        url: `${preQuality}/evaluationItemJurisdiction/SaveCourseHaveJurisdictionEvaluation`,
        method: 'post',
        data: query
    });
}

/**获取自定义角色权限列表*/
export function getRulePermission(query){
    return fetch({
        url: `${preQuality}/operationpermission/permittedlist`,
        method: 'get',
        params: query
    });
}

/**自定义角色授权*/
export function saveRulePermission(query){
    return fetch({
        url: `${preQuality}/operationpermission/grant`,
        method: 'post',
        data: query
    });
}

/**获取团队权限*/
export function getRuleTeam(query){
    return fetch({
        url: `${preQuality}/studentGroupPermission/get/`+query,
        method: 'get',
    });
}

/**保存团队权限*/
export function saveRuleTeam(query){
    return fetch({
        url: `${preQuality}/studentGroupPermission/save`,
        method: 'post',
        data: query
    });
}

/**分页获取操作日志*/
export function getLogPage(query){
    return fetch({
        url: `${preQuality}/evaluationLog/getLogPage`,
        method: 'post',
        data: query
    });
}

/**操作日志列表导出*/
export function exportLog(query){
    return fetch({
        url: `${preQuality}/evaluationLog/static/exportLog`,
        method: 'post',
        responseType: 'arraybuffer',
        data: query
    });
}


/** 获取教师剩余勋章数量 */
export function getTeacherMedalNum(query){
  return fetch({
      url: `${preQuality}/teacherMedalNumber/getTeacherMedalNum`,
      method: 'get',
      params: query
  });
}

/** 获取教师剩余勋章数量 */
export function setTeacherMedalNum(query){
  return fetch({
      url: `${preQuality}/teacherMedalNumber/adjustMedalNum`,
      method: 'post',
      data: query
  });
}



/** 以班级为单位查询报告单寄语录入情况 */
export function getReportMessageClassEntryStatus(query){
  return fetch({
      url: `${preQuality}/report/getReportMessageClassEntryStatus`,
      method: 'get',
      params: query
  });
}


/** 获取学生报告单寄语 */
export function getReportMessageByStudent(query){
  return fetch({
      url: `${preQuality}/report/getReportMessageByStudent`,
      method: 'get',
      params: query
  });
}
/** 当前学期报告单寄语导入模板 */
export function reportMessageImportTemplate(query){
    return fetch({
        url: `${preQuality}/report/reportMessageImportTemplate`,
        method: 'get',
        responseType: 'arraybuffer',
        params: query
    });
}


/** 保存报告单寄语 */
export function saveReportMessage(query){
    return fetch({
        url: `${preQuality}/report/saveReportMessage`,
        method: 'post',
        data: query
    });
}
