import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import styled from "styled-components";

const Heading = styled.h1`
	margin-bottom: 24px;
`
const Avatar = styled.img`
	border-radius: 50%;
	margin-right: 12px;
`

const Comments = styled.div`
	& > div {
		margin-bottom: 12px !important;
	}
`;
const CommentHeader = styled.h6`
	margin-bottom: 12px;
`

const BASE_URL = "http://localhost:3001";
const BASE_POSTS_URL = `${BASE_URL}/posts?_embed=comments`;
const BASE_COMMENTS_URL = `${BASE_URL}/comments`

class ExampleOneNoNormalizr extends Component {
	state = {
		comments: {},
		posts: [],
		error: false
	}

	async componentDidMount() {
		try {
			const data = await fetch(BASE_POSTS_URL)
			const posts = await data.json();

			this.setState({
				posts
			});
		} catch (e) {
			console.log(e);
			this.setState({ error: true });
		}
	}

	handleUpdateComment = async (id) => {
		console.log(`updating comment ${id}!`);

		const randomHash = guidGenerator();
		const url = `${BASE_COMMENTS_URL}/${id}`;

		try {
			const response = await fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ hash: randomHash })
			})

			const updatedComment = await response.json();
			console.log("TCL: App -> handleUpdateComment -> updatedComment", updatedComment)
		} catch (e) {
			console.log(e);
			this.setState({ error: true })
		}
	}

	render() {
		const { comments, error, posts } = this.state;

		if (error) {
			return <div>Something went wrong, yikes</div>
		}

		return (
			<Container style={{ marginTop: "24px"}}>
				<Row>
					<Col>
						<Heading>Posts</Heading>
						<CardDeck>					
							{posts.map(post => {
								const { title, body, id } = post;

								return (
									<Card key={id}>
										<Card.Body>
											<Card.Title>{title}</Card.Title>
											<Card.Text>
												{body}
											</Card.Text>
											<CommentHeader className="text-muted">Comments:</CommentHeader>
											<Comments>
												{post.comments.map(comment => {
													return (
														<Card key={comment.id}>
															<Card.Body>
																<Card.Title>
																	<Avatar src={comment.avatar} alt="lol" /> {comment.name}
																</Card.Title>
																<Card.Text>
																	{comment.body}
																</Card.Text>
																<Button variant="primary" onClick={() => this.handleUpdateComment(comment.id)}>
																	Update comment hash
																</Button>
															</Card.Body>
															<Card.Footer>
																<small className="text-muted">{comment.hash}</small>
															</Card.Footer>
														</Card>
													)
												})}
											</Comments>
										</Card.Body>
										<Card.Footer>
											<small className="text-muted">post #{id}</small>
										</Card.Footer>
									</Card>
								)
							})}
						</CardDeck>
					</Col>
				</Row>

				<br/>

				<Row>
					<Col>
						<Heading>State tree:</Heading>
						<pre>
						{JSON.stringify({ posts, comments }, null, 2)}
						</pre>
					</Col>
				</Row>
			</Container>
		);
	}
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export default ExampleOneNoNormalizr;
