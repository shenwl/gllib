# GLLIB
封装一些编写WebGL时的常用工具，及使用的示例项目

## 开始
### 下载  
```bash
git clone https://github.com/shenwl/gllib.git
cd gllib
npm install
npm start
```

### 打开
- 浏览器打开`http://localhost:3001`，浏览demo，侧边栏可选择demo
- demo项目会持续更新，新增项目后会增加侧边栏导航数量

![image](https://raw.githubusercontent.com/shenwl/gllib/master/static/demo.jpg)


## 项目结构介绍
|- demo (存放示例项目)  
|- lib  (存放类库代码)  
|- |- matrix (数学库，封装了4*4矩阵Matrix4，和向量Vector3、Vector4)  
|- |- model (一些WebGL API使用场景的封装)   
|- |- shape (一些形状的封装，如立方体，圆柱等)   
|- |- utils (其他常用工具封装)


