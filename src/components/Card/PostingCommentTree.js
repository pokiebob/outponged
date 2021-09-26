import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Link from "@material-ui/core/Link"
import RenderComment from './RenderComment';

const useStyles = makeStyles((theme) => ({
    commentsHeader: {
        paddingTop: "10px",
        borderTop: "1px solid lightgrey",
        marginTop: "10px",
        color: "gray",
        fontSize: "16px"
    }
}));

const postingCommentTree = (props) => {
    const classes = useStyles();

    const flatComments = props.comments.map(fc => {
        return (
            {
                ...fc,
                isFirstChild: false,
                isRoot: fc.parentPostId === fc.postId,
                numVisibleChildren: fc.postId === fc.ultimateParentPostId ? 2 : 0,
                numImmediateChildren: props.comments.filter(x => x.parentPostId === fc.postId && x.parentPostId != x.postId).length
            });
    });

    const isPlural = (num) => {
        return (num === 1 ? false : true);
    }

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
            marginLeft: 60 * (level > 1 ? level - 1 : 0) + "px",
        }
        const buttonStyle = {
            marginTop: "10px",
            marginLeft: level === 0 ? "0px" : "60px"
        }

        const postingCommentCard = (item, level) => {
            //level 0 is the post itself
            return (
                // level > 0 &&
                <div key={props.rootCommentOpen} style={commentStyle}>
                    <RenderComment 
                    comment={item} 
                    level={level} 
                    treeHandleComment={handleComment}
                    rootCommentOpen={props.rootCommentOpen}/>
                </div>
            );
        }

        if (level > maxLevel) {
            return "";
        }
        // console.log('nodes', nodes);
        const item = nodes.find((c) => c.postId === postId);
        if (! item) return undefined;
        // console.log(postId, item);
        const children = nodes.filter((c) => c.parentPostId === postId && !c.isRoot) || [];
        const sortByDate = (c) => {
            return c?.sort((a, b) => -a.date.localeCompare(b.date))
        }

        //callback function
        const handleComment = (newCommentDescription) => {
            const newComment = {
                parentPostId: level===2 ? item.parentPostId : postId,
                description: newCommentDescription
            }
            // console.log('[PostingCommentTree.js]', newComment);
            props.postingCardHandleComment(newComment);
        }

        const topNChildren = sortByDate(children).slice(0, item.numVisibleChildren);
        if (topNChildren.length > 0) {
            topNChildren[0].isFirstChild = true;
        }
        // console.log(item.description, topNChildren);
        return (
            <div>
                {postingCommentCard(item, level)}
                {topNChildren.map((child, idx) => (
                    <div key={idx}>
                        {recurHelper(child.postId, level + 1)}
                    </div>
                ))}
                {level < 2 && item.numVisibleChildren < item.numImmediateChildren &&
                    <div style={buttonStyle}>
                        <Link
                            href=""
                            color="primary"
                            style={{ fontSize: 14 }}
                            onClick={(e) => {
                                e.preventDefault();
                                readMore(item.postId);
                            }}
                        >{item.isRoot ? "View More" : item.numImmediateChildren - item.numVisibleChildren + (isPlural(item.numImmediateChildren - item.numVisibleChildren) ? " Replies" : " Reply")} </Link>
                    </div>}
            </div>
        );
    }

    return (
        <div>
            <div className={classes.commentsHeader}>{nodes.length - 1 + (isPlural(nodes.length - 1) ? " Comments" : " Comment")}</div>
            {recurHelper(props.ultimateParentPostId, 0)}
        </div>
    );
}

export default postingCommentTree;