import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";
import { BACKEND_URL } from "../../../env";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const graphqlQuery = {
      query: `
        query FetchPost ($postId: String!) {
          getPost(postId: $postId) {
            post {
              _id
              title
              content
              imageUrl
              createdAt
              creator {
                name
              }
            }
          }
        }
      `,
      variables: {
        postId
      }
    };

    fetch(`${BACKEND_URL}/graphql`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log("resData", resData);
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error("Post not found.");
        }
        if (resData.errors) {
          throw new Error("Failed to fetch a post.");
        }
        this.setState({
          title: resData.data.getPost.post.title,
          author: resData.data.getPost.post.creator.name,
          image: `${BACKEND_URL}/${resData.data.getPost.post.imageUrl}`,
          date: new Date(
            resData.data.getPost.post.createdAt
          ).toLocaleDateString("en-US"),
          content: resData.data.getPost.post.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
