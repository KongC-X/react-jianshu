## 安装启动

```
npm install -g create-react-app
create-react-app jianshu
cd jianshu
npm start
```

## Header 组件布局

### 安装 styled-components

在 styled-components 使用 injectGlobal 注入全局 reset.css

**注意**：在 v4 中，injectGlobal 被移除，并被 createGlobalStyle 取代。若报错，把 injectGlobal 改为 createGlobalStyle

styled-components 的优点:

样式写在 js 文件里，降低 js 对 css 文件的依赖、

避免了组件 css 样式冲突的问题、

样式可以使用变量，更加灵活。

### 引入 iconfont

引入 iconfont.css、iconfont.eot、iconfont.svg、iconfont.ttf、iconfont.woff 五个文件

将 iconfont.css 的 url 路径前面加一个./ 作为相对路径引入（data 那个不用，那个是 base64）

把 iconfont.css 改成 js 文件，用 injectGlobal 注入全局样式

与 style.js 一样，在 src 的 index.js 里用 import 引入

```js
import "./style.js";
import "./statics/iconfont/iconfont";
```

### 导航栏搜索展开

通过设置 this.state.focused 的 false 和 true 的状态来控制

给 navsearch 绑定 onFocus 和 onBlur 来实现

同时给 navsearch 设置*className* _=_ {_this_.state.focused _?_ 'focused' _:_ ''}

然后添加 css 动画，使用*import* { CSSTransition } _from_ 'react-transition-group';来实现

## Redux 和 React-redux

首先 npm 安装，然后创建 store 文件夹，新建 index.js 和 reducer.js 文件

在 index 文件中通过 createStore 创建 store 实例，然后通过在 reducer 中定义一个默认的状态来传递

reducer 导出一个纯函数，第一个参数为 state _=_ defaultState，第二个参数为 action ，返回 state。

接下来进入 app.js，引入 store 和 Provider：

```js
import { Provider } from "react-redux";
import store from "./store";
```

然后在`<Header/>` 外部用`<Provider store={store}>`包裹

作用是被 Provider 包裹的组件都有能力去使用 store 里的数据了

然后在 header 的 index.js 里用 connect 来接收数据：

```js
export default connect(mapStateToProps, mapDispathToProps)(Header);
```

接下来写 mapStateToProps 和 mapDispathToProps 两个方法：

```js
//把state里的映射到props里
const mapStateToProps = (state) => {
  return {
    focused: state.focused,
  };
};
//将action类型传递给reducer
const mapDispathToProps = (dispatch) => {
  return {
    handleInputFocus() {
      const action = {
        type: "search_focus",
      };
      dispatch(action);
    },
    handleInputBlur() {
      const action = {
        type: "search_blur",
      };
      dispatch(action);
    },
  };
};
```

然后将之前构造函数里定义的 focused 状态移动到 reducer 里的默认状态，然后对 action.type 做类型判断，执行不同的状态改变机制。

```js
const defaultState = {
  focused: false,
};

export default (state = defaultState, action) => {
  if (action.type === "search_focus") {
    return {
      focused: true,
    };
  }
  if (action.type === "search_blur") {
    return {
      focused: false,
    };
  }
  return state;
};
```

此时，Header 组件已经变为一个无状态组件，因此可以去掉 class Header extends Components{}

改为 const Header _=_ (props) _=>_ { return( 这里面是之前的组件代码块 ) }

同时由于是箭头函数，因此里面的 this.props 全部可以改为 props。

## 代码拆分

下一步使用 combineReducers 完成对数据的拆分管理

在 Header 组件下新建 store 文件夹，创建 index.js 和 reducer.js

将之前在 reducer.js 下的代码复制粘贴到 Header 下的 reducer.js ，然后在总的 reducer.js 下写入：

```js
import { combineReducers } from "redux";
import { reducer as headerReducer } from "../common/header/store";

const reducer = combineReducers({
  header: headerReducer,
});

export default reducer;
```

这样就完成了对 reducer 的拆分。

继续拆分：

action 不要直接使用字符串，类型要替换成常量并且使用 actionCreators 来创建。

创建 actionCreators.js 文件：

```js
export const searchFocus = () => ({
  type: "search_focus",
});

export const searchBlur = () => ({
  type: "search_blur",
});
```

