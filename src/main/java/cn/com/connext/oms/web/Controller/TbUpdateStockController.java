package cn.com.connext.oms.web.Controller;

import cn.com.connext.oms.commons.dto.BaseResult;
import cn.com.connext.oms.commons.dto.CodeTotalStockDTO;
import cn.com.connext.oms.service.TbGoodsListService;
import cn.com.connext.oms.service.TbUpdateStockService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>Title: TbUpdateStockController</p>
 * <p>Description: </p>
 *
 * @author zhaojun
 * @version 1.0.0
 * @Date 2019/1/8
 */
@RestController
public class TbUpdateStockController {
    @Autowired
    private TbUpdateStockService tbUpdateStockService;
    @Autowired
    private TbGoodsListService tbGoodsListService;
    /**
        * @Author: ZhaoJun
        * @Description: 将商品的sku与商品的库存封装在一个dto中进行接收，并更新库存信息
        * @Param:
        * @Return:
        * @Create: 2019/1/09 9:35
        */
    @PostMapping("updateTotalStock")
    @ApiOperation(value = "库存变更接口")
    public BaseResult updateTotalStock(@RequestBody List<CodeTotalStockDTO> codeTotalStockDtos){
        try {
            for (int i=0;i<codeTotalStockDtos.size();i++){
                Integer id =this.tbGoodsListService.findIdByCode(codeTotalStockDtos.get(i).getGoodsCode());
                if (null == id)
                { return BaseResult.fail(codeTotalStockDtos.get(i).getGoodsCode()+"不存在");
                }else {
                    this.tbUpdateStockService.updateStock(id, codeTotalStockDtos.get(i).getTotalStock());
                }
            }
            return BaseResult.success("成功");
        } catch (Exception e) {
            e.printStackTrace();
            return BaseResult.fail("服务器内部错误");
        }
    }
    /**
        * @Author: zhaojun
        * @Description: 更新可用库存与锁定库存
        * @Param: []
        * @Create: 2019/1/8 15:50
        */
    @GetMapping("updateLockdAndAvailable")
    @ApiOperation(value = "锁定库存，可用库存变更接口")
    public BaseResult updateLockdAndAvailable(int goodsId, int num ){
        try {
            /*更新锁定库存*/
            this.tbUpdateStockService.updateLockdAndAvailable(goodsId,num);
            /*获取可用库存*/
            int availableStock=this.tbUpdateStockService.getLocked(goodsId).getTotalStock()-this.tbUpdateStockService.getLocked(goodsId).getLockedStock();
            /*修改可用库存*/
            this.tbUpdateStockService.updateAvailable(goodsId,availableStock);
            return BaseResult.success("成功");
        } catch (Exception e) {
            e.printStackTrace();
            return BaseResult.fail("服务器内部错误");
        }
    }
}
