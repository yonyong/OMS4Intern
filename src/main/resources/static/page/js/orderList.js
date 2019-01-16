let orderList = new Vue({
    el: '#orderList',
    data: function () {
        return {
            //分页数据
            page:{
                pageSize:5,
                pageNum:1,
            },
            orderId:"",
            orderListDate:[],
            //选中行的记录id
            checkedNames:[],
            //搜索输入框
            searchInput:"",
            //异常单数据
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
            //yonyongi添加
            //订单商品详情，用于退换货选择数量信息
            orderGoodsInfo : [],
            //用于判断按钮点击事件为退货还是换货
            returnType : '',
            //用于存放订单商品原本的商品数量,用于验证退换货数量异常
            beforeGoodsNum : []
        }
    },
    created: function () {
        this.initTable();
    },



    methods: {
        //初始化表格
        initTable(){
            let url='/getAllOrder';
            callAxiosGet(url,this.page,this.getListSuc,this.Fail);
        },
        //初始化
        refresh(){
            this.initialize();
            this.initTable();
        },

       /* checkOrder(){
             let url='/getAllOrder';
             callAxiosGet(url,{abnormalId:this.checkedDate},this.detailSuc,this.Fail)
            console.log(this.checkedDate);
            document.getElementById('iframeId3').src="/getAllById?orderId="+this.checkedDate;
        },*/


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

        // 路由操作接口 Jay新增 2019/1/16
        updateRoute(){
            this.orderId=this.checkedNames[0];
            let url='/UpdateOrderIntoWaitOutPut';
            callAxiosGet(url,{id:this.orderId},this.Suc,this.Fail)
        },
        //异常处理
        abnormalHandle(){
            let url='/abnormalHandle';
            callAxiosGet(url,{abnormalId:this.checkedNames[0]},this.Suc,this.Fail)
        },
        // 出库操作，将订单出库 Jay新增 2019/1/16
        outputOrder(){
            this.orderId=this.checkedNames[0];
            let url='/Output';
            callAxiosGet(url,{id:this.orderId},this.Suc,this.Fail)
        },

        //订单详情
        orderDetails(){
            this.orderId=this.checkedNames[0];
            console.log(this.orderId);
            document.getElementById('iframeId3').src="/orderDetail?orderId="+this.orderId;
        },


        to_page(pn) {
            let that=this;
            axios.get('/getAllOrder', {
                params: {
                    pageNum:pn,
                    pageSize: that.page.pageSize
                }
            }).then(res => {
                console.log(res);
                that.orderListDate = res.data.data;
            }, err => {
                console(err);
            })
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
            let that=this;
            if(res.status===200){
                that.orderListDate=res.data;
                console.log(that.orderListDate);
                //默认选中第一条数据
                that.checkedDate[0]=res.data.list[0].abnormalId;

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

        },
        orderCheck(){
            this.orderId=this.checkedNames[0];
            let url='/orderCheck?orderId='+this.orderId;
            callAxiosGetNoParam(url,this.orderCheckSuc,this.orderCheckFail);
        },
        orderCheckSuc(res){
            alert(res.message);
            this.initTable()
        },
        orderCheckFail(res){
            alert("请先选择订单")
        },
        //yonyong添加
        //请求订单相关的商品详情
        toRequestForGoods (){
            var toRequestForGoods = this;
            var url = "getGoodsList";
            //获取触发该方法的按钮所属类别 return/exchange
            var e = window.event;
            var target = e.target||e.srcElement;
            var eventName = target.getAttribute("id");
            if ("return" === eventName){
                toRequestForGoods.returnType = "return";
            }else if ("exchange" === eventName){
                toRequestForGoods.returnType = "exchange";
            }
            console.log(toRequestForGoods.checkedNames[0]);
            if (toRequestForGoods.checkedNames.length === 0) {
                alert("请选择一条订单！");
                return false;
            }
            else if (toRequestForGoods.checkedNames.length > 1) {
                alert("只能对一条订单进行操作！");
                return false;
            }
            toRequestForGoods.orderId = toRequestForGoods.checkedNames[0];
            axios.get(url,{params: {orderId : toRequestForGoods.orderId}}).then(function(response) {
                toRequestForGoods.orderGoodsInfo=response.data.data;
                console.log(toRequestForGoods.orderGoodsInfo);
                for (var t = 0;t<toRequestForGoods.orderGoodsInfo.length;t++) {
                    console.log(toRequestForGoods.orderGoodsInfo[t][0]);
                    toRequestForGoods.$set(toRequestForGoods.orderGoodsInfo[t][0],"goodNum","0");
                }
            }).catch(function (err) {
                console.log(err);
            });
        },
        countDown (index){
            this.orderGoodsInfo[index][0].goodNum--
        },
        countUp (index){
            this.orderGoodsInfo[index][0].goodNum++
        },
        // 生成换货单
        exchangeReturn (){
            var exchangeReturn = this;
            this.orderId=this.checkedNames[0];
            var url = null;
            var data = null;
            console.log(exchangeReturn.returnType);
            if(!exchangeReturn.checkExchangeReturnIsNull(exchangeReturn.getExchangeReturnGoodsNum(exchangeReturn.orderGoodsInfo))){
                alert("既不退货又不换货，你是测试来找bug的吗！");
                return false;
            }
            if(!exchangeReturn.checkExchangeReturnIsOverFlow(exchangeReturn.getExchangeReturnGoodsNum(exchangeReturn.orderGoodsInfo))){
                return false;
            }
            if ("return" === exchangeReturn.returnType){
                url = 'return/addReturnOrder';
                console.log("orderId为:"+exchangeReturn.orderId);
                console.log("goodsId为:"+exchangeReturn.getExchangeReturnGoodsId(exchangeReturn.orderGoodsInfo));
                console.log("number为:"+exchangeReturn.getExchangeReturnGoodsNum(exchangeReturn.orderGoodsInfo));
                data = {
                    orderId : exchangeReturn.orderId,
                    goodsId : exchangeReturn.getExchangeReturnGoodsId(exchangeReturn.orderGoodsInfo)+"",
                    number : exchangeReturn.getExchangeReturnGoodsNum(exchangeReturn.orderGoodsInfo)+""
                };
            }else if ("exchange" === exchangeReturn.returnType){
                url = 'exchange/toGenerateExchangeOrder';
                console.log("orderId为:"+exchangeReturn.orderId);
                console.log("goodsId为:"+exchangeReturn.getExchangeReturnGoodsId(exchangeReturn.orderGoodsInfo));
                console.log("number为:"+exchangeReturn.getExchangeReturnGoodsNum(exchangeReturn.orderGoodsInfo));
                data = {
                    orderId : exchangeReturn.orderId,
                    goodId : exchangeReturn.getExchangeReturnGoodsId(exchangeReturn.orderGoodsInfo)+"",
                    num : exchangeReturn.getExchangeReturnGoodsNum(exchangeReturn.orderGoodsInfo)+""
                };
            }
            axios.get(url,{params: data}).then(function(response) {
                alert("操作成功！");
            }).catch(function (err) {
                alert("操作失败！");
            });
        },
        //获取退换货的商品id
        getExchangeReturnGoodsId(res) {
            var t = [];
            for (var i = 0; i<res.length;i++){
                t[i] = res [i][0].goodsId;
            }
            return t;
        },
        //获取退换货的数量
        getExchangeReturnGoodsNum(res){
            var t = [];
            for (var i = 0; i<res.length;i++){
                t[i] = res [i][0].goodNum;
            }
            return t;
        },
        //选择换货退货时退货换货数量为0
        checkExchangeReturnIsNull(goodsNum){
            for (var i = 0; i<goodsNum.length;i++){
                if (goodsNum[i] != 0){
                    return true;
                }
            }
            return false;
        },
        //检查选择换货退货数量是否超过原本的数量
        checkExchangeReturnIsOverFlow(goodsNum){
            var checkExchangeReturnIsOverFlow = this;
            var url = "exchange/getOrderGoodsNumsDetails";
            axios.get(url,{params: {orderId : checkExchangeReturnIsOverFlow.orderId}}).then(function(response) {
                var temp = response.data.data;
                for (var i = 0;i<temp.length;i++){
                    checkExchangeReturnIsOverFlow.beforeGoodsNum[i] = temp[i].num;
                }
            }).catch(function (err) {
                alert("获取后台原本订单商品数量时出现接口异常！");
                return false;
            });
            for (var p = 0; p<checkExchangeReturnIsOverFlow.beforeGoodsNum.length;p++){
                console.log("原来的："+checkExchangeReturnIsOverFlow.beforeGoodsNum[p]);
                console.log("现在的："+goodsNum[p]);
                if (checkExchangeReturnIsOverFlow.beforeGoodsNum[p]<goodsNum[p]){
                    alert("别太过分，Overflow了哦！");
                    return false;
                }
            }
            return true;
        }
}
});