然后在 header 组件里的 index.js 文件里改写 mapDispathToProps 方法：

```js
import * as actionCreators from "./store/actionCreators"; //引入 actionCreators
const mapDispathToProps = (dispatch) => {
  return {
    handleInputFocus() {
      dispatch(actionCreators.searchFocus());
    },
    handleInputBlur() {
      dispatch(actionCreators.searchBlur());
    },
  };
};
```

接下来创建 constants.js ，在里面定义常量（加一个 header，相当于命名空间）：

```js
export const SEARCH_FOCUS = "header/SEARCH_FOCUS";
export const SEARCH_BLUR = "header/SEARCH_BLUR";
```

然后在 actionCreators.js 文件里引入 constants ，并用常量替换字符串

```js
import * as constants from "./constants";

export const searchFocus = () => ({
  type: constants.SEARCH_FOCUS,
});

export const searchBlur = () => ({
  type: constants.SEARCH_BLUR,
});
```

最后，在 header 的 store 的 index 里将 actionCreators 和 constants 合并一起导入：

```js
import reducer from "./reducer";
import * as actionCreators from "./actionCreators";
import * as constants from "./constants";

export { reducer, actionCreators, constants };
```

至此，拆分基本完成！

## 引入 immutable.js

Immutable Data 一旦创建，就不能再被更改。

对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。

首先在 reducer.js 里引入 immutable.js，然后给 defaultState 套上 fromJS ，这样里面的对象就变为不可更改的对象，只能通过 set 和 get 方法修改调用。

```js
import * as constants from "./constants";
import { fromJS } from "immutable";

const defaultState = fromJS({
  focused: false,
});
//immutable对象的set方法，会结合之前的immutable对象的值和设置的值，返回一个全新的对象
export default (state = defaultState, action) => {
  if (action.type === constants.SEARCH_FOCUS) {
    return state.set("focused", true);
  }
  if (action.type === constants.SEARCH_BLUR) {
    return state.set("focused", false);
  }
  return state;
};

//index.js
const mapStateToProps = (state) => {
  return {
    focused: state.header.get("focused"),
  };
};
```

## 下拉框热门搜索实现

Ajax 获取数据，使用 redux-thunk 中间件

中间件是指在 action 和 store 之间，使得可以在 action 里面写异步的代码

其实就是对 store 的 dispatch 方法升级，本来只能接受一个对象，现在也可以接受一个函数。

首先在 store 的 index 里引入 redux-thunk：

```js
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
```

接下来在 index.js 里用 dispatch 返回 getList 函数

```js
//将action类型传递给reducer
const mapDispathToProps = (dispatch) => {
  return {
    handleInputFocus() {
      dispatch(actionCreators.getList());
      dispatch(actionCreators.searchFocus());
    },
    handleInputBlur() {
      dispatch(actionCreators.searchBlur());
    },
  };
};
```

然后在 actionCreators 里写 getList 方法

```js
const changeList = (data) => ({
  type: constants.CHANGE_LIST,
  data: fromJS(data),
});

export const getList = () => {
  return (dispatch) => {
    axios
      .get("/api/headerList.json")
      .then((res) => {
        const data = res.data;
        dispatch(changeList(data.data));
      })
      .catch(() => {
        console.log("error");
      });
  };
};
```

在 public 下创建 API 文件夹，写入 headerList.json 文件

```json
{
  "success": true,
  "data": [
    "前端",
    "区块链",
    "三生三世",
    "崔永元",
    "vue",
    "小程序",
    "茶点微小说",
    "萨沙讲史堂",
    "夜幕下的地安门",
    "擦亮你的眼",
    "理财",
    "毕业",
    "手帐",
    "简书交友",
    "spring",
    "古风",
    "故事",
    "暖寄归人",
    "旅行",
    "连载",
    "教育",
    "简书",
    "生活",
    "投稿",
    "历史",
    "PHP",
    "考研",
    "docker",
    "EOS",
    "微信小程序",
    "PPT",
    "职场",
    "大数据",
    "创业",
    "书评",
    "东凤",
    "饱醉豚",
    "雨落荒原",
    "程序员",
    "爬虫",
    "时间管理",
    "kotlin",
    "数据分析",
    "阴阳合同",
    "设计",
    "红楼梦",
    "父亲节",
    "女人和衣服",
    "swift",
    "高考作文"
  ]
}
```

