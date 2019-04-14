import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import casual from "casual-browserify";

import {
	Avatar,
	BASE_COMMENTS_URL,
	BASE_POSTS_URL,
	CommentHeader,
	Comments,
	StateTree
} from "./common";

class ExampleOneNoNormalising extends Component {
	state = {
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

			/**
			 * Here you would either need to:
			 * A) fetch the posts again to get the posts with updated comment; or
			 * B) manually find and modify the post and comment in the state tree
			 */

			const data = await fetch(BASE_POSTS_URL)
			const posts = await data.json();

			this.setState({
				posts
			});
		} catch (e) {
			console.log(e);
			this.setState({ error: true })
		}
	}

	render() {
		const { error, posts } = this.state;

		if (error) {
			return <div>Something went wrong, yikes</div>
		}

		return (
			<div>
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
