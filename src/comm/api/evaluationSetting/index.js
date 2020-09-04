import fetch from '../../script/utils/fetch';
const prea = '/api/base/' // base拼接
const quality = '/api/evaluation'

/**
 * 维度接口
 */
  // 获取所有维度
  export function getAllDimension(params) {
    return fetch({
      url: `${quality}/dimensionItem/getAll`,
      method: 'get',
      params
    });
  }
  // 分页查询维度数据 维度名称模糊查询---没有了
  export function getDimensionByName(query) {
    return fetch({
      url: `${quality}/dimensionItem/getPage`,
      method: 'get',
      params: query
    });
  }
  // 增加维度
  export function addDimension(query) {
    return fetch({
      url: `${quality}/dimensionItem/add`,
      method: 'post',
      data: query
    });
  }
  // 删除维度
  export function deleteDimension(id) {
    return fetch({
      url: `${quality}/dimensionItem/del/${id}`,
      method: 'delete',
      // data: query
    });
  }
  // 修改维度
  export function updateDimension(id,data) {
    return fetch({
      url: `${quality}/dimensionItem/update/${id}`,
      method: 'put',
      data
    });
  }

/**
 * 勋章接口
 */
  //获取所有勋章数据
  export function getAllMedal() {
    return fetch({
      url: `${quality}/medalItem/getAll`,
      method: 'get',
    });
  }
  //分页查勋章章数据
  export function getMedalByPage(params) {
    return fetch({
      url: `${quality}/medalItem/getPage`,
      method: 'get',
      params
    });
  }
  //获取勋章详情
  export function getMedalDetails(id) {
    return fetch({
      url: `${quality}/medalItem/getDetails/${id}`,
      method: 'get',
    });
  }
  //添加勋章
  export function addMedal(data) {
    return fetch({
      url: `${quality}/medalItem/add`,
      method: 'post',
      data
    });
  }
  //删除勋章
  export function deleteMedal(id) {
    return fetch({
      url: `${quality}/medalItem/del/${id}`,
      method: 'delete',
    });
  }
  //修改勋章
  export function updateMedal(id,data) {
    return fetch({
      url: `${quality}/medalItem/update/${id}`,
      method: 'put',
      data
    });
  }

/**
 * 人物等级接口
 */
  //获取所有人物等级数据
  export function getAllCharacter() {
    return fetch({
      url: `${quality}/characterItem/getAll`,
      method: 'get',
    });
  }
  //分页查人物等级数据
  export function getCharacterByPage(params) {
    return fetch({
      url: `${quality}/characterItem/getPage`,
      method: 'get',
      params
    });
  }
  //获取人物等级详情
  export function getCharacterDetails(id) {
    return fetch({
      url: `${quality}/characterItem/get/${id}`,
      method: 'get',
    });
  }
  //添加人物等级
  export function addCharacter(data) {
    return fetch({
      url: `${quality}/characterItem/add`,
      method: 'post',
      data
    });
  }
  //删除人物等级
  export function deleteCharacter(id) {
    return fetch({
      url: `${quality}/characterItem/del/${id}`,
      method: 'delete',
    });
  }
  //修改人物等级
  export function updateCharacter(id,data) {
    return fetch({
      url: `${quality}/characterItem/update/${id}`,
      method: 'put',
      data
    });
  }
  //获取所有等级数据
  export function getAllGrade(params) {
    return fetch({
      url: `${quality}/gradeItem/getAll`,
      method: 'get',
      params
    });
  }
  //获取前一个等级的数据
  export function getPreMedalDetails(params) {
    return fetch({
      url: `${quality}/medalItem/getPreMedalDetails`,
      method: 'get',
      params
    });
  }
/**
 * 评价项接口
 */
  //评价项分页列表
  export function getEvaluationByPage(params) {
    return fetch({
      url: `${quality}/evaluationItem/custom/page`,
      method: 'get',
      params
    });
  }
  //评价项列表
  export function getEvaluationList(params) {
    return fetch({
      url: `${quality}/evaluationItem/custom/list`,
      method: 'get',
      params
    });
  }
  //获取单个评价项信息
  export function getEvaluation(id) {
    return fetch({
      url: `${quality}/evaluationItem/custom/${id}`,
      method: 'get',
    });
  }
  //用户未完成任务列表
  export function getUnfinishedTasks(id) {
    return fetch({
      url: `${quality}/evaluationItem/custom/unfinishedTasks/${id}`,
      method: 'get',
    });
  }
  //添加评价项
  export function addEvaluation(data) {
    return fetch({
      url: `${quality}/evaluationItem/custom`,
      method: 'post',
      data
    });
  }
  //修改评价项
  export function updateEvaluation(data) {
    return fetch({
      url: `${quality}/evaluationItem/custom`,
      method: 'put',
      data
    });
  }
  //删除评价项
  export function deleteEvaluation(id) {
    return fetch({
      url: `${quality}/evaluationItem/custom/${id}`,
      method: 'delete',
    });
  }
  /** 获取综合素质评价项目的全局配置(只限开关数据) **/
  export function getConfig(query) {
    return fetch({
      url: `${quality}/configuration/getConfig`,
      method: 'get',
      data: query
    });
  }