然后去 reducer.js 里更新 state 状态并返回

```js
import * as constants from "./constants";
import { fromJS } from "immutable";

const defaultState = fromJS({
  focused: false,
  list: [],
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.SEARCH_FOCUS:
      return state.set("focused", true);
    case constants.SEARCH_BLUR:
      return state.set("focused", false);
    case constants.CHANGE_LIST:
      return state.set("list", action.data);
    default:
      return state;
  }
};
```

接下来就可以在 mapStateToProps 获取到更新的 state，然后映射到 props 里

```js
//把state里的映射到props里
const mapStateToProps = (state) => {
  return {
    //focused : state.get('header').get('focused')
    focused: state.getIn(["header", "focused"]),
    list: state.getIn(["header", "list"]),
  };
};
```

即可初步实现下拉框热门搜索功能

```jsx
getListArea(){
    const { focused,list } = this.props
    if(focused){
      return(
        <SearchInfo>
          <SearchInfoTitle>
            热门搜索
            <SearchInfoSwitch>换一批</SearchInfoSwitch>
          </SearchInfoTitle>
          <SearchInfoList>
            {
              list.map((item) => {
                return <SearchInfoItem key={item}>{item}</SearchInfoItem>
              })
            }
          </SearchInfoList>
        </SearchInfo>
      )
    }else{
      return null;
    }
  }
```

接下来解决鼠标悬停和分页功能

首先解决鼠标悬停，在 SearchInfo 上绑定移入移出两个方法，然后跟上面一样，常规操作即可

```js
//index.js
<SearchInfo
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
>
  //mapDispathToProps
    handleMouseEnter(){
      dispatch(actionCreators.mouseEnter());
    },
    handleMouseLeave(){
      dispatch(actionCreators.mouseLeave());
    },

  //actionCreators.js
  export const mouseEnter = () => ({
	type: constants.MOUSE_ENTER
});
	export const mouseLeave = () => ({
	type: constants.MOUSE_LEAVE
});

//reducer.js
    case constants.MOUSE_ENTER:
			return state.set('mouseIn', true);
    case constants.MOUSE_LEAVE:
			return state.set('mouseIn', false);
```

然后是分页功能的实现

```jsx
    const newList = list.toJS(); //list是immutable对象，要把它转成js对象才能直接修改[i]
    const pageList = [];
    if(newList.length){
      for (let i = (page - 1) * 10; i < page * 10; i++){
        pageList.push(
          <SearchInfoItem key={newList[i]}>{newList[i]}</SearchInfoItem>
        )
      }
    }

<SearchInfoSwitch onClick={() => handleChangePage(page,totalPage)}>换一批</SearchInfoSwitch>

    totalPage: state.getIn(['header', 'totalPage']),

    handleChangePage(page,totalPage){
      if( page < totalPage ){
        dispatch(actionCreators.changePage(page + 1));
      }else{
        dispatch(actionCreators.changePage(1));
      }
    }

//actionCreators.js
export const changePage = (page) => ({
	type: constants.CHANGE_PAGE,
	page
});

//reducer.js
    case constants.CHANGE_PAGE:
			return state.set('page', action.page);
```

最后是换一批的旋转动画实现

```jsx
 <SearchInfoSwitch
    onClick={() => handleChangePage(page,totalPage,this.spinIcon)}
>
    <i ref={(icon) => {this.spinIcon = icon}} className="iconfont spin">&#xe851;</i>
       换一批
    </SearchInfoSwitch>
//先用ref获取到i标签真实的dom节点

	handleChangePage(page,totalPage,spin){
      let originAngle = spin.style.transform.replace(/[^0-9]/ig, '');
      //把非数字换成空（360deg => 360）
			if (originAngle) {
				originAngle = parseInt(originAngle, 10); //十进制正整数
			}else {
				originAngle = 0;
			}
			spin.style.transform = 'rotate(' + (originAngle + 360) + 'deg)';

      if( page < totalPage ){
        dispatch(actionCreators.changePage(page + 1));
      }else{
        dispatch(actionCreators.changePage(1));
      }
    }
```

## 优化请求发送

每一次聚焦搜索框都会发一次下拉框请求，需要优化改为只第一次聚焦发送请求。

在 index.js 里处理：

