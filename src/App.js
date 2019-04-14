import React, { Component } from "react";
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import ExampleOneNoNormalising from './ExampleOneNoNormalising';
import ExampleTwoNormalising from './ExampleTwoNormalising';

const Heading = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
`;

const Links = styled.div`
	& > a:not(:last-of-type) {
		margin-right: 12px;
	}
`;

class App extends Component {
	render() {
		return (
			<Router>
				<Container style={{ marginTop: "24px"}}>
					<Row>
						<Col>
							<Heading>
							<h1>Posts</h1>
							<Links>
								<Link to="/example-one">Example one - No Normalising</Link>
								<Link to="/example-two">Example two - Normalising</Link>
							</Links>
							</Heading>
							<Route path="/" exact component={ExampleOneNoNormalising} />
							<Route path="/example-one" exact component={ExampleOneNoNormalising} />
							<Route path="/example-two" exact component={ExampleTwoNormalising} />
						</Col>
					</Row>
				</Container>
			</Router>
		);
	}
}

export default App;