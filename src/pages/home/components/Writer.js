import React, { PureComponent } from 'react';
import { connect } from "react-redux";
import { WriterWrapper,WriterInfoSwitch,WriterItem,WriterButton } from '../style';

class Writer extends PureComponent {

	render() {
    const { list } = this.props;
		return (
			<WriterWrapper>
				<div className='WriterHeader'>
				推荐作者
				<WriterInfoSwitch>
					<i className="iconfont spin">&#xe851;</i>
              换一批
					</WriterInfoSwitch>
				</div>
				{
					list.map((item,index) => {
            return (
              <WriterItem key={index}>
                <img src={item.get('imgUrl')} alt="" className="writer-pic" />
                <div className='name'>{item.get('name')}</div>
								<div className='follow'>+关注</div>
                <div className='introduction'>{item.get('introduction')}</div>
              </WriterItem>
            )
				})
			}
					{/* <WriterItem>
							<img className='writer-pic' alt='' src=''/>
							<div className='name'>念远怀人</div>
							<div className='follow'>+关注</div>
							<div className='introduction'>写了 700.4k 字・14.7k 喜欢</div>
					</WriterItem> */}
					<WriterButton>查看全部</WriterButton>
			</WriterWrapper>
		)
	}
}

const mapState = (state) => ({
	list: state.getIn(['home', 'writerList'])
})

export default connect(mapState,null)(Writer);