```jsx
    const { focused, handleInputFocus, handleInputBlur,list } = this.props;
		<NavSearch
       className = {focused ? 'focused' : ''}
       onFocus = {() => handleInputFocus(list)} //传一个list进去
       onBlur = {handleInputBlur}
    ></NavSearch>

		handleInputFocus(list){
      // console.log(list); 查看发现有个size属性可以作为变量控制
      if(list.size === 0){
        dispatch(actionCreators.getList());
      }
      dispatch(actionCreators.searchFocus());
    },
```

## 路由

首先安装路由，使用 react-router-dom 引入 BrowserRouter 和 Route。

BrowserRouter 嵌套 Route 定义路由，path 为路径，exact 为精确匹配，不加 exact 会导致匹配`/detail`时同时匹配 /

```jsx
import { BrowserRouter, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Header />
          <BrowserRouter>
            <div>
              <Route path="/" exact render={() => <div>home</div>}></Route>
              <Route
                path="/detail"
                exact
                render={() => <div>detail</div>}
              ></Route>
            </div>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}
```

## Home 首页

将 Home 组件进行拆分，主要分为 Topic、List、Recommend、Writer 四个子组件

```jsx
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Topic from "./components/Topic";
import List from "./components/List";
import Recommend from "./components/Recommend";
import Writer from "./components/Writer";
import { actionCreators } from "./store";

import { HomeWrapper, HomeLeft, HomeRight, BackTop } from "./style";

class Home extends PureComponent {
  handleScrollTop() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <HomeWrapper>
        <HomeLeft>
          <img
            className="banner-img"
            alt=""
            src="https://upload.jianshu.io/admin_banners/web_images/5055/348f9e194f4062a17f587e2963b7feb0b0a5a982.png?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540"
          />
          <Topic />
          <List />
        </HomeLeft>
        <HomeRight>
          <Recommend />
          <Writer />
        </HomeRight>
        {this.props.showScroll ? (
          <BackTop onClick={this.handleScrollTop}>TOP</BackTop>
        ) : null}
      </HomeWrapper>
    );
  }
  componentDidMount() {
    this.props.changeHomeData();
    this.bindEvents();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.props.changeScrollTopShow); // 解绑
  }

  bindEvents() {
    window.addEventListener("scroll", this.props.changeScrollTopShow); //事件绑定
  }
}

const mapState = (state) => ({
  showScroll: state.getIn(["home", "showScroll"]),
});

const mapDispatch = (dispatch) => ({
  changeHomeData() {
    dispatch(actionCreators.getHomeInfo());
  },
  changeScrollTopShow() {
    if (document.documentElement.scrollTop > 200) {
      dispatch(actionCreators.toggleTopShow(true));
    } else {
      dispatch(actionCreators.toggleTopShow(false));
    }
  },
});

export default connect(mapState, mapDispatch)(Home);
```

Topic 组件：

```jsx
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { TopicWrapper, TopicItem } from "../style";

class Topic extends PureComponent {
  render() {
    const { list } = this.props;
    return (
      <TopicWrapper>
        {list.map((item) => (
          <TopicItem key={item.get("id")}>
            <img className="topic-pic" src={item.get("imgUrl")} alt="" />
            {item.get("title")}
          </TopicItem>
        ))}
      </TopicWrapper>
    );
  }
}

const mapState = (state) => {
  return {
    list: state.getIn(["home", "topicList"]),
  };
};

export default connect(mapState, null)(Topic);
```

List 组件：

使用动态路由的方法：

```jsx
to={ '/detail/' + item.get('id') }
```

然后在 APP.js 里更改路由路径

```jsx
<Route path='/detail/:id' exact component={Detail}></Route> {/* 动态路由 */}
```