/**
 * 采集规则接口
 */
  //分页查询采集规则
  export function getRuleByPage(params) {
    return fetch({
      url: `${quality}/ruleItem/getPage`,
      method: 'get',
      params
    });
  }
  //获取所有采集规则
  export function getAllRule() {
    return fetch({
      url: `${quality}/ruleItem/getAll`,
      method: 'get',
    });
  }
  //获取采集规则详情
  export function getRuleDetail(id) {
    return fetch({
      url: `${quality}/ruleItem/get/${id}`,
      method: 'get',
    });
  }
  //添加采集规则
  export function addRule(data) {
    return fetch({
      url: `${quality}/ruleItem/add`,
      method: 'post',
      data
    });
  }
  //修改采集规则
  export function updateRule(id,data) {
    return fetch({
      url: `${quality}/ruleItem/update/${id}`,
      method: 'put',
      data
    });
  }
  //删除采集规则
  export function deleteRule(id) {
    return fetch({
      url: `${quality}/ruleItem/del/${id}`,
      method: 'delete',
    });
  }
  //录入型评价项导入模板
  export function evaluationImportTemplate() {
    return fetch({
      url: `${quality}/evaluationItem/enterImportTemplate`,
      method: 'get',
      responseType: 'arraybuffer'
    });
  }
  //录入型评价项导入
  export function evaluationImport(params) {
    return fetch({
      url: `${quality}/evaluationItem/enterImport`,
      method: 'post',
      data:params
    });
  }

    //新增活动报名
    export function addActivity(params) {
      return fetch({
        url: `${quality}/evaluation/activity/addActivity`,
        method: 'post',
        data:params
      });
    }

    //获取活动报名列表
    export function getActivity(params) {
      return fetch({
        url: `${quality}/evaluation/activity/getAllActivity`,
        method: 'get',
        params:params
      });
    }

    //根据维度获取所有等级勋章
    export function getMedalByDimension(params) {
      return fetch({
        url: `${quality}/medalItem/getMedalDetailsByDimension`,
        method: 'get',
        params:params
      });
    }


    //根据活动id删除活动
    export function deleteActivity(activityId) {
      return fetch({
        url: `${quality}/evaluation/activity/delActivity/${activityId}`,
        method: 'delete',
        // params:params
      });
    }

    //获取活动报名信息
    export function getActivityRecord(params) {
      return fetch({
        url: `${quality}/evaluation/activityRecord/getActivityRecord/`+params,
        method: 'get',
        // params:params
      });
    }

     //获取活动报名信息
     export function delActivityRecord(params) {
      return fetch({
        url: `${quality}/evaluation/activityRecord/delActivityRecord/`+params.activityId+`/`+params.studentCode,
        method: 'delete',
        // params:params
      });
    }

    //获取活动详细信息
    export function getActivityDetails(params) {
      return fetch({
        url: `${quality}/evaluation/activity/getDetails/`+params,
        method: 'get',
        // params:params
      });
    }

    //修改活动报名
    export function updateActivity(params,id) {
      return fetch({
        url: `${quality}/evaluation/activity/updateActivity/`+id,
        method: 'put',
        data:params
      });
    }

    //获取团体列表
    export function getGroupList(params) {
      return fetch({
        // url: `${quality}/evaluationstudentgroup/getGroupList`,
        url: `${quality}/evaluationstudentgroup/getGroupListNoClassGroup`,
        method: 'get',
        params:params
      });
    }

    //获取团体类型
    export function getGroupTypeList(params) {
      return fetch({
        url: `${quality}/evaluationGroupType/getAll`,
        method: 'get',
        params:params
      });
    }

    //新增团体
    export function addTeam(params) {
      return fetch({
        url: `${quality}/evaluationstudentgroup/addGroup`,
        method: 'post',
        data:params
      });
    }

    //删除团体
    export function delTeam(id) {
      return fetch({
        url: `${quality}/evaluationstudentgroup/delGroup/`+id,
        method: 'delete',
        // data:params
      });
    }

    //修改团体
    export function updateTeam(params,groupId) {
      return fetch({
        url: `${quality}/evaluationstudentgroup/updateGroup/`+groupId,
        method: 'put',
        data:params
      });
    }



/**
 * 团体维护接口
 */
  // 获取所有维度
  export function getAllGroupType(params) {
    return fetch({
      url: `${quality}/evaluationGroupType/getAll`,
      method: 'get',
      params
    });
  }
  // 增加维度
  export function addGroupType(query) {
    return fetch({
      url: `${quality}/evaluationGroupType/addGroupType`,
      method: 'post',
      data: query
    });
  }
  // 删除维度
  export function deleteGroupType(id) {
    return fetch({
      url: `${quality}/evaluationGroupType/del/${id}`,
      method: 'delete',
      // data: query
    });
  }
  // 修改维度
  export function updateGroupType(id,params) {
    return fetch({
      url: `${quality}/evaluationGroupType/updateGroupType/${id}`,
      method: 'put',
      params
    });
  }
















