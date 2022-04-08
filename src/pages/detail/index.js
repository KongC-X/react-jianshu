import React,{PureComponent} from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DetailWrapper, Header, Content } from './style';
import { actionCreators } from './store';

class Detail extends PureComponent{
  render() {
    return (
      <DetailWrapper>
        <Header>{this.props.title}</Header>
        <Content 
        dangerouslySetInnerHTML={{__html: this.props.content}} //防止转译
        />
    </DetailWrapper>
    );
  }

  componentDidMount() {
		this.props.getDetail(this.props.match.params.id);
	}
}

const mapState = (state) => ({
	title: state.getIn(['detail', 'title']),
	content: state.getIn(['detail', 'content'])
});

const mapDispatch = (dispatch) => ({
	getDetail(id) {
		dispatch(actionCreators.getDetail(id));
	}
});

export default connect(mapState, mapDispatch)(withRouter(Detail));
