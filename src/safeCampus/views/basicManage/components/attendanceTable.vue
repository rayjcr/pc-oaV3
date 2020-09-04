<template>
    <div class="attendTable">
        <div class="isRest">
            <span>星期一:</span> 
            <el-radio v-model="radio" label="1">上学</el-radio>
            <el-radio v-model="radio" label="2">休息</el-radio>
        </div>
        <table class="atTable" colspan='0' rowspan='0'>
            <tr><th colspan="2">进出校时间</th><th>有效打卡区间设置</th></tr>
            <tr><td rowspan="2" width="50">上<br>午</td><td>
                <span class="mr20">进校</span>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td><td>
                    <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker> - <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
                </td></tr>
            <tr><td>
                <span class="mr20">出校</span>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td><td>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker> - <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td></tr>
            <tr><td rowspan="2">下<br>午</td><td>
                <span class="mr20">进校</span>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td><td>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker> - <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td></tr>
            <tr><td>
                <span class="mr20">出校</span>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td><td>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker> - <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td></tr>
            <tr><td rowspan="2">晚<br>上</td><td>
                <span class="mr20">进校</span>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td><td>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker> - <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td></tr>
            <tr><td>
                <span class="mr20">出校</span>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td><td>
                <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker> - <el-time-picker class="timepicker" size="mini" v-model="value1" placeholder="选择时间点"></el-time-picker>
            </td></tr>
        </table>
        <div class="tc mt10">
            <el-button type="primary">保 存</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            radio:'1',
        }
    }
}
</script>

<style lang='scss' scoped>
.attendTable{
    width: 100%;
    .atTable{
        width: 100%;
        margin-top: 10px;
        border-collapse: collapse;
        td,th{
            border: 1px solid #e2e2e2;
            height: 40px;
            font-size: 14px;
            color: #666;
            text-align: center;
            .timepicker{
                width: 130px;
            }
        }
        th{
            background: #f8f8f8;
            font-size: 14px;
            color: #666;
        }
        td{
            padding: 15px 0;
        }
    }
}
.isRest{
    font-size: 14px;
    color: #666;
    span{
        padding-right: 10px;
    }
}
</style>