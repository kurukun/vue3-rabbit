// 封装购物车模块
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, findNewCartListAPI, delCartAPI } from '@/apis/cart'
export const useCartStore = defineStore('cart', () => {
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token)
    // 获取最新购物车列表action
    const updateNewList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }
    // 1.定义state - cartList
    const cartList = ref([])
    // 2.定义action - addCart
    const addCart = async (goods) => {
        const { skuId, count } = goods
        if (isLogin.value) {
            // 登入后的加入购物车逻辑
            await insertCartAPI({ skuId, count })
            updateNewList()
        } else {
            // 添加购物车操作
            // 已添加count + 1，反之直接push
            // 思路:通过skuId匹配cartList中的项,若有则添加过
            // find方法,回调的返回值若为true则返回那一项(浅拷贝)
            const item = cartList.value.find((item) => goods.skuId === item.skuId)
            if (item) {
                // 找到了
                item.count++
            } else {
                // 没找到
                cartList.value.push(goods)
            }
        }
    }
    // 删除购物车
    const delCart = async (skuId) => {
        if (isLogin.value) {
            // 调用接口实现接口购物车中的删除功能
            await delCartAPI([skuId])
            updateNewList()
        } else {
            // 思路:删除数组中的某一项 splice 或者 filter
            const idx = cartList.value.findIndex((item) => {
                return skuId === item.skuId
            })
            cartList.value.splice(idx, 1)
        }
    }

    // 清除购物车
    const clearCart = () => {
        cartList.value = []
    }

    // 单选功能
    const singleCheck = (skuId, selected) => {
        // 通过skuId找到要修改的项，之后再修改selected
        const item = cartList.value.find((item) => item.skuId === skuId)
        item.selected = selected
    }

    // 全选功能
    const allCheck = (selected) => {
        // 把cartList中的每一项都设置为当前的全选框状态
        cartList.value.forEach(item => item.selected = selected)
    }

    // 计算属性
    // 1.商品总数
    const allCount = computed(() => {
        return (cartList.value.reduce((a, c) => {
            return a + c.count
        }, 0))
    })
    // 2.总价格
    const allPrice = computed(() => {
        return (cartList.value.reduce((a, c) => {
            return a + c.count * c.price
        }, 0))
    })

    // 3.已选择数量
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
    // 4.已选择商品合计
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))

    // 是否全选
    const isAll = computed(() => {
        return cartList.value.every((item) => item.selected)
    })
    return {
        cartList,
        allCount,
        allPrice,
        isAll,
        selectedCount,
        selectedPrice,
        allCheck,
        addCart,
        delCart,
        singleCheck,
        clearCart,
        updateNewList
    }

}, {
    persist: true
})