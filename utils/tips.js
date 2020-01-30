function showErrModal(errCode) {
    wx.showModal({
        title: '抱歉，发生错误 (￣▽￣")',
        content: "错误代码：" + errCode,
        showCancel: false
    })
}

export {
    showErrModal
}