import React, { Fragment } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled, { createGlobalStyle } from "styled-components";

export const guidGenerator = () => {
	const S4 = () => {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export const Avatar = styled.img`
	border-radius: 50%;
	margin-right: 12px;
`

export const Comments = styled.div`
	& > div {
		margin-bottom: 12px !important;
	}
`;
export const CommentHeader = styled.h6`
	margin-bottom: 12px;
`

export const BASE_URL = "http://localhost:3001";
export const BASE_POSTS_URL = `${BASE_URL}/posts?_embed=comments`;
export const BASE_COMMENTS_URL = `${BASE_URL}/comments`

const syntaxHighlight = stringifiedJson => {
	return stringifiedJson.replace(/<br\s\/>/g, '&lt;br /&gt;')
		.replace(/<br>/g, '&lt;br&gt;')
		.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
			var cls = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'key';
				} else {
					cls = 'string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			return `<span class="${cls}">${match}</span>`;
		});
}

const PrettyJSON = styled.pre`
	padding: 12px;
	white-space: pre-wrap;
`;

const GlobalStyle = createGlobalStyle`
	.key {
		color: #2680C2;
	}

	.string {
		color: #27AB83;
	}

	.number {
		color: #C99A2E;
	}

	.boolean {
		color: #C99A2E;
	}
`;

export const StateTree = ({ state }) => {
	const stringifiedJSON = JSON.stringify(state, null, 2);
	const syntaxHighlightedJSON = syntaxHighlight(stringifiedJSON);

	return (
		<Fragment>
			<br />
			<Row>
				<Col>
					<h1>State tree</h1>
					<PrettyJSON dangerouslySetInnerHTML={{ __html: syntaxHighlightedJSON }} />
				</Col>
			</Row>
			<GlobalStyle />
		</Fragment>
	)
}

export default guidGenerator;