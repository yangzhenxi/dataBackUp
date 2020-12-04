import pick from 'lodash.pick'
import moment from 'moment'
import { deepGet, convert, toDict } from '@/utils/util'

const mixinTable = {
    data () {
        return {
            advanced: false,
            queryParam: {},
            selectedRowKeys: [],
            selectedRows: [],
			deleteInput: null,
			dataList: [
				{ title: '签约', value: 0 },
				{ title: '转诊', value: 1 }
			],
			filterData: [
				{ name: '全部', value: 'All' },
				{ name: '数据量一致', value: 'On' },
				{ name: '数据量不一致', value: 'OFF' }
			],
			districtList: [
				{ code: '', town: '全部' },
                { code: '3303', town: '温州市(其他)' },
                { code: '330301', town: '市本级' },
                { code: '330302', town: '鹿城区' },
                { code: '330303', town: '龙湾区' },
                { code: '330304', town: '瓯海区' },
                { code: '330322', town: '洞头县' },
                { code: '330324', town: '永嘉县' },
                { code: '330326', town: '平阳县' },
                { code: '330328', town: '文成县' },
                { code: '330329', town: '泰顺县' },
                { code: '330381', town: '瑞安市' },
                { code: '330382', town: '乐清市' },
                { code: '330399', town: '经开区' }
			],
			statusList: [
				{ key: 'all', val: '全部', color: '#1890ff' },
				{ key: '0', val: '待审批', color: '#1890ff' },
				{ key: '1', val: '已审', color: '#1890ff' },
				{ key: '2', val: '同意接收', color: '#1890ff' },
				{ key: '3', val: '待提交', color: '#1890ff' },
				{ key: '4', val: '结案', color: '#1890ff' },
				{ key: '5', val: '拒绝转出', color: '#1890ff' },
				{ key: '6', val: '作废', color: '#1890ff' },
				{ key: '7', val: '同意转出', color: '#1890ff' },
				{ key: '8', val: '拒绝接收', color: '#1890ff' },
				{ key: '9', val: '取消预约', color: '#1890ff' },
				{ key: '10', val: '撤销审批', color: '#1890ff' },
				{ key: '11', val: '终止转诊', color: '#1890ff' },
				{ key: '99', val: '其他', color: '#1890ff' }
			]
        }
    },
    computed: {
        x: {
            get () {
                return this.columns.reduce((pre, cur) => pre + cur.width, 0)
            },
            set (x) {
                return x
            }
        }
    },
    methods: {
        onSelectChange (selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        handleOk (bool = true) {
            this.selectedRowKeys = []
            this.selectedRows = []
            this.$refs.table.refresh(bool)
        },
        toggleAdvanced () {
            this.advanced = !this.advanced
        },
        handleTreeOk () {
            this.obj = {}
            this.ouList = []
		},
		disabledDate (current) {
			return current && current > moment().endOf('day')
		},
        deepGet,
        convert,
        toDict
    }
}

const mixinFormModal = {
    data () {
        return {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 }
            },
            visible: false,
            loading: false,
            confirmLoading: false,
            form: this.$form.createForm(this),
            record: null,
            sid: null,
            id: null
        }
    },
    methods: {
        handleCancel () {
            this.visible = false
        },
        deepGet,
        pick,
        convert,
        toDict
    }
}

const mixin = {
    data () {
        return {
            ou: 'ou=Users,ou=Citrix,dc=cloud,dc=com'
            // cn:''
        }
    },
    methods: {
        deepGet,
        pick,
        convert,
        toDict
    }
}

export {
    mixinTable,
    mixinFormModal,
    mixin
}
