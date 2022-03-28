// 包含n个日期时间处理的工具函数模块

// 格式化日期
export const formateDate = (time) => {
    if (!time) return '';
    // 传入的time是一个时间戳
    // new Date() 之后的time是 Tue Aug 03 2021 20:40:25 GMT+0800 (GMT+08:00) 格式，因此要通过下列方法获取
    let date = new Date(time);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}` 
}