```jsx
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { ListItem, ListInfo, LoadMore } from "../style";
import { actionCreators } from "../store";
import { Link } from "react-router-dom";

class List extends PureComponent {
  render() {
    const { list, getMoreList, page } = this.props;
    return (
      <div>
        {list.map((item, index) => {
          return (
            <Link key={index} to={"/detail/" + item.get("id")}>
              {" "}
              {/* 动态路由 */}
              <ListItem>
                {/* key={item.get('id')} */}
                <img src={item.get("imgUrl")} alt="" className="pic" />
                <ListInfo>
                  <h3 className="title">{item.get("title")}</h3>
                  <p className="desc">{item.get("desc")}</p>
                </ListInfo>
              </ListItem>
            </Link>
          );
        })}
        <LoadMore
          onClick={() => {
            getMoreList(page);
          }}
        >
          阅读更多
        </LoadMore>
      </div>
    );
  }
}

const mapState = (state) => ({
  list: state.getIn(["home", "articleList"]),
  page: state.getIn(["home", "articlePage"]),
});

const mapDispatch = (dispatch) => ({
  getMoreList(page) {
    dispatch(actionCreators.getMoreList(page));
  },
});

export default connect(mapState, mapDispatch)(List);
```

Recommend 组件

```jsx
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { RecommendWrapper, RecommendItem } from "../style";

class Recommend extends PureComponent {
  render() {
    const { list } = this.props;
    return (
      <RecommendWrapper>
        {list.map((item) => {
          return (
            <RecommendItem imgUrl={item.get("imgUrl")} key={item.get("id")} />
          );
        })}
      </RecommendWrapper>
    );
  }
}

const mapState = (state) => ({
  list: state.getIn(["home", "recommendList"]),
});

export default connect(mapState, null)(Recommend);
```

Writer 组件

```jsx
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  WriterWrapper,
  WriterInfoSwitch,
  WriterItem,
  WriterButton,
} from "../style";

class Writer extends PureComponent {
  render() {
    const { list } = this.props;
    return (
      <WriterWrapper>
        <div className="WriterHeader">
          推荐作者
          <WriterInfoSwitch>
            <i className="iconfont spin">&#xe851;</i>
            换一批
          </WriterInfoSwitch>
        </div>
        {list.map((item, index) => {
          return (
            <WriterItem key={index}>
              <img src={item.get("imgUrl")} alt="" className="writer-pic" />
              <div className="name">{item.get("name")}</div>
              <div className="follow">+关注</div>
              <div className="introduction">{item.get("introduction")}</div>
            </WriterItem>
          );
        })}
        {/* <WriterItem>
							<img className='writer-pic' alt='' src=''/>
							<div className='name'>念远怀人</div>
							<div className='follow'>+关注</div>
							<div className='introduction'>写了 700.4k 字・14.7k 喜欢</div>
					</WriterItem> */}
        <WriterButton>查看全部</WriterButton>
      </WriterWrapper>
    );
  }
}

const mapState = (state) => ({
  list: state.getIn(["home", "writerList"]),
});

export default connect(mapState, null)(Writer);
```

## 首页性能优化

PureComponent 纯组件

底层实现了一个 shouldComponentUpdate( )

只有和组件相关的数据发生改变的时候，组件才会重新 render（ ） 渲染

操作：把所有 Component 全部换为 PureComponent

建议：如果用 PureComponent，务必之前要用 immutable.js

## Detail 详情页

dangerouslySetInnerHTML 是 React 标签的一个属性，类似于 angular 的 ng-bind。

在 Content 中，通过富文本编辑器进行操作后的内容，会保留原有的标签样式，并不能正确展示。

在显示时，将内容写入\_\_html 对象中即可。

既可以插入 DOM，又可以插入字符串。

不合时宜的使用 innerHTML 可能会导致 cross-site scripting (XSS) 攻击。

净化用户的输入来显示的时候，经常会出现错误，不合适的净化也是导致网页攻击的原因之一。

dangerouslySetInnerHTML 这个 prop 的命名是故意这么设计的，以此来警告，它的 prop 值（ 一个对象而不是字符串 ）应该被用来表明净化后的数据。

```jsx
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { DetailWrapper, Header, Content } from "./style";
import { actionCreators } from "./store";

class Detail extends PureComponent {
  render() {
    return (
      <DetailWrapper>
        <Header>{this.props.title}</Header>
        <Content
          dangerouslySetInnerHTML={{ __html: this.props.content }} //防止转译
        />
      </DetailWrapper>
    );
  }

  componentDidMount() {
    this.props.getDetail(this.props.match.params.id);
  }
}

const mapState = (state) => ({
  title: state.getIn(["detail", "title"]),
  content: state.getIn(["detail", "content"]),
});

const mapDispatch = (dispatch) => ({
  getDetail(id) {
    dispatch(actionCreators.getDetail(id));
  },
});

export default connect(mapState, mapDispatch)(withRouter(Detail));
```

