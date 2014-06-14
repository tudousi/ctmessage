ctmessage
=========

提供了alert、confirm和message的实现
<br><br>
如何使用：<br>
引入js和css文件<br>
调用下面代码实现一个基本的alert框<br>
ct.alert({<br>
	text: "hello world",<br>
	type: "alert"<br>
});<br>
<br>
调用方法<br>
ct.message({type, text, title, position, expire, callback})<br>
type是弹出框类型：<br>
  alert alert-error
  confirm confirm-error
  info info

title 标题文本
text  提示内容
position  type为info时  信息框对应的位置  top在顶部 bottom在底部
expire 信息框存活周期 type为info才有用
callback(result)  关闭窗口后的回调函数


