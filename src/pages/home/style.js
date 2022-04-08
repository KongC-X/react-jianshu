import styled from 'styled-components';

export const HomeWrapper = styled.div`
	overflow: hidden;
	width: 960px;
	margin: 0 auto;
`;

export const HomeLeft = styled.div`
	float: left;
	margin-left: 15px;
	padding-top: 30px;
	width: 625px;
	.banner-img {
		display:block;
		width: 625px;
		height: 270px;
		border-radius:10px;
		cursor: pointer;
	}
`;

export const HomeRight = styled.div`
	width: 280px;
	float: right;
`;

export const TopicWrapper = styled.div`
	overflow: hidden;
	padding: 20px 0 10px 0;
	margin-left: -18px;
	border-bottom: 1px solid #dcdcdc;
`;

export const TopicItem = styled.div`
	float: left;
	height: 32px;
	line-height: 32px;
	margin-left: 18px;
	margin-bottom: 18px;
	padding-right: 10px
	background: #f7f7f7;
	font-size: 14px;
	color: #000;
	border: 1px solid #dcdcdc;
	border-radius: 4px;
	.topic-pic {
		display: block;
		float: left;
		width: 32px;
		height: 32px;
		margin-right: 10px;
	}
`;

export const ListItem = styled.div`
	overflow: hidden;
	padding: 20px 0;
	border-bottom: 1px solid #dcdcdc;
	.pic {
		display: block;
		width: 140px;
		height: 100px;
		float: right;
		border-radius: 10px;
	}
`;

export const ListInfo =	styled.div`
	width: 470px;
	float: left;
	.title {
		line-height: 27px;
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10px;
		color: #333;
	}
	.desc {
		line-height: 24px;
		font-size: 13px;
		color: #999;
	}
`;

export const RecommendWrapper = styled.div`
	margin: 30px 0;
	width: 280px;
`;

export const RecommendItem = styled.div`
	width: 280px;
	height: 50px;
	margin-bottom: 6px;
	background: url(${(props) => props.imgUrl});
	background-size: contain;
	cursor: pointer;
`;

export const LoadMore = styled.div`
	width: 100%;
	height: 40px;
	line-height: 40px;
	margin: 30px 0;
	background: #a5a5a5;
	text-align:center;
	border-radius: 20px;
	color: #fff;
	cursor: pointer;
`;

export const BackTop = styled.div`
	position: fixed;
	right: 100px;
	bottom: 100px;
	width: 60px;
	height: 60px;
	line-height: 60px;
	text-align: center;
	border: 1px solid #ccc;
	font-size: 14px;
	cursor: pointer;
	color: #a5a5a5;
`

export const WriterWrapper = styled.div`
	width: 278px;
	border-radius: 3px;
	height: 330px;
	color: #a5a5a5;
	font-size: 16px;
	position:relative;
`;

export const WriterInfoSwitch = styled.span`
	float: right;
	color: #a5a5a5;
	cursor: pointer;
	.spin {
		display: block;
		float: left;
		font-size: 14px;
		margin-right: 2px;
		transition: all .3s ease-in;
		transform-origin: center center;
	}
`;

export const WriterItem = styled.div`
	overflow:hidden;
	position:relative;
	margin-top:15px;
	.writer-pic {
		float:left;
		width: 48px;
		height: 48px;
		margin-right: 10px;
		border-radius: 50%;
	}
	.name{
		position:absolute;
		left:60px;
		width: 100px;
		height: 15px;
		font-size: 14px;
		color: #333;
	}
	.follow{
		position:absolute;
		right:0;
		width: 50px;
		height: 15px;
		font-size: 12px;
		cursor:pointer;
		color: #42c02e;
	}
	.introduction{
		position:absolute;
		top:30px;
		right:20px;
		width: 200px;
		height: 15px;
		font-size: 10px;
	}
`;

export const WriterButton = styled.div`
	overflow:hidden;
	display:block;
	position:absolute;
	width:100%;
	height:40px;
	border:1px solid #dcdcdc;
	line-height: 40px;
	margin: 10px 0;
	color: #787878;
	background: #f7f7f7;
	text-align:center;
	border-radius: 10px;
	cursor: pointer;
	font-size:12px;
`;