detail.json 里由于 content 里有图片和文字，为保证 HTML 页面显示正常，因此返回一个合并后的字符串。

```json
{
  "success": true,
  "data": {
    "title": "衡水中学，被外地人占领的高考工厂",
    "content": "<img src='//upload-images.jianshu.io/upload_images/10295326-b7d6641a66c7fafc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/524'/><p><b>2017年，衡水中学考上清华北大的人数是176人</b>，2016年是139人，再往前推到2015年，这个人数是119人。但是在这些辉煌的名单背后，却是外地来衡水上学人数暴涨，本地人上好高中越来越艰难的尴尬处境。</p><p>2017年，衡水中学考上清华北大的人数是176人，2016年是139人，再往前推到2015年，这个人数是119人。但是在这些辉煌的名单背后，却是外地来衡水上学人数暴涨，本地人上好高中越来越艰难的尴尬处境。</p><p>2017年，衡水中学考上清华北大的人数是176人，2016年是139人，再往前推到2015年，这个人数是119人。但是在这些辉煌的名单背后，却是外地来衡水上学人数暴涨，本地人上好高中越来越艰难的尴尬处境。</p><p>2017年，衡水中学考上清华北大的人数是176人，2016年是139人，再往前推到2015年，这个人数是119人。但是在这些辉煌的名单背后，却是外地来衡水上学人数暴涨，本地人上好高中越来越艰难的尴尬处境。</p>"
  }
}
```

## 异步组件

使用 react-loadable

react-loadable : 用于加载带有动态导入的组件的高阶组件，它允许在将任何模块呈现到应用程序之前动态加载它。

```jsx
//loadable.js

import React from "react";
import Loadable from "react-loadable";

const LoadableComponent = Loadable({
  loader: () => import("./"),
  loading() {
    return <div>正在加载</div>; //临时的一个显示组件
  },
});

export default () => <LoadableComponent />;

//APP.js
import Detail from "./pages/detail/loadable";
```

直接这样使用会导致 detail.js 里的`this.props.getDetail(this.props.match.params.id);`报错

解决办法：引入 withRouter ，让 detail 有能力获取到 router 里的所有参数和内容

```jsx
export default connect(mapState, mapDispatch)(withRouter(Detail));
```

原理：高阶组件中的 withRouter, 作用是将一个组件包裹进 Route 里面，然后 react-router 的三个对象 history, location, match 就会被放进这个组件的 props 属性中。如果我们某个东西不是一个 Router, 但是我们要依靠它去跳转一个页面，比如点击页面的 logo, 返回首页，这时候就可以使用 withRouter 来做.

## 访问图片资源 403 问题 (http referrer)

项目中碰到一个问题，就是通过 img 标签引入一个图片地址，不显示图片报 403 (防止盗链)。

但是这个图片地址直接复制出来在地址栏打开，却是看得到的。

解决方法：在 HTML 代码的 head 中添加一句 `<meta name="referrer" content="no-referrer" />`

http referrer 原理：

http 请求体的 header 中有一个 referrer 字段，用来表示发起 http 请求的源地址信息

这个 referrer 信息是可以省略但是不可修改的，就是说你只能设置是否带上这个 referrer 信息，不能定制 referrer 里面的值。

服务器端在拿到这个 referrer 值后就可以进行相关的处理，比如图片资源，可以通过 referrer 值判断请求是否来自本站，若不是则返回 403 或者重定向返回其他信息，从而实现图片的防盗链。

出现 403 就是因为，请求的是别人服务器上的资源，但把自己的 referrer 信息带过去了，被对方服务器拦截返回了 403。

在前端可以通过 meta 来设置 referrer policy (来源策略)，所以针对 403 情况的解决方法，就是把 referrer 设置成 `no-referrer`，这样发送请求不会带上 referrer 信息，对方服务器也就无法拦截了。

浏览器中 referrer 默认的值是 `no-referrer-when-downgrade`，就是除了降级请求的情况以外都会带上 referrer 信息。降级请求是指 https 协议的地址去请求 http 协议，所以上面 403 的情况还有另一种解决方法就是，请求的图片地址换成 http 协议，自己的地址使用 http 协议，这样降级请求也不会带上 referrer。
