import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import casual from "casual-browserify";
import merge from "lodash/merge";
import { normalize, schema } from "normalizr";

import {
	Avatar,
	BASE_COMMENTS_URL,
	BASE_POSTS_URL,
	CommentHeader,
	Comments,
	StateTree
} from "./common";

const COMMENT_SCHEMA = new schema.Entity("comments");
const COMMENTS_SCHEMA = [COMMENT_SCHEMA];

const POST_SCHEMA = new schema.Entity("posts", { comments: COMMENTS_SCHEMA });
const POSTS_SCHEMA = [POST_SCHEMA];

class ExampleOneNoNormalising extends Component {
	state = {
		entities: {},
		posts: [],
		error: false
	}

	async componentDidMount() {
		try {
			const data = await fetch(BASE_POSTS_URL)
			const posts = await data.json();
			console.log("TCL: ExampleOneNoNormalising -> componentDidMount -> posts", posts)

			const normalizedData = normalize(posts, POSTS_SCHEMA);
			console.log("TCL: ExampleOneNoNormalising -> componentDidMount -> normalizedData", normalizedData)

			this.setState({
				entities: normalizedData.entities,
				posts: normalizedData.result
			});
		} catch (e) {
			console.log(e);
			this.setState({ error: true });
		}
	}

	handleUpdateComment = async (id) => {
		console.log(`updating comment ${id}!`);

		const url = `${BASE_COMMENTS_URL}/${id}`;

		try {
			const response = await fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ body: casual.catch_phrase })
			})

			const updatedComment = await response.json();
			console.log("TCL: App -> handleUpdateComment -> updatedComment", updatedComment)

			const normalizedData = normalize(updatedComment, COMMENT_SCHEMA);
			const updatedEntities = merge(this.state.entities, normalizedData.entities);

			this.setState({ entities: updatedEntities });

		} catch (e) {
			console.log(e);
			this.setState({ error: true })
		}
	}

	render() {
		const { error, posts, entities } = this.state;

		if (error) {
			return <div>Something went wrong, yikes</div>
		}

		return (
			<div>
				<CardDeck>
					{posts.map(postId => {
						const post = entities.posts[postId];
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
										{post.comments.map(commentId => {
											const comment = entities.comments[commentId];

											if (!comment) { return null; }

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
															Update comment
														</Button>
													</Card.Body>
												</Card>
											)
										})}
									</Comments>
								</Card.Body>
							</Card>
						)
					})}
				</CardDeck>
				<StateTree state={this.state} />
			</div>
		);
	}
}

export default ExampleOneNoNormalising;
