import React, {Component} from 'react';
import { PostWrapper, Navigate, Post, Warning } from '../../components';
import * as service from '../../services/post';

class PostContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postId: 1,
            fetching: false,
            post: {
                title: null,
                body: null
            },
            comments: [],
            warningVisibility: false
        };
    }

    fetchPostInfo = async (postId) => {
        // const post = await service.getPost(postId);
        // console.log(post);
        // const comments = await service.getComments(postId);
        // console.log(comments);
        this.setState({
            fetching: true
        });
        try {
            const info = await Promise.all([
                service.getPost(postId),
                service.getComments(postId)
            ]);
            // console.log(info);
            const {title, body} = info[0].data;
            const comments = info[1].data;
            this.setState({
                postId,
                post: {
                    title,
                    body
                },
                comments,
                fetching: false
            });
        } catch (e) {
            this.setState({
                fetching: false
            });
            // console.log('error occurred.', e);
            this.showWarning();
        }
    };

    showWarning = () => {
        this.setState({
            warningVisibility: true
        });
        setTimeout(
            () => {
                this.setState({
                    warningVisibility: false
                });
            }, 1500
        );
    };

    handleNavicateClick = (type) => {
        const postId = this.state.postId;

        if (type === 'NEXT') {
            this.fetchPostInfo(postId + 1);
        } else {
            this.fetchPostInfo(postId - 1);
        }
    };

    componentDidMount() {
        this.fetchPostInfo(1);
    }

    render() {
        const {postId, fetching, post, comments, warningVisibility} = this.state;
        return (
            <PostWrapper>
                <Navigate
                    postId={postId}
                    disabled={fetching}
                    onClick={this.handleNavicateClick}
                />
                <Post
                    postId={postId}
                    title={post.title}
                    body={post.body}
                    comments={comments}
                />
                <Warning visible={warningVisibility} message="That post does not exist."/>
            </PostWrapper>
        );
    }
}

export default PostContainer;
