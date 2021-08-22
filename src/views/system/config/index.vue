<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">類型</label>
        <el-input
          v-model="query.type"
          clearable
          placeholder="類型"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">

          <el-form-item label="類型" prop="type">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="參數值" prop="value">
            <!--            <el-input v-model="form.value" style="width: 370px;" />-->
            <el-select v-model="form.value" placeholder="请选择">
              <template v-for="(value, key) in dict">
                <div v-if="key===form.type" :key="key">
                  <el-option
                    v-for="item in value"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </div>
              </template>
            </el-select>
          </el-form-item>

          <!--          <el-form-item label="類型" prop="type">-->
          <!--            <el-input v-model="form.type" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="啟用字典" prop="enableDic">-->
          <!--            <el-select v-model="form.enableDic" value-key="id" placeholder="请选择">-->
          <!--              <el-option-->
          <!--                v-for="item in dict.enable_dic"-->
          <!--                :key="item.id"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="參數" prop="value">-->
          <!--            <el-input v-model="form.value" style="width: 370px;" />-->
          <!--          </el-form-item>-->
          <el-form-item label="備註">
            <el-input v-model="form.remark" :rows="3" type="textarea" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="type" label="類型" />
        <el-table-column prop="value" label="參數" />
        <el-table-column prop="enableDic" label="啟用字典">
          <template slot-scope="scope">
            {{ dict.label.enable_dic[scope.row.enableDic] }}
          </template>
        </el-table-column>
        <el-table-column prop="updateBy" label="更新者" />
        <el-table-column prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="備註" />
        <el-table-column
          v-permission="['admin','sysConfig:edit','sysConfig:del']"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudSysConfig from '@/api/sysConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { getAllDictName } from '../../../api/system/dict'

const defaultForm = {
  configId: null,
  type: null,
  value: null,
  enableDic: null,
  createBy: null,
  updateBy: null,
  createTime: null,
  updateTime: null,
  remark: null
}
export default {
  name: 'SysConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // dicts: ['enable_dic', 'test'],
  dicts: [],
  cruds() {
    return CRUD({
      title: '系統參數',
      url: 'api/sysConfig',
      idField: 'configId',
      sort: 'configId,desc',
      crudMethod: { ...crudSysConfig }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'sysConfig:add'],
        edit: ['admin', 'sysConfig:edit'],
        del: ['admin', 'sysConfig:del']
      },
      rules: {
        type: [
          { required: true, message: '類型不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '參數不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'type', display_name: '類型' }
      ]
    }
  },
  create: function() {
    alert('beforeCreate')
    console.log(getAllDictName())
    // this.dicts = getAllDictName()
    getAllDictName().then(function(data) {
      this.dicts = data
    })
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
