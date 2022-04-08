import React,{PureComponent} from "react";
import { connect } from "react-redux";
import Topic from './components/Topic';
import List from './components/List';
import Recommend from './components/Recommend';
import Writer from './components/Writer';
import {actionCreators} from './store'

import { 
	HomeWrapper,
  HomeLeft,
	HomeRight,
  BackTop
} from './style';

class Home extends PureComponent{

  handleScrollTop(){
    window.scrollTo(0,0);
  }

  render() {
    return (
      <HomeWrapper>
        <HomeLeft>
          <img className='banner-img' alt='' src="https://upload.jianshu.io/admin_banners/web_images/5055/348f9e194f4062a17f587e2963b7feb0b0a5a982.png?imageMogr2/auto-orient/strip|imageView2/1/w/1250/h/540" />
          <Topic />
          <List />
        </HomeLeft>
        <HomeRight>
          <Recommend />
          <Writer />
        </HomeRight>
        {this.props.showScroll ? <BackTop onClick={this.handleScrollTop}>TOP</BackTop> : null}
      </HomeWrapper>
    );
  }
  componentDidMount(){
    this.props.changeHomeData();
    this.bindEvents(); 
  }

  componentWillUnmount() {
		window.removeEventListener('scroll', this.props.changeScrollTopShow); // 解绑
	}

  bindEvents(){
    window.addEventListener('scroll',this.props.changeScrollTopShow)  //事件绑定
  }
}

const mapState = (state) => ({
  showScroll : state.getIn(['home','showScroll'])
})

const mapDispatch = (dispatch) => ({
  changeHomeData(){
    dispatch(actionCreators.getHomeInfo());
    },
  changeScrollTopShow(){
    if(document.documentElement.scrollTop > 200){
      dispatch(actionCreators.toggleTopShow(true));
    }else{
      dispatch(actionCreators.toggleTopShow(false));
    }
  }
})

export default connect(mapState,mapDispatch)(Home);