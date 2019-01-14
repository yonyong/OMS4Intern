let Abnormal = new Vue({
    el: '#abnormal',
    data: function () {
        return {
            //分页数据
            page:{
                pageSize:5,
                currentPage:1,
                abnormalState:'', orderId:'', abnormalType:'', modifiedUser:''
            },
            //选中行的记录id
            checkedDate:"",
            //搜索输入框
            searchInput:"",
            //异常单数据
            abnormalDate:[],
            goodsInfo:[],
            //默认选中
            selected: 'orderId',
            //下拉框选项
            options: [
                { text: '订单id', value: 'orderId' },
                { text: '异常类型', value: 'abnormalType' },
                { text: '异常状态', value: 'abnormalState' },
                { text: '修改人', value: 'modifiedUser' }
            ],
            //搜索条件
            searchDate:{
                abnormalState:'',
                orderId:'',
                abnormalType:'',
                modifiedUser:''
            },

            //模态框数据
            modalData:{
                goodsInfo:[],
                abnormalInfo:[],
            },
        }
    },
    created: function () {
        this.initTable();
    },



    methods: {
        //初始化表格
        initTable(){
            let url='/abnormalList';
            callAxiosGet(url,this.page,this.getListSuc,this.Fail)
        },
        //初始化
        refresh(){
            this.initialize();
            this.initTable();
        },
        //清空搜索条件
        initialize(){
            this.page.abnormalState='';
            this.page.orderId='';
            this.page.abnormalType='';
            this.page.modifiedUser='';
            this.searchDate.abnormalState='';
            this.searchDate.orderId='';
            this.searchDate.abnormalType='';
            this.searchDate.modifiedUser='';
        },
        //异常处理
        abnormalHandle(){
            let url='/abnormalHandle';
            /*console.log(this.checkedDate);*/
            callAxiosGet(url,{abnormalId:this.checkedDate},this.Suc,this.Fail)
        },
/*        //把当前行id存在缓存中
        toPageStorage(){
            sessionStorage.setItem("id", this.checkedDate);
            /!*console.log(sessionStorage.getItem("id"))*!/
        },*/

        //异常订单详情
        checkOrder(){
            let url='/abnormalDetail';
            callAxiosGet(url,{abnormalId:this.checkedDate},this.detailSuc,this.Fail)
        },


        //查询事件
        searchBtn(){
            if(this.selected==='orderId'){
                let reg = /^\d{1,10}$/;
                this.initialize();
                if (reg.test(this.searchInput)){
                    this.searchDate.orderId=this.searchInput;
                }else {
                    alert("输入错误");
                }
            }
            else if(this.selected==='abnormalState'){
                this.initialize();
                this.searchDate.abnormalState=this.searchInput;
            }
            else if(this.selected==='abnormalType'){
                this.initialize();
                this.searchDate.abnormalType=this.searchInput;
            }
            else {
                this.initialize();
                this.searchDate.modifiedUser=this.searchInput;
            }

           //查询条件
            this.page.currentPage=1;
            this.page.orderId=this.searchDate.orderId;
            this.page.abnormalState=this.searchDate.abnormalState;
            this.page.abnormalType=this.searchDate.abnormalType;
            this.page.modifiedUser=this.searchDate.modifiedUser;
            //初始化表格
            this.initTable();
        },

        detailSuc(res){
            let that=this;
            if(res.status===200){
                that.goodsInfo=res.data.goodsInfo;
                console.log("goodsInfo"+JSON.stringify(that.goodsInfo));
                console.log("abnormalDate"+JSON.stringify(that.abnormalDate));
            }else{
                alert(res.message);
            }
        },

        //异常订单列表接口反馈
        getListSuc(res){
            console.log(res);
            let that=this;
            if(res.status===200){
                that.abnormalDate=res.data.list;
                //默认选中第一条数据
                that.checkedDate=res.data.list[0].abnormalId;
                let url='/abnormalDetail';
                callAxiosGet(url,{abnormalId:res.data.list[0].abnormalId},that.detailSuc,that.Fail)
            }else{
                alert(res.message);
            }
        },

        //异常处理接口反馈
        //接口连通
        Suc(res){
            alert(res.message);
            this.initTable();
        },
        //接口未连通
        Fail(err){
            console.log("网络连接错误")
        },
    }
});

