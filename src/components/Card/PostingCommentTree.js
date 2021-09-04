import React, { useState } from 'react';
import Button from "@material-ui/core/Button";


const postingCommentTree = (props) => {
    const flatComments = props.comments.map(fc => {
        return {
            isRoot: fc.parentPostId === fc.postId,
            postId: fc.postId,
            parentPostId: fc.parentPostId,
            description: fc.description,
            date: fc.date,
            numVisibleChildren: fc.postId === fc.ultimateParentPostId ? 2 : 0,
            numImmediateChildren: props.comments.filter(x => x.parentPostId === fc.postId && x.parentPostId != x.postId).length
        }
    })
    const [nodes, setNodes] = useState(flatComments);

    const maxLevel = 2;

    const readMore = (postId) => {
        const copy = [...nodes];
        const nodeFound = copy.find(x => x.postId === postId)
        nodeFound.numVisibleChildren = nodeFound.numVisibleChildren + 2;
        setNodes(copy);
    }

    const recurHelper = (postId, level) => {


        if (level > maxLevel) {
            return "";
        }

        const item = nodes.find((c) => c.postId === postId);
        // console.log(postId, item);
        const children = nodes.filter((c) => c.parentPostId === postId && ! c.isRoot) || [];
        const sortByDate = (c) => {
            return c?.sort((a, b) => -a.date.localeCompare(b.date))
        }

        const topNChildren = sortByDate(children).slice(0, item.numVisibleChildren);
        console.log(item.description, topNChildren);
        return (
            <div>
                {postingCommentCard(item, level)}
                {topNChildren.map((child) => (
                    <div>
                        {recurHelper(child.postId, level + 1)}
                    </div>
                ))}
                {level < 2 && item.numVisibleChildren < item.numImmediateChildren &&
                    <div>
                        <Button
                            onClick={() => readMore(item.postId)}
                        >Read More</Button>
                    </div>}
            </div>
        );
    }

    const postingCommentCard = (node, level) => {
        const boxStyle = {
            marginLeft: 40 * (level - 1) + "px",
            marginBottom: "15px",
            padding: "9px",
            borderRadius: "15px",
            backgroundColor: "aliceblue"
        };
        //level 0 is the post itself
        return (
            <div>
                {level > 0 &&
                    <div style={boxStyle}>
                        <span>{node?.description}</span>{" "}
                        <span>
                            {" "}
                            (postId: {node?.postId} level: {level})
                        </span>
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