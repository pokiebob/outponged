import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import RenderComment from './RenderComment';

const postingCommentTree = (props) => {

    const flatComments = props.comments.map(fc => {
        return (
            {
                ...fc,
                isRoot: fc.parentPostId === fc.postId,
                numVisibleChildren: fc.postId === fc.ultimateParentPostId ? 2 : 0,
                numImmediateChildren: props.comments.filter(x => x.parentPostId === fc.postId && x.parentPostId != x.postId).length
            });
    });
    const [nodes, setNodes] = useState(flatComments);

    const maxLevel = 2;

    const readMore = (postId) => {
        const copy = [...nodes];
        const nodeFound = copy.find(x => x.postId === postId)
        nodeFound.numVisibleChildren = nodeFound.numVisibleChildren + 2;
        setNodes(copy);
    }

    const recurHelper = (postId, level) => {

        const commentStyle = {
            marginLeft: 60 * (level - 1) + "px",
        }
        const buttonStyle = {
            marginLeft: level === 0 ? "0px" : "60px"
        }

        const handleComment = (newCommentDescription) => {
            const newComment = {
                parentPostId: postId,
                description: newCommentDescription
            }
            // console.log('[PostingCommentTree.js]', newComment);
            props.postingCardHandleComment(newComment);
        }

        const postingCommentCard = (item, level) => {
            //level 0 is the post itself
            return (level > 0 &&
                <div style={commentStyle}>
                    <RenderComment comment={item} level={level} treeHandleComment={handleComment} />
                </div>
            );
        }

        if (level > maxLevel) {
            return "";
        }

        const item = nodes.find((c) => c.postId === postId);
        // console.log(postId, item);
        const children = nodes.filter((c) => c.parentPostId === postId && !c.isRoot) || [];
        const sortByDate = (c) => {
            return c?.sort((a, b) => -a.date.localeCompare(b.date))
        }

        const topNChildren = sortByDate(children).slice(0, item.numVisibleChildren);
        // console.log(item.description, topNChildren);
        return (
            <div>
                {postingCommentCard(item, level)}
                {topNChildren.map((child) => (
                    <div>
                        {recurHelper(child.postId, level + 1)}
                    </div>
                ))}
                {level < 2 && item.numVisibleChildren < item.numImmediateChildren &&
                    <div style={buttonStyle}>
                        <Button
                            size="small"
                            color="primary"
                            // style={{ marginLeft: "40px" }}
                            onClick={() => readMore(item.postId)}
                        >View More Comments</Button>
                    </div>}
            </div>
        );
    }

    return (
        <div>
            {recurHelper(props.ultimateParentPostId, 0)}
        </div>
    );
}

export default postingCommentTree;